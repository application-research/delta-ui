'use client';

import * as React from 'react';
import { addReplication } from '@root/data/api';

import styles from './FormAddReplication.module.scss';

import Dismissible from '@components/Dismissible';
import Button from '@components/Button';
import Input from 'components/basic/Input';
import ProviderSelect from '@components/ProviderSelect';
import DatasetSelect from '@components/DatasetSelect';
import Feedback from '@components/Feedback';

export default function FormAddReplication(props: {
  providers: any[],
  datasets: any[],
  updateReplications: () => void,
}) {
  const [providerID, setProviderID] = React.useState('');
  const [datasetID, setDatasetID] = React.useState(0);
  const [numDeals, setNumDeals] = React.useState(1);
  const [delayStartDays, setDelayStartDays] = React.useState(3);

  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(<Feedback />);

  async function onSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    
    try {
      setFeedback(undefined);
      setLoading(true);

      await addReplication(providerID, datasetID, numDeals, delayStartDays);
      props.updateReplications();
      
      setFeedback(<Feedback type='success' />);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Add replication</h2>
      <form onSubmit={onSubmit}>
        <div className={styles.formRow}>
          <ProviderSelect id='provider-id' label='Provider' providers={props.providers} onChange={e => setProviderID(e.target.value)} required autoFocus />
        </div>
        <div className={styles.formRow}>
          <DatasetSelect id='dataset-name' label='Dataset' placeholder='<< any dataset >>' datasets={props.datasets} onChange={e => setDatasetID(Number(e.target.value))} />
        </div>
        <div className={styles.formRow}>
          <Input
            type='number'
            label='Number of Deals'
            value={numDeals}
            onChange={e => setNumDeals(parseInt(e.target.value))}
            required
          />
        </div>
        <div className={styles.formRow}>
          <Input type='number' label='Delay Start (Days)' value={delayStartDays} onChange={e => setDelayStartDays(parseInt(e.target.value))} required />
        </div>
        <div className={styles.formRow}>
          <Button loading={loading} disabled={feedback?.props.type === 'success'} primary>Add</Button>
        </div>
      </form>
      {feedback}
    </div>
  )
}