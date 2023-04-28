'use client';

import styles from './SceneWallets.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Input from '@components/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import WalletRef from '@components/WalletRef';

export default function SceneWallets(props) {
  return (
    <div className={styles.body}>
      {props.state.wallets &&
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            <span className={tableStyles.fluidColumn}>Address</span>
            <span className={tableStyles.column}>Filecoin Balance</span>
            <span className={tableStyles.column}>Datacap Balance</span>
            <span className={tableStyles.column}>Datasets</span>
          </div>
          {props.state.wallets.map((wallet, i) => {
            return (
              <div key={i}>
                <div className={tableStyles.row}>
                  <span className={tableStyles.fluidColumn}>
                    <WalletRef address={wallet.address} />
                  </span>
                  <span className={tableStyles.column}>{wallet.balance.balance_filecoin / 1000000000000000000} FIL</span>
                  <span className={tableStyles.column}>{Utilities.bytesToSize(wallet.balance.balance_datacap)}</span>
                  <span className={tableStyles.column}>{wallet.datasets?.map((dataset, i) => {
                    return <div>{dataset.name}</div>
                  })}</span>
                </div>
                {!wallet.datasets?.length && <div className={tableStyles.rowButton} onClick={e => {
                  props.setSelectedWallet(wallet.address);
                  props.onAssociateWallet();
                }}>➟ Associate with datasets</div>}
              </div>
            )
          })}
        </div>
      }
      {props.state.wallets === undefined && <LoadingIndicator padded />}
    </div >
  )
}
