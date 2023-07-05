'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from '@ddm/datasets/page.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import WalletRef from '@components/WalletRef';
import { DDMContext, tooltipStates } from '@root/common/ddm';

export default function Datasets() {  
  const modalAnchors = React.useRef({});
  const ctx = React.useContext(DDMContext);

  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    ctx.updateDatasets();
  }, []);
  
  function formatPercentNumber(percent) {
    if (percent == 0 || percent == 1) {
      return percent * 100
    }
    return (percent * 100).toFixed(1)
  }

  return (<div className={styles.body}>
    {ctx.datasets &&
      <div className={tableStyles.body}>
        <Input
          labelClassName={tableStyles.searchLabel}
          inputClassName={tableStyles.searchInput}
          label={'Search datasets'}
          id='scene-datasets-search'
          placeholder={'(example: university-bird-sounds)'}
          value={search}
          onChange={e => setSearch(e.target.value)}
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
        {ctx.datasets
          .filter((dataset, i) => !search || dataset.name.includes(search))
          .map((dataset, i) => {
            let progress = dataset.bytes_replicated.padded / dataset.bytes_total.padded / dataset.replication_quota;
            if (Number.isNaN(progress)) progress = 0;

            return (
              <div key={dataset.name}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.columnId}>{dataset.ID}</span>
                  <span className={tableStyles.columnName}>{dataset.name}</span>
                  <span className={tableStyles.column}>{formatPercentNumber(progress)}%</span>
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
                  ctx.setSelectedDataset(dataset.ID);
                  ctx.setTooltipState(tooltipStates.attachContent);
                  ctx.tooltipAnchor.current = modalAnchors.current[dataset.name];
                  console.log(tooltipStates.attachContent);
                }}><span ref={el => modalAnchors.current[dataset.name] = el}>➟ Attach content</span></div>
              </div>
            )
          })
        }
      </div>
    }
    {ctx.datasets === undefined && <LoadingIndicator padded />}
  </div>);
}
