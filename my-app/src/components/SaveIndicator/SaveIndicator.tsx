import { CloudAlert, Cloud, RefreshCcw } from 'lucide-react';
import styles from './SaveIndicator.module.css';

interface SaveIndicatorProps {
  status: 'saved' | 'saving' | 'error';
}

export const SaveIndicator = ({ status }: SaveIndicatorProps) => {

  return (
    <>
      {status === 'saving' && (
        <div className={styles['status-saving']}>
          <RefreshCcw className={styles['icon-spin']} style={{height: '14px'}} />
        </div>
      )}
      
      {status === 'saved' && (
        <div className={styles['status-saved']}>
          <Cloud style={{height: '14px'}}/>
        </div>
      )}
      
      {status === 'error' && (
        <div className={styles['status-error']}>
          <CloudAlert style={{height: '14px'}} />
        </div>
      )}
    </>
  );
};