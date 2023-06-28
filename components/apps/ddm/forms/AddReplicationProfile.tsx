import React from 'react';

import Input from '@root/components/basic/Input';
import DatasetSelect from '@root/components/DatasetSelect';
import ProviderSelect from '@root/components/ProviderSelect';
import styles from './AddReplicationProfile.module.scss';
import Button from '@root/components/Button';
import { addReplicationProfile } from '@root/data/api';
import Feedback from '@root/components/Feedback';
import { DDMContext } from '@root/common/ddm';

export default function (props: {}) {
  const ctx = React.useContext(DDMContext);
  
  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  
  const [provider, setProvider] = React.useState('');
  const [datasetID, setDatasetID] = React.useState(0);
  const [indexed, setIndexed] = React.useState(false);
  const [unsealed, setUnsealed] = React.useState(false);

  React.useEffect(() => {
    ctx.updateProviders();
    ctx.updateDatasets();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await addReplicationProfile(provider, datasetID, indexed, unsealed);
      ctx.updateReplicationProfiles();

      setFeedback(<Feedback type="success" />)
    } catch (e) {
      setFeedback(<Feedback type="error">{e.toString()}</Feedback>);
    } finally {
      setLoading(false);
    }
  }

  function formValid() {
    return !!provider && !!datasetID;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2 className={styles.heading}>Add Replication Profile</h2>
        <div className={styles.formRow}>
          <ProviderSelect providers={ctx.providers} label="Provider" required onChange={(e) => setProvider(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <DatasetSelect datasets={ctx.datasets} label="Dataset" required onChange={(e) => setDatasetID(Number(e.target.value))} />
        </div>
        <div className={styles.formRow}>
          <Input type="checkbox" label="Indexed" onChange={(e) => setIndexed(e.target.checked)} />
        </div>
        <div className={styles.formRow}>
          <Input type="checkbox" label="Unsealed" onChange={(e) => setUnsealed(e.target.checked)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!formValid() || feedback?.props.type === 'success'} loading={loading} primary>Add</Button>
        </div>
      </form>
      {feedback}
    </div>
  );
}
