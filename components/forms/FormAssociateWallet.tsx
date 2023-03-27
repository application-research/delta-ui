'use client';

import * as React from 'react';
import { associateWallet } from '@data/api';

import styles from './FormAssociateWallet.module.scss';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import DatasetSelect from '@components/DatasetSelect';

export default function FormAssociateWallet(props) {
  const [datasetName, setDatasetName] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      
      await associateWallet(props.selectedWallet, datasetName);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }

    props.updateState();
  }

  function isFormValid() {
    return !!datasetName;
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Associate wallet</h2>
      <p className={styles.paragraph}>{props.selectedWallet}</p>
      <form onSubmit={onSubmit}>
        <DatasetSelect id='dataset-name' label='Dataset Name' value={datasetName} onChange={e => setDatasetName(e.target.value)} datasets={props.state.datasets} required autoFocus />
        <Button disabled={!isFormValid()} loading={loading}>Apply</Button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </Dismissible>
  )
}