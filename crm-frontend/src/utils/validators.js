// Shared client-side validators mirroring backend validation rules.
// These are a first line of defense only — backend validationErrors always win
// and are surfaced via the ErrorResponseDTO handler.

export const isRequired = (v) => (v !== undefined && v !== null && String(v).trim() !== '') || 'This field is required';

export const isValidEmail = (v) => {
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address';
};

export const isTenDigitMobile = (v) => {
  if (!v) return true;
  return /^\d{10}$/.test(v) || 'Mobile number must be exactly 10 digits';
};

export const maxLength = (max) => (v) => {
  if (!v) return true;
  return String(v).length <= max || `Must be ${max} characters or fewer`;
};

export const minLength = (min) => (v) => {
  if (!v) return true;
  return String(v).length >= min || `Must be at least ${min} characters`;
};

export const nonNegativeNumber = (v) => {
  if (v === '' || v === null || v === undefined) return true;
  return Number(v) >= 0 || 'Must not be negative';
};

// Run a { field: [validators] } map against a values object.
// Returns { field: message } for the first failing validator per field.
export function runValidators(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, fns]) => {
    for (const fn of fns) {
      const result = fn(values[field]);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  });
  return errors;
}
