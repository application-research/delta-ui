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
          <span className={tableStyles.column}>Name</span>
          <span className={tableStyles.fluidColumn}>Address</span>
        </div>
        {/* {props.state.wallets.map((wallet, i) => {
          return (
            <div key={i} className={tableStyles.row}>
              <span className={tableStyles.column}>wallet.name</span>
              <span className={tableStyles.fluidColumn}>wallet.address</span>
            </div>
          )
        })} */}
      </div>
    </div>
  )
}
