export const projectsTranslations = {
  title: "Projects",
  addProject: "Add New Project",
  editProject: "Edit Project",
  view: "View",
  edit: "Edit",
  delete: "Delete",
  share: {
    title: "Share Project",
    description: "Choose fields to share",
    selectFields: "Select Fields",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    export: "Export PDF",
    preparing: "Preparing file...",
    exported: "File exported successfully",
    exportError: "Error exporting file",
    noFieldsSelected: "Please select at least one field",
    copied: "Link copied to clipboard",
    button: "Share Project",
    success: "Project shared successfully",
    error: "Error sharing project"
  },
  categories: {
    basic: "Basic Information",
    financial: "Financial Information",
    details: "Additional Details",
    media: "Media"
  },
  fields: {
    name: "Project Name",
    description: "Project Description",
    status: "Project Status",
    start_date: "Start Date",
    price: "Price",
    project_area: "Area",
    images: "Images",
    consultant: "Consultant",
    operatingCompany: "Operating Company",
    projectDivision: "Project Division",
    location: "Location",
    deliveryDate: "Delivery Date",
    pricePerMeter: "Price per Meter",
    availableUnits: "Available Units",
    unitPrice: "Unit Price",
    areaStart: "Starting Area",
    rentalSystem: "Rental System",
    details: "Details",
    created_at: "Created At",
    updated_at: "Updated At"
  },
  form: {
    title: "Project Details",
    name: "Project Name",
    description: "Project Description",
    type: "Project Type",
    manager: "Project Manager",
    startDate: "Start Date",
    status: "Project Status",
    priority: "Project Priority",
    estimatedBudget: "Estimated Budget",
    price: "Price",
    projectArea: "Project Area",
    location: "Location",
    operatingCompany: "Operating Company",
    deliveryDate: "Delivery Date",
    documents: "Documents",
    images: {
      title: "Project Images",
      noImages: "No images available",
      imageAlt: "Project Image",
      addImage: "Add Image",
      uploadImages: "Upload Images",
      dragAndDrop: "Drag and drop images here",
      or: "or",
      browseFiles: "Browse Files"
    }
  },
  placeholders: {
    name: "Enter project name",
    description: "Enter project description",
    type: "Select project type",
    manager: "Select project manager",
    status: "Select project status",
    priority: "Select project priority",
    estimatedBudget: "Enter estimated budget",
    price: "Enter price",
    projectArea: "Enter project area",
    location: "Enter location",
    deliveryDate: "Select delivery date"
  },
  types: {
    residential: "Residential",
    commercial: "Commercial",
    industrial: "Industrial",
    infrastructure: "Infrastructure",
    other: "Other"
  },
  status: {
    active: "Active",
    "on-hold": "On Hold",
    completed: "Completed",
    cancelled: "Cancelled"
  },
  priority: {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent"
  },
  messages: {
    created: "Project created successfully",
    updated: "Project updated successfully",
    deleted: "Project deleted successfully"
  },
  errors: {
    notFound: "Project not found",
    createFailed: "Failed to create project",
    updateFailed: "Failed to update project",
    deleteFailed: "Failed to delete project"
  }
} as const;