'use client';

import styles from '@components/Input.module.scss';
import { createSlug } from '@root/common/utilities';

import * as React from 'react';

export default function Input(props: {
  label?: any,
  inputClassName?: string,
  labelClassName?: string,
} & React.ComponentPropsWithRef<'input'>) {
  let id = (props.id ? props.id + '-' : '') + createSlug(props.label);
  
  return (
    <div className={`${props.className} ${styles.body}`}>
      <label className={`${props.labelClassName} ${styles.label}`} htmlFor={id}>
        {props.label}
      </label>
      <input {...props} className={`${props.inputClassName} ${styles.input}`} id={id} />
    </div>
  );
}
