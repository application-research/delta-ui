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

      {props.state.providers.length ? (
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            {Object.keys(props.state.providers[0]).map((each, index) => {
              const isLast = Object.keys(props.state.providers[0]).length - 1 === index;

              if (isLast) {
                return (
                  <span className={tableStyles.fluidColumn} key={each}>
                    {each}
                  </span>
                );
              }

              return (
                <span className={tableStyles.column} key={each}>
                  {each}
                </span>
              );
            })}
          </div>

          {props.state.providers.map((each, index) => {
            return (
              <div key={`${index}`}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.column}>{each.id}</span>
                  <span className={tableStyles.column}>{each.provider}</span>
                  <span className={tableStyles.column}>{each.name}</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(each.bytes)}</span>
                  <span className={tableStyles.column}>{each.deals}</span>
                  <span className={tableStyles.fluidColumn}>{each.datasets}</span>
                </div>
                <div className={tableStyles.rowButton}>➟ Make storage deals</div>
                <div className={tableStyles.rowButton}>➟ View details</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
