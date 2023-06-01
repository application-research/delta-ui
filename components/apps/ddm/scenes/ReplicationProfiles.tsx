import React from 'react';
import styles from './ReplicationProfiles.module.scss';

export default function ReplicationProfiles(props: { 
  replicationProfiles: any[], 
  updateReplicationProfiles: () => void,
  datasets: any[],
}) {
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
          <ProfileCard key={`${profile.dataset}-${profile.provider}`} datasets={props.datasets} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function ProfileCard(props: { datasets: any[], profile: any }) {
  let [allowedDatasets, setAllowedDatasets] = React.useState(props.profile.allowed_datasets?.map((dataset, i) => dataset.name) || []);
  
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  return (
    <div className={styles.row}>
      <div className={styles.column}>{props.datasets.find(d => d.ID === props.profile.dataset_id)?.name}</div>
      <div className={styles.column}>{props.profile.provider_actor_id}</div>
      <div className={styles.column}>{props.profile.indexed ? 'true' : 'false'}</div>
      <div className={styles.fluidColumn}>{props.profile.unsealed ? 'true' : 'false'}</div>
      {editing 
        ? 
        <>
          <div className={styles.columnButton}></div>
        </>
        :
        <>
          <div className={styles.columnButton}>Manage</div>
          <div className={styles.columnButton}>Delete</div>
        </>
      }
    </div>
  );
}
