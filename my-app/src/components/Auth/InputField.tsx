import React from 'react';
import styles from './AuthForm.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const InputField = ({ error, ...props } : InputFieldProps) => {
  return (
    <div className={styles['form-group']}>
      <input {...props} className={styles['input-holder']} />
      {error && <span className={styles['error-text']}>{error}</span>}
    </div>
  );
};
