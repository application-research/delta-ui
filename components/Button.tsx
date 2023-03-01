import * as React from 'react';

import styles from '@components/Button.module.scss';

const Button = (props: any) => {
  return <button style={props.style} className={styles.button} onClick={props.onClick} children={props.children} />;
};

export default Button;
