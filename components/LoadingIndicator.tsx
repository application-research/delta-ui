'use client';

import styles from './LoadingIndicator.module.scss'

export default function LoadingIndicator(props) {
  return (
    <div className={styles.container}>
      <p>Loading...</p>
      <div className={styles.loadingIndicator}></div>
    </div>
  );
}