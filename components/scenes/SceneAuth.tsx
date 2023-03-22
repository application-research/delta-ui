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
  const [tmpDDMAddress, setTmpDDMAddress] = React.useState(props.authToken || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1314');

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
    props.setDDMAddress(tmpDDMAddress);
  }

  return (
    <div className={styles.body}>
      <form onSubmit={onSubmit}>
        <Input label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={e => setTmpAuthToken(e.target.value)} />
        <Input label="Delta-DM API Address" id='ddm-address' value={tmpDDMAddress} onChange={e => setTmpDDMAddress(e.target.value)} />
        <Button disabled={!checkAuthFormat(tmpAuthToken)}>{tmpAuthToken == '' || checkAuthFormat(tmpAuthToken) ? 'Connect' : 'Invalid Token Format'}</Button>
      </form>
    </div>
  )
}