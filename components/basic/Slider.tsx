import * as React from 'react';

import styles from './Slider.module.scss';

export default function Slider(props: {
  id?: string,
  min: number,
  max: number,
  step?: number,
  initialValue?: number
  label?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  value?: number,
  required?: boolean
}) {
  const id = props.id || 'slider-' + Math.floor(Math.random() * 100000).toString();

  const [value, setValue] = React.useState(props.initialValue || props.min);
  
  return (
    <div className={styles.body}>
      <label htmlFor={id} className={styles.label}>{props.label} ({value})</label>
      <input 
        id={props.id} 
        className={styles.slider}
        type="range" 
        min={props.min} 
        max={props.max} 
        onChange={e => {
          setValue(Number.parseFloat(e.target.value));
          props.onChange && props.onChange(e);
        }}
        value={value}
        step={props.step} 
        required={props.required}
      />
    </div>
  )
}