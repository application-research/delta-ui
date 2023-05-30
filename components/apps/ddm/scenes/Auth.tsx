'use client';

import * as React from 'react';
import { checkAuth, checkAuthFormat } from '@data/api';

import styles from './Auth.module.scss';

import Button from '@components/Button';
import Input from '@components/basic/Input';

export default function Auth(props) {
  // Store a tmp auth token in the component so the main application auth token
  // state doesn't update until the user submits the form
  const [tmpAuthToken, setTmpAuthToken] = React.useState(props.authToken || '');
  const [tmpDDMAddress, setTmpDDMAddress] = React.useState(props.authToken || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1415');
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    setLoading(true);
    
    try {
      if (!await checkAuth(tmpAuthToken, tmpDDMAddress)) {
        alert('Unauthorized token');
        return;
      }
    } catch (e) {
      alert(e.toString());
      return;
    } finally {
      setLoading(false);
    }

    props.setAuthToken(tmpAuthToken);
    props.setDDMAddress(tmpDDMAddress);
  }

  return (
    <div className={styles.body}>
      <form onSubmit={onSubmit}>
        <Input label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={e => setTmpAuthToken(e.target.value)} />
        <Input label="Delta-DM API Address" id='ddm-address' value={tmpDDMAddress} onChange={e => setTmpDDMAddress(e.target.value)} />
        <Button disabled={!checkAuthFormat(tmpAuthToken)} loading={loading} primary>{tmpAuthToken == '' || checkAuthFormat(tmpAuthToken) ? 'Connect' : 'Invalid Token Format'}</Button>
      </form>
    </div>
  )
}