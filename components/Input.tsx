'use client';

import styles from '@components/Input.module.scss';
import { createSlug } from '@root/common/utilities';

import * as React from 'react';

export default function Input(props) {
  let id = (props.id ? props.id + '-' : '') + createSlug(props.label);
  
  return (
    <div className={styles.body}>
      <label className={styles.label} htmlFor={id}>
        {props.label}
      </label>
      <input className={styles.input} {...props} id={id} />
    </div>
  );
}
