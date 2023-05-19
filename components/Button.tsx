import * as React from 'react';

import styles from '@components/Button.module.scss';

import LoadingIndicator from '@components/LoadingIndicator';

const Button = (props: {
  style?: any,
  className?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
  loading?: boolean,
  primary?: boolean,
  children?: React.ReactNode,
}) => {
  return (
    <button
      style={props.style}
      className={props.className || (props.primary ? styles.buttonPrimary : styles.button)}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? <LoadingIndicator /> : props.children}
    </button>
  );
};

export default Button;
