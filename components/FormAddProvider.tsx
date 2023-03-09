import Dismissible from '@components/Dismissible';
import styles from '@components/FormAddProvider.module.scss';
import Button from '@components/Button';
import React from 'react';

export default function FormAddProvider(props) {

  let [providerID, setProviderID] = React.useState('');
  let [providerName, setProviderName] = React.useState('');

  async function addProvider(e) {
    e.preventDefault();

    const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1314/api/v1";

    const res = await fetch(apiURL + "/providers", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actor_id: providerID,
        actor_name: providerName,
      })
    });

    if (!res.ok) {
      alert("Request failed: " + await res.json());
    }
  }

  return (<Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
    <h2 className={styles.heading}>Add provider</h2>
    <form onSubmit={addProvider}>
      <label htmlFor="provider-id" className={styles.fieldLabel}>Provider ID</label>
      <input
        type="text"
        id="provider-id"
        className={styles.field}
        onChange={e => setProviderID(e.target.value)}
        autoFocus
        autoComplete="new-password"
        placeholder="example: f012345"
      />
      <label htmlFor="provider-name" className={styles.fieldLabel}>Provider Name</label>
      <input
        type="text"
        id="provider-name"
        className={styles.field}
        onChange={e => setProviderName(e.target.value)}
        placeholder="a friendly name"
      />
      <Button disabled={!(providerID && providerName)}>Add</Button>
    </form>
  </Dismissible>)
}