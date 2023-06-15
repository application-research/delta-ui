'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from './Datasets.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import WalletRef from '@components/WalletRef';

export default function Datasets(props: {
  datasets: any[],
  searchLabel: string,
  search: string,
  onSearchChange: (string) => void,
  placeholder: string,
  setSelectedDataset: (string) => void,
  attachContentButton: React.MutableRefObject<any>
  onAttachContent: (anchor: React.ReactHTMLElement<any>) => void,
}) {
  const modalAnchors = React.useRef({});
  
  return (<div className={styles.body}>
    {props.datasets &&
      <div className={tableStyles.body}>
        <Input
          labelClassName={tableStyles.searchLabel}
          inputClassName={tableStyles.searchInput}
          label={props.searchLabel}
          id="scene-datasets-search"
          placeholder={props.placeholder}
          value={props.search}
          onChange={props.onSearchChange}
        />
        <div className={tableStyles.header}>
          <span className={tableStyles.columnId}>Id</span>
          <span className={tableStyles.columnName}>Name</span>
          <span className={tableStyles.column}>Progress</span>
          <span className={tableStyles.column}>Size</span>
          <span className={tableStyles.column}>Deals Made</span>
          <span className={tableStyles.column}>Replication Quota</span>
          <span className={tableStyles.column}>Duration</span>
          <span className={tableStyles.fluidColumn}>Wallets</span>
        </div>
        {props.datasets
          .filter((dataset, i) => !props.search || dataset.name.includes(props.search))
          .map((dataset, i) => {
            // let progress = dataset.bytes_replicated.padded / dataset.bytes_total.padded / dataset.replication_quota;
            let progress = .4
            if (Number.isNaN(progress)) progress = 0;
            
            return (
              <div key={dataset.name}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.columnId}>{dataset.ID}</span>
                  <span className={tableStyles.columnName}>{dataset.name}</span>
                  <span className={tableStyles.column}>{progress * 100}%</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(dataset.bytes_total.raw)}</span>
                  <span className={tableStyles.column}>{dataset.count_replicated} / {dataset.count_total}</span>
                  <span className={tableStyles.column}>{dataset.replication_quota}</span>
                  <span className={tableStyles.column}>{dataset.deal_duration} days</span>
                  <span className={tableStyles.fluidColumn}><div>{dataset.wallets?.map((wallet, i) => {
                    return <div key={i}><WalletRef address={wallet.address} /></div>
                  })}</div></span>
                </div>
                <div className={tableStyles.progress}>
                  <div className={tableStyles.progressBar} style={{ width: `${progress * 100}%` }} />
                </div>
                {/* <div className={tableStyles.rowButton}>➟ Make storage deals for this dataset</div> */}
                <div className={tableStyles.rowButton} onClick={e => {
                  props.setSelectedDataset(dataset.name);
                  props.onAttachContent(modalAnchors.current[dataset.name]);
                }}><span ref={el => modalAnchors.current[dataset.name] = el}>➟ Attach content</span></div>
              </div>
            )
          })
        }
      </div>
    }
    {props.datasets === undefined && <LoadingIndicator padded />}
  </div>);
}
