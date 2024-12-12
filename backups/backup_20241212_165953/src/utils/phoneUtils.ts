import { arabCountries } from "@/data/countries";

export const detectCountryFromPhone = (phone: string): string | null => {
  if (!phone) return null;
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Try to match the phone number with country codes
  for (const country of arabCountries) {
    const phoneCode = country.phoneCode.replace('+', '');
    if (cleanPhone.startsWith(phoneCode)) {
      return country.code;
    }
  }
  
  return null;
};