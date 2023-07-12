import * as React from 'react';

import styles from '@components/basic/Select.module.scss';

export default function Select(props: {
  id?: string,
  placeholder?: string,
  label?: string,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>,
  value?: string,
  required?: boolean,
  disabled?: boolean
  children?: React.ReactElement<HTMLOptionElement>[],
} & React.ComponentPropsWithRef<'select'>) {
  const id = props.id || 'select-' + Math.floor(Math.random() * 100000);
  
  return (
    <div className={styles.body}>
      <label htmlFor={id} className={styles.label}>{props.label}</label>
      <select 
        {...props}
        id={id}
        className={styles.select} 
        value={props.value} 
        onChange={props.onChange}
        required={props.required}
        disabled={props.disabled}
      >
        {props.placeholder && <option hidden={props.required} value=''>{props.placeholder}</option>}
        {props.children?.map((child, i) => ({key: i, ...child}))}
      </select>
    </div>
  )
}