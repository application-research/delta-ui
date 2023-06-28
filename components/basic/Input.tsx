'use client';

import * as React from 'react';
import { createSlug } from '@root/common/utilities';

import styles from './Input.module.scss';

export default function Input(props: {
  id?: string,
  label?: any,
  inputClassName?: string,
  labelClassName?: string,
} & React.ComponentPropsWithRef<'input'>) {
  const id = props.id || 'input-' + Math.floor(Math.random() * 100000);
  
  // Find custom props that should be forwarded to the input element by removing custom props
  const filteredProps = Object.assign({}, props);
  delete filteredProps.label;
  delete filteredProps.inputClassName;
  delete filteredProps.labelClassName;
  
  return (
    <div className={`${props.className} ${styles.body}`}>
      <label className={`${props.labelClassName} ${styles.label}`} htmlFor={id}>
        {props.label}
      </label>
      <input {...filteredProps} className={`${props.inputClassName} ${styles.input}`} id={id} />
    </div>
  );
}
