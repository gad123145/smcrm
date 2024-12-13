export const projectsTranslations = {
  title: "Projects",
  addProject: "Add New Project",
  editProject: "Edit Project",
  view: "View",
  edit: "Edit",
  delete: "Delete",
  share: {
    title: "Share Project",
    description: "Share project details with others",
    copied: "Link copied to clipboard",
    button: "Share Project"
  },
  fields: {
    name: "Project Name",
    description: "Project Description",
    type: "Project Type",
    manager: "Project Manager",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Project Status",
    priority: "Project Priority",
    estimatedBudget: "Estimated Budget",
    price: "Price",
    projectArea: "Project Area",
    location: "Location",
    operatingCompany: "Operating Company",
    availableUnits: "Available Units",
    deliveryDate: "Delivery Date"
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