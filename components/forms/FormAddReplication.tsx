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
  const [error, setError] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    try {
      await addReplication(providerID, datasetName, numDeals);
    } catch (e) {
      setError(e.toString());
    }

    props.updateState();
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Add replication</h2>
      <form onSubmit={onSubmit}>
        <ProviderSelect id='provider-id' label='Provider' providers={props.providers} onChange={e => setProviderID(e.target.value)} required autoFocus />
        <DatasetSelect id='dataset-name' label='Dataset' default='any' datasets={props.datasets} onChange={e => setDatasetName(e.target.value)} />
        <Input type='number' label='Number of Deals' value={numDeals} onChange={e => setNumDeals(e.target.value)} required />
        <Button>Add</Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  )
}