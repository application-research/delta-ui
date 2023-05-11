'use client';

import React from 'react';
import { addDataset } from '@root/data/api';
import { createSlug } from '@root/common/utilities';

import styles from './FormNewDataset.module.scss';

import Dismissible from '@components/Dismissible';
import Input from '@components/basic/Input';
import Button from '@components/Button';
import Feedback from '@components/Feedback';

export default function FormNewDataset(props) {
  let [name, setName] = React.useState('');
  let [replications, setReplications] = React.useState(6);
  let [duration, setDuration] = React.useState(540);
  let [indexed, setIndexed] = React.useState(false);
  let [unsealed, setUnsealed] = React.useState(false);

  let [loading, setLoading] = React.useState(false);
  let [feedback, setFeedback] = React.useState(<Feedback />);

  async function onSubmit(e) {
    e.preventDefault();


    try {
      setFeedback(<Feedback />)
      setLoading(true);

      await addDataset(
        name,
        replications,
        duration,
        unsealed,
        indexed
      );
      props.updateState();

      setFeedback(<Feedback type='success' />)
      setTimeout(props.onOutsideClick, 2500);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
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
    <div>
      <form onSubmit={onSubmit}>
        <h2 className={styles.heading}>New dataset</h2>
        <div className={styles.formRow}>
          <Input label="Dataset Name" id="dataset-name" value={name} placeholder="a friendly name" required autoFocus onChange={e => setName(normalizeName(e.target.value))} />
        </div>
        <div className={styles.formRow}>
          <Input type="number" label="Replication Count" value={replications} id="dataset-replications" required onChange={e => setReplications(parseInt(e.target.value))} />
        </div>
        <div className={styles.formRow}>
          <Input type="number" label="Deal Duration (Days)" value={duration} onChange={e => setDuration(parseInt(e.target.value))} />
        </div>
        <div className={styles.formRow}>
          <Input type="checkbox" label="Publish to indexer?" checked={indexed} id="dataset-indexed" onChange={e => setIndexed(e.target.checked)} />
        </div>
        <div className={styles.formRow}>
          <Input type="checkbox" label="Keep unsealed copy?" checked={unsealed} id="dataset-unsealed" onChange={e => setUnsealed(e.target.checked)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!isFormValid()} loading={loading}>Create</Button>
        </div>
      </form>
      {feedback}
    </div>
  );
}