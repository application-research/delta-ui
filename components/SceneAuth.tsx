'use client';

import styles from '@components/SceneAuth.module.scss';
import React from 'react';
import Button from './Button';
import Input from './Input';

export default function SceneAuth(props) {
  // Store a tmp auth token in the component so the main application auth token
  // state doesn't update until the user submits the form
  const [tmpAuthToken, setTmpAuthToken] = React.useState(props.authToken || '');

  function onSubmit(e) {
    e.preventDefault();

    props.setAuthToken(tmpAuthToken);
  }

  function isAuthTokenValid() {
    return new RegExp("^(DEL).*(TA)$").test(tmpAuthToken);
  }

  return (
    <div className={styles.body}>
      <form onSubmit={onSubmit}>
        <Input type="text" label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={e => setTmpAuthToken(e.target.value)} />
        <Button disabled={!isAuthTokenValid()}>Set Token</Button>
      </form>
    </div>
  )
}