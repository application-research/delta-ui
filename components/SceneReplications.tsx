'use client';

import styles from '@components/SceneReplications.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

export default function SceneReplications(props) {
  return (
    <div className={styles.body}>
      <div className={tableStyles.body}>
        <div className={tableStyles.header}>
          <div className={tableStyles.column}>ID</div>
          <div className={tableStyles.column}>Status</div>
          <div className={tableStyles.column}>Deal Time</div>
          <div className={tableStyles.column}>Provider ID</div>
          <div className={tableStyles.fluidColumn}>Proposal CID</div>
          <div className={tableStyles.fluidColumn}>Piece CID (CommP)</div>
          <div className={tableStyles.fluidColumn}>Message</div>
        </div>
        {props.state.replications.map((replication, i) => {
          return (
            <div key={i}>
              <div className={tableStyles.row}>
                <div className={tableStyles.column}>{replication.ID}</div>
                <div className={tableStyles.column}>{replication.status}</div>
                <div className={tableStyles.column}>{replication.deal_time}</div>
                <div className={tableStyles.column}>{replication.provider_actor_id}</div>
                <div className={tableStyles.fluidColumn}>{replication.proposal_cid}</div>
                <div className={tableStyles.fluidColumn}>{replication.content_commp}</div>
                <div className={tableStyles.fluidColumn}>{replication.delta_message}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
