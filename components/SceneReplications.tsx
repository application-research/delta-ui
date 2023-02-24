'use client';

import styles from '@components/SceneReplications.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

export default function SceneReplications(props) {
  return (
    <div className={styles.body}>
      {props.state.replications.length ? (
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            {Object.keys(props.state.replications[0]).map((each, index) => {
              const isLast = Object.keys(props.state.replications[0]).length - 1 === index;

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

          {props.state.replications.map((each, index) => {
            return (
              <div key={`${index}`}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.column}>{each.id}</span>
                  <span className={tableStyles.column}>{Utilities.toDateISOString(each.sealed)}</span>
                  <span className={tableStyles.column}>{each.provider}</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(each.size)}</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(each.padded)}</span>
                  <span className={tableStyles.column}>{each.piece}</span>
                  <span className={tableStyles.column}>{each.payload}</span>
                  <span className={tableStyles.fluidColumn}>{each.proposal}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
