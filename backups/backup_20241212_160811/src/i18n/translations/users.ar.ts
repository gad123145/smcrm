export const usersTranslations = {
  title: "إدارة المستخدمين",
  addUser: "إضافة مستخدم جديد",
  name: "الاسم الكامل",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  role: "المسمى الوظيفي",
  status: "حالة الحساب",
  edit: {
    title: "تعديل بيانات المستخدم"
  },
  roles: {
    admin: "مدير النظام",
    supervisor: "مشرف",
    sales: "مندوب مبيعات",
    employee: "موظف"
  },
  statuses: {
    active: "نشط",
    inactive: "غير نشط"
  },
  permissions: {
    title: "إدارة الصلاحيات",
    manage: "إدارة الصلاحيات",
    saveSuccess: "تم حفظ الصلاحيات بنجاح",
    saveError: "حدث خطأ أثناء حفظ الصلاحيات"
  },
  form: {
    save: "حفظ",
    saving: "جاري الحفظ...",
    cancel: "إلغاء",
    selectRole: "اختر المسمى الوظيفي",
    namePlaceholder: "أدخل الاسم الكامل",
    emailPlaceholder: "أدخل البريد الإلكتروني",
    errors: {
      nameRequired: "الاسم مطلوب",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "البريد الإلكتروني غير صالح",
      passwordRequired: "كلمة المرور مطلوبة",
      passwordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    }
  },
  toast: {
    success: "تم إضافة المستخدم بنجاح",
    error: "حدث خطأ أثناء إضافة المستخدم",
    updated: "تم تحديث المستخدم بنجاح"
  }
} as const;