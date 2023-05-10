'use client';

import * as React from 'react';
import { associateWallet } from '@data/api';

import styles from './FormAssociateWallet.module.scss';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import DatasetSelect from '@components/DatasetSelect';
import TagSelect from '@components/TagSelect';
import Feedback from '@components/Feedback';

export default function FormAssociateWallet(props) {
  const [datasets, setDatasets] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(<Feedback />);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await associateWallet(props.selectedWallet, datasets);
      props.updateState();

      setTimeout(props.onOutsideClick, 2500);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
    } finally {
      setLoading(false);
    }
  }

  function isFormValid() {
    return datasets.length !== 0;
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Associate wallet</h2>
      <p className={styles.paragraph}>{props.selectedWallet}</p>
      <form onSubmit={onSubmit}>
        <div className={styles.formRow}>
          <TagSelect selected={datasets} setSelected={setDatasets} options={props.state.datasets.map((dataset, i) => dataset.name)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!isFormValid()} loading={loading}>Apply</Button>
        </div>
      </form>
      {feedback && <div className={styles.error}>{feedback}</div>}
    </Dismissible>
  )
}