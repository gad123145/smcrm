import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { generateId } from "@/lib/utils/id";
import { Upload, X } from "lucide-react";

const AddProperty = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    price: "",
    area: "",
    location: "",
    city: "",
    ownerName: "",
    ownerPhone: "",
    hasBasement: false,
    otherDetails: "",
    images: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProperty = {
        id: generateId(),
        ...formData,
        price: Number(formData.price),
        area: Number(formData.area),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Convert File objects to URLs or Base64 strings if needed
        images: formData.images.map(file => URL.createObjectURL(file)),
      };

      // Get existing properties
      const stored = localStorage.getItem("properties") || "[]";
      const properties = JSON.parse(stored);
      
      // Add new property
      properties.push(newProperty);
      
      // Save back to localStorage
      localStorage.setItem("properties", JSON.stringify(properties));
      
      toast.success(t("properties.messages.addSuccess"));
      navigate("/properties");
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error(t("properties.messages.addError"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="relative flex min-h-screen">
      <DashboardSidebar open={open} setOpen={setOpen}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {t('properties.menu.overview')}
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties')}
              >
                {t('properties.menu.all')}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties/residential')}
              >
                {t('properties.menu.residential')}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/properties/commercial')}
              >
                {t('properties.menu.commercial')}
              </Button>
            </div>
          </div>
        </div>
      </DashboardSidebar>

      <DashboardLayout sidebarOpen={open} setSidebarOpen={setOpen}>
        <DashboardContent>
          <div className="max-w-3xl mx-auto p-4">
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold">{t("properties.addProperty")}</h1>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("properties.form.title")}</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("properties.form.description")}</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("properties.form.type")}</Label>
                    <RadioGroup
                      defaultValue="apartment"
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment">{t("properties.form.apartment")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="villa" id="villa" />
                        <Label htmlFor="villa">{t("properties.form.villa")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="duplex" id="duplex" />
                        <Label htmlFor="duplex">{t("properties.form.duplex")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial">{t("properties.form.commercial")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">{t("properties.form.other")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">{t("properties.form.price")} (EGP)</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          className="pl-12"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          EGP
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">{t("properties.form.area")} (m²)</Label>
                      <Input
                        id="area"
                        name="area"
                        type="number"
                        value={formData.area}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">{t("properties.form.location")}</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t("properties.form.city")}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasBasement"
                        checked={formData.hasBasement}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasBasement: checked as boolean }))
                        }
                      />
                      <Label htmlFor="hasBasement">{t("properties.form.hasBasement")}</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherDetails">{t("properties.form.otherDetails")}</Label>
                    <Textarea
                      id="otherDetails"
                      name="otherDetails"
                      value={formData.otherDetails}
                      onChange={handleChange}
                      placeholder={t("properties.form.otherDetailsPlaceholder")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{t("properties.form.ownerName")}</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">{t("properties.form.ownerPhone")}</Label>
                      <Input
                        id="ownerPhone"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>{t("properties.form.images")}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                {t("properties.form.dropImages")}
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                      {formData.images.length > 0 && (
                        <div className="col-span-2 grid grid-cols-3 gap-4">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/properties")}
                    >
                      {t("properties.actions.cancel")}
                    </Button>
                    <Button type="submit">
                      {t("properties.actions.save")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </DashboardContent>
      </DashboardLayout>
    </div>
  );
};

export default AddProperty;
