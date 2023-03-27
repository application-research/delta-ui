import * as React from 'react';
import { addProvider } from '@data/api';

import styles from './FormAddProvider.module.scss';

import Dismissible from '@components/Dismissible';
import Button from '@components/Button';
import Input from '@components/Input';

export default function FormAddProvider(props) {

  let [providerID, setProviderID] = React.useState('');
  let [providerName, setProviderName] = React.useState('');

  let [loading, setLoading] = React.useState(false);
  let [error, setError] = React.useState('');

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await addProvider(providerID, providerName);

      await props.updateState();
      props.onOutsideClick();
    } catch (e) {
      setError(e.toString());
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
    {error && <p className={styles.error}>{error}</p>}
  </Dismissible>)
}