'use client';

import Dismissible from '@components/Dismissible';
import styles from '@components/FormAddReplication.module.scss';
import { addReplication } from '@root/data/api';
import React from 'react';
import Button from './Button';
import Input from './Input';

export default function FormAddReplication(props) {
  const [providerID, setProviderID] = React.useState('');
  const [datasetName, setDatasetName] = React.useState('');
  const [numDeals, setNumDeals] = React.useState(1);
  const [error, setError] = React.useState('');
  
  async function onSubmit(e) {
    e.preventDefault();

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
        <Input label='Provider ID' placeholder='example: f012345' autoFocus value={providerID} onChange={e => setProviderID(e.target.value)} />
        <Input label='Dataset Name' placeholder='leave blank for any dataset' value={datasetName} onChange={e => setDatasetName(e.target.value)} />
        <Input type='number' label='Number of Deals' value={numDeals} onChange={e => setNumDeals(e.target.value)} />
        <Button>Add</Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  )
}