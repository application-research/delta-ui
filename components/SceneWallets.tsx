'use client';

import styles from '@components/SceneWallets.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';

export default function SceneWallets(props) {  
  return (
    <div className={styles.body}>
      <div className={tableStyles.body}>
        <div className={tableStyles.header}>
          <span className={tableStyles.fluidColumn}>Address</span>
          <span className={tableStyles.column}>Datacap Used</span>
          <span className={tableStyles.column}>Dataset Name</span>
        </div>
        {props.state.wallets.map((wallet, i) => {
          return (
            <div key={i}>
              <div className={tableStyles.row}>
                <span className={tableStyles.fluidColumn}>{wallet.address}</span>
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
    </div >
  )
}
