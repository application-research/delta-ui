import * as React from 'react';
import { addProvider } from '@data/api';

import styles from './FormAddProvider.module.scss';

import Dismissible from '@components/Dismissible';
import Button from '@components/Button';
import Input from '@components/Input';
import Feedback from '@components/Feedback';

export default function FormAddProvider(props) {

  const [providerID, setProviderID] = React.useState('');
  const [providerName, setProviderName] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(<Feedback />);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setFeedback(undefined);
      setLoading(true);

      await addProvider(providerID, providerName);
      props.updateState();

      setFeedback(<Feedback type='success' />);
      setTimeout(props.onOutsideClick, 2500);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
    } finally {
      setLoading(false);
    }
  }

  return (<Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
    <h2 className={styles.heading}>Add provider</h2>
    <form onSubmit={onSubmit}>
      <div className={styles.formRow}>
        <Input
          label="Provider ID"
          id="provider-id"
          onChange={e => setProviderID(e.target.value)}
          autoFocus
          autoComplete='new-password'
          placeholder='example: f012345'
          spellCheck='false'
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          id="provider-name"
          label="Provider Name"
          onChange={e => setProviderName(e.target.value)}
          placeholder="a friendly name"
        />
      </div>
      <div className={styles.formRow}>
        <Button disabled={!(providerID)} loading={loading}>Add</Button>
      </div>
    </form>
    {feedback}
  </Dismissible>)
}