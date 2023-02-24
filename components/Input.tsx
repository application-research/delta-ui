'use client';

import styles from '@components/Input.module.scss';

import * as React from 'react';

export default function Input(props) {
  return (
    <div className={styles.body}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      <input className={styles.input} {...props} />
    </div>
  );
}
