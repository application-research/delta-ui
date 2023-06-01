import React from 'react';

import styles from './ReplicationProfiles.module.scss';

import Input from '@root/components/basic/Input';
import { deleteReplicationProfile, updateReplicationProfile } from '@root/data/api';
import Button from '@root/components/Button';

export default function ReplicationProfiles(props: { replicationProfiles: any[], updateReplicationProfiles: () => void, datasets: any[] }) {
  return (
    <div className={styles.body}>
      <div>
        <div className={styles.header}>
          <div className={styles.column}>Dataset</div>
          <div className={styles.column}>Provider</div>
          <div className={styles.column}>Indexed</div>
          <div className={styles.column}>Unsealed</div>
          <div className={styles.fluidColumn}></div>
        </div>
        {props.replicationProfiles?.map((profile, i) => (
          <ProfileCard key={`${profile.dataset}-${profile.provider}`} datasets={props.datasets} profile={profile} updateReplicationProfiles={props.updateReplicationProfiles} />
        ))}
      </div>
    </div>
  );
}

function ProfileCard(props: { datasets: any[], profile: any, updateReplicationProfiles: () => void }) {
  let [indexed, setIndexed] = React.useState(props.profile.indexed);
  let [unsealed, setUnsealed] = React.useState(props.profile.unsealed);

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function submitEdit() {
    setSaving(true);

    try {
      await updateReplicationProfile(props.profile.provider_actor_id, props.profile.dataset_id, indexed, unsealed);
      setEditing(false);
    } catch (e) {
      alert('Saving replication profile failed: ' + e.toString());
      return;
    } finally {
      setSaving(false);
    }

    props.updateReplicationProfiles();
  }

  async function submitDelete() {
    setSaving(true);

    try {
      await deleteReplicationProfile(props.profile.provider_actor_id, props.profile.dataset_id);
    } catch(e) {
      alert('Deleting replication profile failed: ' + e.toString());
      return;
    } finally {
      setSaving(false);
    }

    props.updateReplicationProfiles();
  }

  return (
    <div className={styles.row}>
      <div className={styles.column}>{props.datasets.find((d) => d.ID === props.profile.dataset_id)?.name}</div>
      <div className={styles.column}>{props.profile.provider_actor_id}</div>
      <div className={styles.column}>
        <Input type="checkbox" label="Indexed" disabled={!editing} checked={indexed} onChange={e => setIndexed(e.target.checked)} />
      </div>
      <div className={styles.column}>
        <Input type="checkbox" label="Unsealed" disabled={!editing} checked={unsealed} onChange={e => setUnsealed(e.target.checked)} />
      </div>
      <div className={styles.fluidColumn}></div>
      {editing ? (
        <>
          <Button className={styles.columnButtonSave} key={'manage'} loading={saving} onClick={submitEdit}>
            Save
          </Button>
          <div className={styles.columnButtonCancel} key={'cancel'} onClick={(e) => setEditing(false)}>
            Cancel
          </div>
        </>
      ) : confirmDelete ? (
        <>
          <Button className={styles.columnButtonDelete} key={'delete'} loading={saving} onClick={submitDelete}>
            Confirm Delete
          </Button>
          <div className={styles.columnButtonCancel} key={'cancel'} onClick={(e) => setConfirmDelete(false)}>
            Cancel
          </div>
        </>
      ) : (
        <>
          <div className={styles.columnButton} key={'manage'} onClick={(e) => setEditing(true)}>
            Manage
          </div>
          <div className={styles.columnButton} key={'delete'} onClick={(e) => setConfirmDelete(true)}>
            Delete
          </div>
        </>
      )}
    </div>
  );
}
