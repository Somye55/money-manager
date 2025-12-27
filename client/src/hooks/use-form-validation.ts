import { useState, useCallback, useRef } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
}

export interface FieldConfig {
  rules?: ValidationRule;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface FormConfig<T> {
  initialValues: T;
  fields: Record<keyof T, FieldConfig>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export interface FieldState {
  value: any;
  error: string | null;
  touched: boolean;
  validating: boolean;
  success: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  validating: Record<keyof T, boolean>;
  success: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  config: FormConfig<T>
) {
  const { initialValues, fields, onSubmit } = config;
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize form state
  const [formState, setFormState] = useState<FormState<T>>(() => ({
    values: { ...initialValues },
    errors: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<keyof T, string | null>
    ),
    touched: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    ),
    validating: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    ),
    success: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    ),
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  }));

  // Validation function
  const validateField = useCallback(
    (fieldName: keyof T, value: any): string | null => {
      const fieldConfig = fields[fieldName];
      if (!fieldConfig?.rules) return null;

      const { rules } = fieldConfig;

      // Required validation
      if (
        rules.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return "This field is required";
      }

      // Skip other validations if field is empty and not required
      if (!value || (typeof value === "string" && !value.trim())) {
        return null;
      }

      // Email validation
      if (rules.email && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
      }

      // Number validation
      if (rules.number) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return "Please enter a valid number";
        }

        if (rules.min !== undefined && numValue < rules.min) {
          return `Value must be at least ${rules.min}`;
        }

        if (rules.max !== undefined && numValue > rules.max) {
          return `Value must be at most ${rules.max}`;
        }
      }

      // String length validation
      if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
          return `Must be at least ${rules.minLength} characters`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          return `Must be at most ${rules.maxLength} characters`;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          return "Invalid format";
        }
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [fields]
  );

  // Set field value with optional validation
  const setFieldValue = useCallback(
    (fieldName: keyof T, value: any, shouldValidate = true) => {
      setFormState((prev) => {
        const newValues = { ...prev.values, [fieldName]: value };
        const isDirty =
          JSON.stringify(newValues) !== JSON.stringify(initialValues);

        let newErrors = { ...prev.errors };
        let newValidating = { ...prev.validating };
        let newSuccess = { ...prev.success };

        if (shouldValidate) {
          const fieldConfig = fields[fieldName];

          if (fieldConfig?.validateOnChange) {
            if (fieldConfig.debounceMs) {
              // Clear existing timer
              if (debounceTimers.current[fieldName as string]) {
                clearTimeout(debounceTimers.current[fieldName as string]);
              }

              // Set validating state
              newValidating[fieldName] = true;

              // Set new timer
              debounceTimers.current[fieldName as string] = setTimeout(() => {
                setFormState((current) => {
                  const error = validateField(fieldName, value);
                  return {
                    ...current,
                    errors: { ...current.errors, [fieldName]: error },
                    validating: { ...current.validating, [fieldName]: false },
                    success: {
                      ...current.success,
                      [fieldName]: !error && !!value,
                    },
                    isValid: Object.values({
                      ...current.errors,
                      [fieldName]: error,
                    }).every((err) => !err),
                  };
                });
              }, fieldConfig.debounceMs);
            } else {
              const error = validateField(fieldName, value);
              newErrors[fieldName] = error;
              newSuccess[fieldName] = !error && !!value;
            }
          } else {
            // Clear error if field was previously invalid
            if (prev.errors[fieldName]) {
              newErrors[fieldName] = null;
            }
            newSuccess[fieldName] = false;
          }
        }

        const isValid = Object.values(newErrors).every((error) => !error);

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          validating: newValidating,
          success: newSuccess,
          isDirty,
          isValid,
        };
      });
    },
    [fields, initialValues, validateField]
  );

  // Set field touched
  const setFieldTouched = useCallback((fieldName: keyof T, touched = true) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [fieldName]: touched },
    }));
  }, []);

  // Validate field on blur
  const handleFieldBlur = useCallback(
    (fieldName: keyof T) => {
      setFieldTouched(fieldName, true);

      const fieldConfig = fields[fieldName];
      if (fieldConfig?.validateOnBlur) {
        const value = formState.values[fieldName];
        const error = validateField(fieldName, value);

        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [fieldName]: error },
          success: { ...prev.success, [fieldName]: !error && !!value },
          isValid: Object.values({ ...prev.errors, [fieldName]: error }).every(
            (err) => !err
          ),
        }));
      }
    },
    [fields, formState.values, setFieldTouched, validateField]
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string | null> = {} as any;
    const newSuccess: Record<keyof T, boolean> = {} as any;

    Object.keys(formState.values).forEach((key) => {
      const fieldName = key as keyof T;
      const value = formState.values[fieldName];
      const error = validateField(fieldName, value);

      newErrors[fieldName] = error;
      newSuccess[fieldName] = !error && !!value;
    });

    const isValid = Object.values(newErrors).every((error) => !error);

    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
      success: newSuccess,
      isValid,
      touched: Object.keys(prev.touched).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      ),
    }));

    return isValid;
  }, [formState.values, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const isValid = validateForm();
      if (!isValid || !onSubmit) return;

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(formState.values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [formState.values, onSubmit, validateForm]
  );

  // Reset form
  const resetForm = useCallback(() => {
    // Clear all debounce timers
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};

    setFormState({
      values: { ...initialValues },
      errors: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: null }),
        {} as Record<keyof T, string | null>
      ),
      touched: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      ),
      validating: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      ),
      success: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      ),
      isSubmitting: false,
      isValid: true,
      isDirty: false,
    });
  }, [initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback(
    (fieldName: keyof T) => ({
      value: formState.values[fieldName],
      error: formState.touched[fieldName] ? formState.errors[fieldName] : null,
      success: formState.success[fieldName],
      loading: formState.validating[fieldName],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: () => handleFieldBlur(fieldName),
    }),
    [formState, setFieldValue, handleFieldBlur]
  );

  // Get select field props
  const getSelectFieldProps = useCallback(
    (fieldName: keyof T) => ({
      value: formState.values[fieldName],
      error: formState.touched[fieldName] ? formState.errors[fieldName] : null,
      success: formState.success[fieldName],
      loading: formState.validating[fieldName],
      onValueChange: (value: string) => {
        setFieldValue(fieldName, value);
      },
      onBlur: () => handleFieldBlur(fieldName),
    }),
    [formState, setFieldValue, handleFieldBlur]
  );

  return {
    // State
    ...formState,

    // Actions
    setFieldValue,
    setFieldTouched,
    handleFieldBlur,
    validateForm,
    handleSubmit,
    resetForm,

    // Helpers
    getFieldProps,
    getSelectFieldProps,
  };
}
