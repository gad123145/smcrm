export const usersTranslations = {
  title: "Users Management",
  addUser: "Add New User",
  name: "Full Name",
  email: "Email Address",
  password: "Password",
  role: "Role",
  status: "Account Status",
  edit: {
    title: "Edit User Details"
  },
  roles: {
    admin: "System Administrator",
    supervisor: "Supervisor",
    sales: "Sales Representative",
    employee: "Employee"
  },
  statuses: {
    active: "Active",
    inactive: "Inactive"
  },
  permissions: {
    title: "Manage Permissions",
    manage: "Manage Permissions",
    saveSuccess: "Permissions saved successfully",
    saveError: "Error saving permissions"
  },
  form: {
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    selectRole: "Select Role",
    namePlaceholder: "Enter full name",
    emailPlaceholder: "Enter email address",
    errors: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 6 characters"
    }
  },
  toast: {
    success: "User added successfully",
    error: "Error adding user",
    updated: "User updated successfully"
  }
} as const;