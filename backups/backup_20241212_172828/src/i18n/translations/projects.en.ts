export const projectsTranslations = {
  title: "Projects",
  addProject: "Add Project",
  editProject: "Edit Project",
  fields: {
    name: "Project Name",
    description: "Project Description",
    type: "Project Type",
    manager: "Project Manager",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Project Status",
    priority: "Priority",
    estimatedBudget: "Estimated Budget",
    actualBudget: "Actual Budget",
    completionPercentage: "Completion Percentage",
    price: "Price",
    projectArea: "Project Area"
  },
  placeholders: {
    name: "Enter project name",
    description: "Enter project description",
    type: "Select project type",
    manager: "Select project manager",
    status: "Select project status",
    priority: "Select priority",
    estimatedBudget: "Enter estimated budget",
    actualBudget: "Enter actual budget",
    completionPercentage: "Enter completion percentage"
  },
  types: {
    residential: "Residential",
    commercial: "Commercial",
    medical: "Medical",
    hotel: "Hotel",
    administrative: "Administrative",
    mixed: "Mixed Use"
  },
  status: {
    planned: "Planned",
    inProgress: "In Progress",
    completed: "Completed",
    onHold: "On Hold",
    cancelled: "Cancelled"
  },
  priority: {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent"
  },
  messages: {
    success: "Project saved successfully",
    deleteSuccess: "Project deleted successfully",
    error: "Error saving project"
  }
} as const;