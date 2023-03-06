'use client';

import styles from '@components/SceneDatasets.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';

export default function SceneDatasets(props) {
  return (<div className={styles.body}>
    <Input label={props.searchLabel} id="scene-datasets-search" placeholder={props.placeholder} value={props.searchValue} onChange={props.onSearchChange} />
    {props.state.datasets &&
      <div className={tableStyles.body}>
        <div className={tableStyles.header}>
          <span className={tableStyles.column}>ID</span>
          <span className={tableStyles.column}>Name</span>
          <span className={tableStyles.column}>Size</span>
          <span className={tableStyles.column}>Replication Quota</span>
          <span className={tableStyles.column}>Start Epoch Delay</span>
          <span className={tableStyles.column}>Duration</span>
          <span className={tableStyles.column}>Unsealed</span>
          <span className={tableStyles.column}>Indexed</span>
          <span className={tableStyles.fluidColumn}>Wallet</span>
        </div>
        {props.state.datasets.map((dataset, i) => {
          let progress = dataset.bytes_replicated[0] / dataset.bytes_total[0] / dataset.replication_quota;

          return (<div>
            <div key={i} className={tableStyles.row}>
              <span className={tableStyles.column}>{dataset.ID}</span>
              <span className={tableStyles.column}>{dataset.name}</span>
              <span className={tableStyles.column}>{Utilities.bytesToSize(dataset.bytes_total[0])}</span>
              <span className={tableStyles.column}>{dataset.replication_quota}</span>
              <span className={tableStyles.column}>{dataset.delay_start_epoch}</span>
              <span className={tableStyles.column}>{dataset.deal_duration} days</span>
              <span className={tableStyles.column}>{dataset.unsealed ? "true" : "false"}</span>
              <span className={tableStyles.column}>{dataset.indexed ? "true" : "false"}</span>
              <span className={tableStyles.fluidColumn}>{dataset.wallet.address}</span>
            </div>
            <div className={tableStyles.progress}>
              <div className={tableStyles.progressBar} style={{ width: `${progress * 100}%` }} />
            </div>
            <div className={tableStyles.rowButton}>➟ Make storage deals for this dataset</div>
            <div className={tableStyles.rowButton}>➟ Attach content</div>
          </div>)
        })}
      </div>
    }
  </div>);
}
