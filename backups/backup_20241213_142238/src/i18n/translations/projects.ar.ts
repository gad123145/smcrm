export const projectsTranslations = {
  title: "المشاريع",
  addProject: "إضافة مشروع جديد",
  editProject: "تعديل المشروع",
  view: "عرض",
  edit: "تعديل",
  delete: "حذف",
  share: {
    title: "مشاركة المشروع",
    description: "اختر الحقول التي تريد مشاركتها",
    selectFields: "اختر الحقول",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء تحديد الكل",
    export: "تصدير PDF",
    preparing: "جاري إعداد الملف...",
    exported: "تم تصدير الملف بنجاح",
    exportError: "حدث خطأ أثناء التصدير",
    noFieldsSelected: "الرجاء اختيار حقل واحد على الأقل",
    copied: "تم نسخ الرابط",
    button: "مشاركة",
    success: "تم المشاركة بنجاح",
    error: "حدث خطأ في المشاركة"
  },
  fields: {
    name: "اسم المشروع",
    description: "وصف المشروع",
    status: "حالة المشروع",
    start_date: "تاريخ البدء",
    price: "السعر",
    project_area: "المساحة",
    images: "الصور",
    consultant: "الاستشاري",
    operatingCompany: "الشركة المشغلة",
    projectDivision: "قسم المشروع",
    location: "الموقع",
    deliveryDate: "تاريخ التسليم",
    pricePerMeter: "سعر المتر",
    availableUnits: "الوحدات المتاحة",
    unitPrice: "سعر الوحدة",
    areaStart: "المساحة الابتدائية",
    rentalSystem: "نظام الإيجار",
    details: "التفاصيل",
    created_at: "تاريخ الإنشاء",
    updated_at: "تاريخ التحديث"
  },
  categories: {
    basic: "المعلومات الأساسية",
    financial: "المعلومات المالية",
    details: "التفاصيل الإضافية",
    media: "الوسائط"
  },
  form: {
    title: "تفاصيل المشروع",
    name: "اسم المشروع",
    description: "وصف المشروع",
    type: "نوع المشروع",
    manager: "مدير المشروع",
    startDate: "تاريخ البدء",
    status: "حالة المشروع",
    priority: "أولوية المشروع",
    estimatedBudget: "الميزانية المتوقعة",
    price: "السعر",
    projectArea: "مساحة المشروع",
    location: "الموقع",
    operatingCompany: "الشركة المشغلة",
    deliveryDate: "تاريخ التسليم",
    documents: "المستندات",
    images: {
      title: "صور المشروع",
      noImages: "لا توجد صور متاحة",
      imageAlt: "صورة المشروع"
    },
    addImage: "إضافة صورة",
    uploadImages: "رفع الصور",
    dragAndDrop: "اسحب وأفلت الصور هنا",
    or: "أو",
    browseFiles: "تصفح الملفات"
  },
  placeholders: {
    name: "أدخل اسم المشروع",
    description: "أدخل وصف المشروع",
    type: "اختر نوع المشروع",
    manager: "اختر مدير المشروع",
    status: "اختر حالة المشروع",
    priority: "اختر أولوية المشروع",
    estimatedBudget: "أدخل الميزانية المتوقعة",
    price: "أدخل السعر",
    projectArea: "أدخل مساحة المشروع",
    location: "أدخل الموقع",
    deliveryDate: "اختر تاريخ التسليم"
  },
  status: {
    active: "نشط",
    "on-hold": "معلق",
    completed: "مكتمل",
    cancelled: "ملغي"
  },
  priority: {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    urgent: "عاجلة"
  },
  type: {
    residential: "سكني",
    commercial: "تجاري",
    industrial: "صناعي",
    infrastructure: "بنية تحتية",
    other: "أخرى"
  },
  messages: {
    created: "تم إنشاء المشروع بنجاح",
    updated: "تم تحديث المشروع بنجاح",
    deleted: "تم حذف المشروع بنجاح",
    addSuccess: "تم إضافة المشروع بنجاح",
    updateSuccess: "تم تحديث المشروع بنجاح",
    deleteSuccess: "تم حذف المشروع بنجاح",
    error: "حدث خطأ"
  },
  errors: {
    notFound: "لم يتم العثور على المشروع",
    createFailed: "فشل إنشاء المشروع",
    updateFailed: "فشل تحديث المشروع",
    deleteFailed: "فشل حذف المشروع"
  }
} as const;