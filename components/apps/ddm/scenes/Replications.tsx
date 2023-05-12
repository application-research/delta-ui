'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from './Replications.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import ProviderRef from '@components/ProviderRef';
import Button from '@components/Button';

export default function Replications(props) {
  return (
    <div className={styles.body}>
      {props.state.replications &&
        <div className={tableStyles.body}>
          <div className={styles.filterMenu}>
            <form className={styles.filterMenuBody} onClick={e => e.preventDefault()}>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label='Datasets (Comma-Separated)' placeholder='one-dataset,two-dataset' />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label='Providers (Comma-Separated)' placeholder='f012345,f067890' />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type='datetime-local' label='Deal Time Min.' />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type='datetime-local' label='Deal Time Max.' />
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label='Proposal CID' autoComplete='disabled' spellCheck='false' />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label='Piece CID' autoComplete='off' />
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label='Message' />
                </div>
                <div className={styles.filterMenuButtonColumn}>
                  <Button>Apply</Button>
                </div>
              </div>
            </form>
          </div>
          <div className={tableStyles.header}>
            <div className={tableStyles.column}>Dataset</div>
            <div className={tableStyles.column}>Status</div>
            <div className={tableStyles.column}>Provider ID</div>
            <div className={tableStyles.column}>Self Service</div>
            <div className={tableStyles.fluidColumn}>Deal Time</div>
            <div className={tableStyles.fluidColumn}>Proposal CID</div>
            <div className={tableStyles.fluidColumn}>Piece CID (CommP)</div>
            <div className={tableStyles.fluidColumn}>Message</div>
          </div>
          {props.state.replications
            .filter((replication, i) => {
              return !props.search
                || replication.status?.toLowerCase().includes(props.search.toLowerCase())
                || replication.deal_time?.toString().toLowerCase().includes(props.search.toLowerCase())
                || replication.provider_actor_id?.toLowerCase().includes(props.search.toLowerCase())
                || replication.proposal_cid?.toLowerCase().includes(props.search.toLowerCase())
                || replication.content_commp?.toLowerCase().includes(props.search.toLowerCase())
                || replication.delta_message?.toLowerCase().includes(props.search.toLowerCase());
            })
            .map((replication, i) => {
              return (
                <div key={i}>
                  <div className={tableStyles.row}>
                    <div className={tableStyles.column}>{replication.content.dataset_name}</div>
                    <div className={tableStyles.column}>{replication.status}</div>
                    <div className={tableStyles.column}><ProviderRef providerID={replication.provider_actor_id} /></div>
                    <div className={tableStyles.column}>{replication.is_self_service ? "true" : "false"}</div>
                    <div className={tableStyles.fluidColumn}>{new Date(Date.parse(replication.deal_time)).toUTCString()}</div>
                    <div className={tableStyles.fluidColumn}>{replication.proposal_cid}</div>
                    <div className={tableStyles.fluidColumn}>{replication.content_commp}</div>
                    <div className={tableStyles.fluidColumn}>{replication.delta_message}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
      {props.state.replications === undefined && <LoadingIndicator padded />}
    </div>
  );
}
