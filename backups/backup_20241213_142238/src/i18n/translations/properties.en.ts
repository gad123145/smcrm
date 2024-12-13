export const propertiesTranslations = {
  title: "Properties",
  addProperty: "Add Property",
  editProperty: "Edit Property",
  propertyDetails: "Property Details",
  deleteProperty: "Delete Property",
  deleteConfirmation: "Are you sure you want to delete this property?",
  deleteWarning: "This property will be permanently deleted. This action cannot be undone.",
  form: {
    title: "Property Title",
    description: "Property Description",
    type: "Property Type",
    price: "Price",
    ownerName: "Owner Name",
    ownerPhone: "Phone Number",
    address: "Address",
    area: "Area",
    location: "Location",
    city: "City",
    features: "Features",
    images: "Images",
    video: "Video",
    status: "Status",
    apartment: "Apartment",
    villa: "Villa",
    commercial: "Commercial",
    available: "Available",
    sold: "Sold",
    rented: "Rented",
    underContract: "Under Contract",
    notSpecified: "Not specified",
    addSuccess: "Property added successfully",
    updateSuccess: "Property updated successfully",
    deleteSuccess: "Property deleted successfully",
    error: {
      load: "Error loading property",
      add: "Error adding property",
      update: "Error updating property",
      delete: "Error deleting property"
    }
  },
  actions: {
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    download: "Download",
  },
  messages: {
    addSuccess: "Property added successfully",
    addError: "Error adding property",
    updateSuccess: "Property updated successfully",
    updateError: "Error updating property",
    deleteSuccess: "Property deleted successfully",
    deleteError: "Error deleting property",
    deleteConfirm: "Are you sure you want to delete this property?",
    notFound: "Property not found",
    noProperties: "No properties found",
  },
  types: {
    apartment: "Apartment",
    villa: "Villa",
    office: "Office",
    land: "Land",
    building: "Building",
    shop: "Shop",
    commercial: "Commercial"
  },
  status: {
    available: "Available",
    sold: "Sold",
    rented: "Rented",
    underContract: "Under Contract"
  },
  filters: {
    all: "All",
    type: "Type",
    price: "Price",
    area: "Area",
    city: "City"
  },
  notFound: "Property not found",
  basicInfo: "Basic Property Information",
  locationInfo: "Location Information",
  details: "Details",
  features: "Features",
  properties: {
    title: 'Properties',
    addProperty: 'Add Property',
    menu: {
      overview: 'Overview',
      all: 'All Properties',
      residential: 'Residential',
      commercial: 'Commercial'
    },
    form: {
      type: 'Type',
      price: 'Price',
      area: 'Area',
      location: 'Location'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete'
    },
    messages: {
      noProperties: 'No properties found',
      deleteConfirm: 'Are you sure you want to delete this property?',
      deleteSuccess: 'Property deleted successfully',
      deleteError: 'Error deleting property'
    }
  }
} as const;