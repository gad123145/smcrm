export const projectsTranslations = {
  title: "المشاريع",
  addProject: "إضافة مشروع",
  editProject: "تعديل المشروع",
  fields: {
    name: "اسم المشروع",
    description: "وصف المشروع",
    type: "نوع المشروع",
    manager: "مدير المشروع",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
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
    medical: "طبي",
    hotel: "فندقي",
    administrative: "إداري",
    mixed: "متعدد الاستخدامات"
  },
  status: {
    planned: "مخطط",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    onHold: "متوقف",
    cancelled: "ملغي"
  },
  priority: {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    urgent: "عاجل"
  },
  messages: {
    success: "تم حفظ المشروع بنجاح",
    deleteSuccess: "تم حذف المشروع بنجاح",
    error: "حدث خطأ أثناء حفظ المشروع"
  }
} as const;