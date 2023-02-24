import styles from '@components/DefaultLayout.module.scss';

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
              Data {props.appNavigationState === 1 ? '➝' : null}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onUploadData}>
              + Upload data
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onImportData}>
              + Import data
            </span>
            <span className={styles.appNavigationItem} onClick={props.onClickProviders}>
              Providers {props.appNavigationState === 2 ? '➝' : null}
            </span>
            <span className={styles.appNavigationSubItem} onClick={props.onAddProviders}>
              + Add provider
            </span>
            <span className={styles.appNavigationItem} onClick={props.onClickReplications}>
              Replications {props.appNavigationState === 3 ? '➝' : null}
            </span>
          </nav>
        </div>
        <div className={styles.right}>{props.children}</div>
      </div>
    </div>
  );
}
