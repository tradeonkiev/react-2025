import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import styles from './ImageModal.module.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string) => void;
}

export const ImageModal = ({ isOpen, onClose, onImageSelect }: ImageModalProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      setError('Пожалуйста, введите URL изображения');
      return;
    }

    try {
      new URL(imageUrl);
      onImageSelect(imageUrl);
      handleClose();
    } catch {
      setError('Некорректный URL');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageSelect(base64);
      handleClose();
    };
    reader.onerror = () => {
      setError('Ошибка при загрузке файла');
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setImageUrl('');
    setError('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Добавить изображение</h2>
          <button 
            className={styles['close-button']}
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <X />
          </button>
        </div>

        <div className={styles['modal-body']}>
          <div className={styles['upload-section']}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className={styles['file-input']}
              id="file-upload"
            />
            
            <label htmlFor="file-upload" className={styles['upload-label']}>
              <div className={styles['upload-icon']}>
                <Upload size={48} />
              </div>
              <p className={styles['upload-text']}>
                Нажмите для выбора файла
              </p>
              <p className={styles['upload-hint']}>
                или перетащите изображение сюда
              </p>
              <p className={styles['upload-limit']}>
                Максимальный размер: 5MB
              </p>
            </label>
          </div>

          <div className={styles['divider']}>
            <span className={styles['divider-text']}>или</span>
          </div>
          
          <form onSubmit={handleUrlSubmit} className={styles['url-form']}>
            <div className={styles['form-group']}>
              <label htmlFor="image-url" className={styles['label']}>
                Вставьте ссылку на изображение
              </label>
              <input
                id="image-url"
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://example.com/image.jpg"
                className={styles['input']}
              />
            </div>

            {error && (
              <div className={styles['error-message']}>{error}</div>
            )}

            <div className={styles['form-actions']}>
              <button
                type="button"
                onClick={handleClose}
                className={styles['cancel-button']}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles['submit-button']}
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};