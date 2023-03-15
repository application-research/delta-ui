import styles from '@components/DefaultLayout.module.scss';
import { navigationStates } from '@root/common/navigation';

import * as React from 'react';

export default function DefaultLayout(props) {
  return (
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.appTitle}>{props.appTitle}</div>
        </div>
        <div className={styles.topRight}>
          <div className={styles.appVersion}>{props.appVersion}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <nav className={styles.appNavigation}>
            <span className={styles.appNavigationItem} onClick={props.onClickDatasets}>
              Datasets {props.appNavigationState === navigationStates.datasets && '➝'}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onNewDataset}>
              + New dataset
            </span>
            <span className={styles.appNavigationItem} onClick={props.onClickProviders}>
              Providers {props.appNavigationState === navigationStates.providers && '➝'}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onAddProviders}>
              + Add provider
            </span>
            <span className={styles.appNavigationItem} onClick={props.onClickReplications}>
              Replications {props.appNavigationState === navigationStates.replications && '➝'}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onAddReplication}>
              + Add replication
            </span>
            <span className={styles.appNavigationItem} onClick={props.onClickWallets}>
              Wallets {props.appNavigationState === navigationStates.wallets && '➝'}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onAddWallet}>
              + Add wallet
            </span>
          </nav>
        </div>
        <div className={styles.right}>{props.children}</div>
      </div>
    </div>
  );
}
