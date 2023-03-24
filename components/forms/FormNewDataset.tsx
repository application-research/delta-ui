'use client';

import styles from './FormNewDataset.module.scss';

import Dismissible from '@components/Dismissible';
import Input from '@components/Input';
import Button from '@components/Button';
import React from 'react';
import { addDataset } from '@root/data/api';
import { createSlug } from '@root/common/utilities';

export default function FormNewDataset(props) {
  let [name, setName] = React.useState('');
  let [replications, setReplications] = React.useState(6);
  let [duration, setDuration] = React.useState(540);
  let [indexed, setIndexed] = React.useState(false);
  let [unsealed, setUnsealed] = React.useState(false);

  let [loading, setLoading] = React.useState(false);
  let [error, setError] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();

    
    try {
      setLoading(true);

      await addDataset(
        name,
        replications,
        duration,
        unsealed,
        indexed
      );

      await props.updateState();
      props.onOutsideClick();
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  function isFormValid() {
    return name.length > 0 && replications > 0 && duration > 0;
  }

  function normalizeName(text: any) {
    const a = 'æøåàáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
    const b = 'aoaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
    const p = new RegExp(a.split('').join('|'), 'g');
  
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special chars
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, ''); // Trim - from start of text
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <form onSubmit={onSubmit}>
        <h2 className={styles.heading}>New dataset</h2>
        <Input label="Dataset Name" id="dataset-name" value={name} placeholder="a friendly name" required autoFocus onChange={e => setName(normalizeName(e.target.value))} />
        <br />
        <Input type="number" label="Replication Count" value={replications} id="dataset-replications" required onChange={e => setReplications(e.target.value)} />
        <br />
        <Input type="number" label="Deal Duration (Days)" value={duration} onChange={e => setDuration(e.target.value)} />
        <br />
        <Input type="checkbox" label="Publish to indexer?" checked={indexed} id="dataset-indexed" onChange={e => setIndexed(e.target.checked)} />
        <br />
        <Input type="checkbox" label="Keep unsealed copy?" checked={unsealed} id="dataset-unsealed" onChange={e => setUnsealed(e.target.checked)} />
        <br />
        <Button disabled={!isFormValid()} loading={loading}>Create</Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  );
}