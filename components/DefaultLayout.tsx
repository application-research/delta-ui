import styles from '@components/DefaultLayout.module.scss';
import { navigationStates } from '@root/common/navigation';

import * as React from 'react';

export default function DefaultLayout(props: {
  apps: string[],
  onSwitchApp: (app: string) => void,
  children: any,
}) {
  let title = props.children?.find(child => child.type === AppTitle);
  let version = props.children?.find(child => child.type === AppVersion);
  let nav = props.children?.find(child => child.type === AppNav);
  let body = props.children?.find(child => child.type === AppBody)
  
  return (
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.appTitle}>{title}</div>
        </div>
        <div className={styles.topRight}>
          <div className={styles.appVersion}>{version}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <nav className={styles.appNavigation}>{nav}</nav>
        </div>
        <div className={styles.right}>{body}</div>
      </div>
    </div>
  );
}

export function AppTitle(props) {
  return <>{props.children}</>;
}

export function AppVersion(props) {
  return <>{props.children}</>;
}

export function AppNav(props) {
  return <div>{props.children}</div>;
}

export function AppNavItem(props) {
  return <span className={styles.appNavigationItem} onClick={props.onClick}>{props.children}</span>;
}

export function AppNavSubItem(props) {
  return <span className={styles.appNavigationSubItem} onClick={props.onClick}>{props.children}</span>;
}

export function AppBody(props) {
  return <div>{props.children}</div>;
}