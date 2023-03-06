'use client';

import styles from '@components/SceneProviders.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';

export default function SceneProviders(props) {
  return (
    <div className={styles.body}>
      <Input label={props.providerLabel} id="scene-provider-search" placeholder={props.placeholder} value={props.providerValue} onChange={props.onProviderChange} />
      {
        props.state.providers &&
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            <span className={tableStyles.column}>Actor ID</span>
            <span className={tableStyles.fluidColumn}>Replicated Deals</span>
          </div>
          {
            props.state.providers.map((provider, i) => {
              return (
                <div>
                  <div key={i} className={tableStyles.row}>
                    <span className={tableStyles.column}>{provider.actor_id}</span>
                    <span className={tableStyles.fluidColumn}>{provider.replications?.length() || 0}</span>
                  </div>
                  <div className={tableStyles.rowButton}>➟ Make storage deals</div>
                  <div className={tableStyles.rowButton}>➟ View details</div>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
}
