'use client';

import * as React from 'react';
import { checkAuth, checkAuthFormat } from '@data/api';

import styles from './SceneAuth.module.scss';

import Button from '@components/Button';
import Input from '@components/Input';

export default function SceneAuth(props) {
  // Store a tmp auth token in the component so the main application auth token
  // state doesn't update until the user submits the form
  const [tmpAuthToken, setTmpAuthToken] = React.useState(props.authToken || '');

  async function onSubmit(e) {
    e.preventDefault();

    try {
      if (!await checkAuth(tmpAuthToken)) {
        alert('Unauthorized token');
        return;
      }
    } catch (e) {
      alert(e.toString());
      return;
    }

    props.setAuthToken(tmpAuthToken);
  }

  return (
    <div className={styles.body}>
      <form onSubmit={onSubmit}>
        <Input type="text" label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={e => setTmpAuthToken(e.target.value)} />
        <Button disabled={!checkAuthFormat(tmpAuthToken)}>{tmpAuthToken == '' || checkAuthFormat(tmpAuthToken) ? 'Set Token' : 'Invalid Format'}</Button>
      </form>
    </div>
  )
}