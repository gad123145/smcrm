export const projectsTranslations = {
  title: "المشاريع",
  addProject: "إضافة مشروع",
  editProject: "تعديل المشروع",
  fields: {
    name: "اسم المشروع",
    description: "وصف المشروع",
    type: "نوع المشروع",
    manager: "مدير المشروع",
    startDate: "تاريخ التشغيل",
    status: "حالة المشروع",
    priority: "الأولوية",
    estimatedBudget: "الميزانية المتوقعة",
    actualBudget: "الميزانية الفعلية",
    completionPercentage: "نسبة الإنجاز",
    price: "السعر",
    projectArea: "مساحة المشروع"
  },
  placeholders: {
    name: "أدخل اسم المشروع",
    description: "أدخل وصف المشروع",
    type: "اختر نوع المشروع",
    manager: "اختر مدير المشروع",
    status: "اختر حالة المشروع",
    priority: "اختر أولوية المشروع",
    estimatedBudget: "أدخل الميزانية المتوقعة",
    actualBudget: "أدخل الميزانية الفعلية",
    completionPercentage: "أدخل نسبة الإنجاز"
  },
  types: {
    residential: "سكني",
    commercial: "تجاري",
    industrial: "صناعي",
    infrastructure: "بنية تحتية",
    other: "أخرى"
  },
  status: {
    active: "نشط",
    "on-hold": "متوقف",
    completed: "مكتمل",
    cancelled: "ملغي"
  },
  priority: {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    urgent: "عاجل"
  },
  messages: {
    saved: "تم حفظ المشروع بنجاح",
    error: "حدث خطأ أثناء حفظ المشروع"
  }
} as const;