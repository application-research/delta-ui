import * as React from 'react';
import { addProvider } from '@data/api';

import styles from '@components/apps/ddm/forms/FormAddProvider.module.scss';

import Dismissible from '@components/Dismissible';
import Button from '@components/Button';
import Input from '@components/basic/Input';
import Feedback from '@components/Feedback';
import { DDMContext } from '@root/common/ddm';

export default function FormAddProvider(props: {}) {
  const ctx = React.useContext(DDMContext);

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
      setFeedback(<Feedback type='success' />);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
    } finally {
      setLoading(false);
    }

    ctx.updateProviders();
  }

  return (
    <div>
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
          <Button disabled={!(providerID) || feedback?.props.type === 'success'} loading={loading} primary>Add</Button>
        </div>
      </form>
      {feedback}
    </div>
    )
}