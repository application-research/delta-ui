'use client';

import * as React from 'react';
import { checkAuth, checkAuthFormat } from '@data/api';

import styles from './SceneAuth.module.scss';

import Button from '@components/Button';
import Input from '@components/Input';
import Feedback from '@components/Feedback';

export default function SceneAuth(props) {
  // Store a tmp auth token in the component so the main application auth token
  // state doesn't update until the user submits the form
  const [tmpAuthToken, setTmpAuthToken] = React.useState(props.authToken || '');
  const [tmpDDMAddress, setTmpDDMAddress] = React.useState(props.authToken || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1314');

  const [feedback, setFeedback] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      if (!await checkAuth(tmpAuthToken, tmpDDMAddress)) {
        setFeedback(new Error('Unauthorized token'));
        return;
      }
    } catch (e) {

      if (e.message.includes('Failed to fetch')) {
        setFeedback(new Error('Could not connect to API'));
      }

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
        <div className={styles.formRow}>
          <Input label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={e => setTmpAuthToken(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <Input label="Delta-DM API Address" id='ddm-address' value={tmpDDMAddress} onChange={e => setTmpDDMAddress(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!checkAuthFormat(tmpAuthToken)} loading={loading}>{tmpAuthToken == '' || checkAuthFormat(tmpAuthToken) ? 'Connect' : 'Invalid Token Format'}</Button>
        </div>
        <div className={styles.formRow}>
          <Feedback message={feedback} />
        </div>
      </form>
    </div>
  )
}