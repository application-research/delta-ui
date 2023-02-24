'use client';

import styles from '@components/SceneDatasets.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';

export default function SceneDatasets(props) {
  return (
    <div className={styles.body}>
      <Input label={props.searchLabel} id="scene-datasets-search" placeholder={props.placeholder} value={props.searchValue} onChange={props.onSearchChange} />

      {props.state.data.length ? (
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            {Object.keys(props.state.data[0]).map((each, index) => {
              const isLast = Object.keys(props.state.data[0]).length - 1 === index;

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

          {props.state.data.map((each, index) => {
            return (
              <div key={`${index}`}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.column}>{each.id}</span>
                  <span className={tableStyles.column}>{each.name}</span>
                  <span className={tableStyles.column}>{each.replications} / 6</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(each.bytes)}</span>
                  <span className={tableStyles.column}>{each.pieces}</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(each.datacap)}</span>
                  <span className={tableStyles.fluidColumn}>{each.address}</span>
                </div>
                <div className={tableStyles.progress}>
                  <div className={tableStyles.progressBar} style={{ width: `${(each.replications / 6) * 100}%` }} />
                </div>
                <div className={tableStyles.rowButton}>➟ Make storage deals for this dataset</div>
                <div className={tableStyles.rowButton}>➟ Attach content</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
