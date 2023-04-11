import * as React from 'react';

import styles from './Feedback.module.scss';

/**
 * If `message` is an `Error`, the component will be displayed with an error
 * style. If it is a string, it will be displayed with an info style.
 */
export default function Feedback(props: {
  message: any,
}) {
  return (
    <div className={styles.body} hidden={!props.message}>
      <p className={props.message instanceof Error ? styles.errorMessage : styles.infoMessage}>
        {props.message instanceof Error ? props.message.toString() : props.message}
      </p>
    </div>
  )
}