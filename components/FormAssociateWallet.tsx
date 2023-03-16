'use client';

import React from 'react';
import { associateWallet } from '@data/api';

import styles from '@components/FormAssociateWallet.module.scss';
import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import Input from '@components/Input';

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

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Associate wallet</h2>
      <p className={styles.paragraph}>{props.selectedWallet}</p>
      <form onSubmit={onSubmit}>
        <Input
          id='dataset-name'
          label='Dataset Name'
          placeholder='a registered dataset name'
          value={datasetName}
          onChange={e => setDatasetName(e.target.value)}
        />
        <Button>Apply</Button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </Dismissible>
  )
}