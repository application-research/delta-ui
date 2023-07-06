'use client';

import styles from '@components/LoadingIndicator.module.scss'

export default function LoadingIndicator(props) {
  return (
    <div className={props.padded ? styles.containerPadded : styles.container}>
      {props.text && <p>{props.text}</p>}
      <div className={styles.loadingIndicator}></div>
    </div>
  );
}