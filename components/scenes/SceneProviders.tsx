'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from './SceneProviders.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import ProviderRef from '@components/ProviderRef';

export default function SceneProviders(props) {
  return (<div className={styles.body}>
    <Input label={props.providerLabel} id="scene-provider-search" placeholder={props.placeholder} value={props.search} onChange={props.onSearchChange} />
    {props.state.providers &&
      <div className={tableStyles.body}>
        <div className={tableStyles.header}>
          <span className={tableStyles.column}>Provider ID</span>
          <span className={tableStyles.column}>Provider Name</span>
          <span className={tableStyles.column}>Bytes Replicated</span>
          <span className={tableStyles.fluidColumn}>Provider Key</span>
        </div>
        {props.state.providers
          .filter(
            (provider, i) => !props.search || provider.actor_id.includes(props.search)
          )
          .map(
            (provider, i) => {
              return (<div key={i}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.column}><ProviderRef providerID={provider.actor_id} /></span>
                  <span className={tableStyles.column}>{provider.actor_name}</span>
                  <span className={tableStyles.column}>{provider.bytes_replicated.padded}</span>
                  <span className={tableStyles.fluidColumn}><span className={styles.secret}>{provider.key}</span></span>
                </div>
              </div>)
            }
          )
        }
      </div>
    }
    {props.state.providers === undefined && <LoadingIndicator />}
  </div>);
}
