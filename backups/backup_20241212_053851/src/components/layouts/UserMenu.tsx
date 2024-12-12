import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { LogOut, User, KeyRound, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar: string | null;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name, avatar')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...profileData,
        email: session.user.email,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الملف الشخصي",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      setUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      await fetchProfile();
      toast({
        title: "تم تحديث الصورة الشخصية بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الصورة الشخصية",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile?.email || '',
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );
      if (error) throw error;
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رابط إعادة تعيين كلمة المرور",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar || ""} />
              <AvatarFallback>{profile?.full_name?.slice(0, 2) || "UN"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {profile?.full_name && (
                <p className="font-medium">{profile.full_name}</p>
              )}
              {profile?.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {profile.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
            <User className="ml-2 h-4 w-4" />
            <span>الملف الشخصي</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePasswordReset}>
            <KeyRound className="ml-2 h-4 w-4" />
            <span>تغيير كلمة المرور</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="ml-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الملف الشخصي</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar || ""} />
                <AvatarFallback>{profile?.full_name?.slice(0, 2) || "UN"}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  تغيير الصورة الشخصية
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </Label>
            </div>
            <div className="space-y-4">
              <div>
                <Label>الاسم</Label>
                <Input value={profile?.full_name || ""} readOnly />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input value={profile?.email || ""} readOnly />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}