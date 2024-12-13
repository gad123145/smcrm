import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            مرحباً بك في نظام إدارة العملاء
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
