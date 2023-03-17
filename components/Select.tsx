import styles from './Select.module.scss';

export default function Select(props) {
  return (
    <div className={styles.body}>
      <label htmlFor={props.id} className={styles.label}>{props.label}</label>
      <select {...props} className={styles.select}>
        {props.children}
      </select>
    </div>
  )
}