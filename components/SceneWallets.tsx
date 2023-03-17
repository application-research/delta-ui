'use client';

import styles from '@components/SceneWallets.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';
import LoadingIndicator from './LoadingIndicator';

export default function SceneWallets(props) {
  return (
    <div className={styles.body}>
      {props.state.wallets &&
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            <span className={tableStyles.fluidColumn}>Address</span>
            <span className={tableStyles.column}>Filecoin Balance</span>
            <span className={tableStyles.column}>Datacap Balance</span>
            <span className={tableStyles.column}>Dataset Name</span>
          </div>
          {props.state.wallets.map((wallet, i) => {
            return (
              <div key={i}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.fluidColumn}>
                    <span>{wallet.address}</span> 
                    <span>&nbsp;|&nbsp;</span> 
                    <a href={`https://filfox.info/en/address/${wallet.address}`} target="_blank">
                      filfox
                    </a>
                  </span>
                  <span className={tableStyles.column}>{wallet.balance.balance_filecoin}</span>
                  <span className={tableStyles.column}>{wallet.balance.balance_datacap}</span>
                  <span className={tableStyles.column}>{wallet.dataset_name}</span>
                </div>
                {!wallet.dataset_name && <div className={tableStyles.rowButton} onClick={e => {
                  props.setSelectedWallet(wallet.address);
                  props.onAssociateWallet();
                }}>➟ Associate with dataset</div>}
              </div>
            )
          })}
        </div>
      }
      {props.state.wallets === undefined && <LoadingIndicator />}
    </div >
  )
}
