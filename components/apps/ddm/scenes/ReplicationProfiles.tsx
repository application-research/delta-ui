import React from 'react';
import styles from './ReplicationProfiles.module.scss';

export default function ReplicationProfiles(props: { replicationProfiles: any[], updateReplicationProfiles: () => void }) {
  return (
    <div className={styles.body}>
      <div>
        <div className={styles.header}>
          <div className={styles.column}>Dataset</div>
          <div className={styles.column}>Provider</div>
          <div className={styles.column}>Indexed</div>
          <div className={styles.fluidColumn}>Unsealed</div>
        </div>
        {props.replicationProfiles?.map((profile, i) => (
          <ProfileCard key={`${profile.dataset}-${profile.provider}`} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function ProfileCard(props: { profile: any }) {
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  return (
    <div className={styles.row}>
      <div className={styles.column}>{props.profile.dataset}</div>
      <div className={styles.column}>{props.profile.provider}</div>
      <div className={styles.column}>{props.profile.indexed ? 'true' : 'false'}</div>
      <div className={styles.fluidColumn}>{props.profile.unsealed ? 'true' : 'false'}</div>
      {editing && <>
        <div className={styles.columnButton}>Manage</div>
        <div className={styles.columnButton}>Delete</div>
      </>}
    </div>
  );
}
