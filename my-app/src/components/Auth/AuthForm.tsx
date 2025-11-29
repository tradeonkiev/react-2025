import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { login, register, clearError } from '../../Store/auth/authSlice';
import { useAuthForm } from '../../hooks/useAuthForm';
import styles from './AuthForm.module.css';

export const AuthForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const {
    formData,
    validationErrors,
    validate,
    handleChange,
    resetForm
  } = useAuthForm(isLoginMode);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);

    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      email: formData.email,
      password: formData.password
    };

    if (isLoginMode) {
      dispatch(login(payload));
    } else {
      dispatch(register({
        ...payload,
        name: formData.name
      }));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(prev => !prev);
    resetForm();
    dispatch(clearError());
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h1 className={styles['auth-title']}>
          {isLoginMode ? 'Вход' : 'Регистрация'}
        </h1>

        <form onSubmit={handleSubmit} className={styles['auth-form']}>

          {!isLoginMode && (
            <InputField
              id="name"
              name="name"
              value={formData.name}
              placeholder="Введите ваше имя"
              disabled={isLoading}
              error={validationErrors.name}
              onChange={onInput}
            />
          )}

          <InputField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            placeholder="example@email.com"
            disabled={isLoading}
            error={validationErrors.email}
            onChange={onInput}
          />

          <InputField
            id="password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="••••••••"
            disabled={isLoading}
            error={validationErrors.password}
            onChange={onInput}
          />

          
          {!isLoginMode && (
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
              error={validationErrors.confirmPassword}
              onChange={onInput}
            />
          )}

          {error && <div className={styles['error-message']}>{error}</div>}

          <button
            type="submit"
            className={styles['submit-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className={styles['auth-footer']}>
          <p className={styles['toggle-text']}>
            {isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className={styles['toggle-button']}
              disabled={isLoading}
            >
              {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const InputField = ({ error, ...props }: InputFieldProps) => (
  <div className={styles['form-group']}>
    <input {...props} className={styles['input-holder']} />
    {error && <span className={styles['error-text']}>{error}</span>}
  </div>
);
