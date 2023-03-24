import * as React from 'react';

import styles from '@components/Button.module.scss';

import LoadingIndicator from '@components/LoadingIndicator';

const Button = (props: any) => {
  return <button style={props.style} className={props.className || styles.button} onClick={props.onClick} disabled={props.disabled || props.loading}>
    {props.loading ? <LoadingIndicator /> : props.children}
  </button>;
};

export default Button;
