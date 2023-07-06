import * as React from 'react';

import styles from '@components/Feedback.module.scss';

export default function Feedback(props: {
  children?: React.ReactNode,
  type?: 'success' | 'error'
}) {
  if (!props.type) return null;
  
  const options = {
    'success': {
      icon: '✓',
      style: styles.success
    },
    'error': {
      icon: '⚠',
      style: styles.error
    }
  };

  let option = options[props.type];
  
  return (
    <div className={option.style}>
      <div className={styles.icon}>{option.icon}</div>
      {props.children && <div className={styles.message}>{props.children}</div>}
    </div>
  )
}

