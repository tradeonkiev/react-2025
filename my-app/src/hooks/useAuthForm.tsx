import { useState } from 'react';

export interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

const initialForm: FormData = {
  email: '',
  password: '',
  name: '',
  confirmPassword: ''
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthForm = (isLoginMode: boolean) => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const resetForm = () => {
    setFormData(initialForm);
    setValidationErrors({});
  };

  const validate = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Некорректный email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!isLoginMode) {
      if (!formData.name) errors.name = 'Имя обязательно';

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return {
    formData,
    validationErrors,
    validate,
    handleChange,
    resetForm
  };
};
