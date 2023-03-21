'use client';

import * as React from 'react';
import { associateWallet } from '@data/api';

import styles from './FormAssociateWallet.module.scss';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import Select from '@components/Select';

export default function FormAssociateWallet(props) {
  const [error, setError] = React.useState('');
  const [datasetName, setDatasetName] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();

    try {
      await associateWallet(props.selectedWallet, datasetName);
    } catch (e) {
      setError(e.toString());
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
        <Select id='dataset-name' label='Dataset Name' value={datasetName} onChange={e => setDatasetName(e.target.value)}>
          <option value='' hidden>Select a dataset...</option>
          {props.state.datasets?.map((dataset, i) => {
            return <option key={i} value={dataset.name}>{dataset.name}</option>
          })}
        </Select>
        <Button disabled={!isFormValid()}>Apply</Button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </Dismissible>
  )
}