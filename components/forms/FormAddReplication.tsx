'use client';

import * as React from 'react';
import { addReplication } from '@root/data/api';

import styles from './FormAddReplication.module.scss';

import Dismissible from '@components/Dismissible';
import Button from '@components/Button';
import Input from 'components/Input';
import ProviderSelect from '@components/ProviderSelect';
import DatasetSelect from '@components/DatasetSelect';

export default function FormAddReplication(props) {
  const [providerID, setProviderID] = React.useState('');
  const [datasetName, setDatasetName] = React.useState('');
  const [numDeals, setNumDeals] = React.useState(1);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    try {
      setLoading(true);

      await addReplication(providerID, datasetName, numDeals);

      await props.updateState();
      props.onOutsideClick();
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Add replication</h2>
      <form onSubmit={onSubmit}>
        <div className={styles.formRow}>
          <ProviderSelect id='provider-id' label='Provider' providers={props.providers} onChange={e => setProviderID(e.target.value)} required autoFocus />
        </div>
        <div className={styles.formRow}>
          <DatasetSelect id='dataset-name' label='Dataset' default='any' datasets={props.datasets} onChange={e => setDatasetName(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <Input type='number' label='Number of Deals' value={numDeals} onChange={e => setNumDeals(e.target.value)} required />
        </div>
        <div className={styles.formRow}>
          <Button loading={loading}>Add</Button>
        </div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  )
}