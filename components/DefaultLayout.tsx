import styles from '@components/DefaultLayout.module.scss';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import * as React from 'react';

export default function DefaultLayout(props: { apps: string[], activeApp: string, onSwitchApp: (app: string) => void, children: any }) {
  let title = props.children?.find((child) => child.type === AppTitle);
  let version = props.children?.find((child) => child.type === AppVersion);
  let nav = props.children?.find((child) => child.type === AppNav);
  let settings = props.children?.find((child) => child.type === AppNavSettings);
  let body = props.children?.find((child) => child.type === AppBody);

  // NOTE(@elijaharita): this works right now because there are only 2 apps
  // (ptolemy and ddm). It will need to be changed in the future if more apps
  // are added.
  function toggleApp() {
    let otherApp = props.apps.filter((app) => app != props.activeApp)[0];
    props.onSwitchApp(otherApp);
    console.log('switching to app ' + otherApp);
  }

  return (
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.appTitle}>
            <span onClick={(e) => toggleApp()}>{title}</span>
          </div>
        </div>
        <div className={styles.topRight}>
          <div className={styles.appVersion}>{version}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <nav className={styles.appNavigation}>{nav}</nav>
          <nav className={styles.appNavigationSettings}>{settings}</nav>
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

export function AppNav(props: { children: React.ReactNode }) {
  return <div>{props.children}</div>;
}

export function AppNavSettings(props) {
  return <div className={styles.appNavigationSettings}>{props.children}</div>;
}

export function AppNavItem(props: { href: string, children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link href={props.href} className={styles.appNavigationItem}>
      {props.children}
      {pathname === props.href && ' ➝'}
    </Link>
  );
}

export function AppNavSubItem(props: {
  action: () => void,
  children: React.ReactNode,
}) {
  return (
    <span className={styles.appNavigationSubItem} onClick={props.action}>
      {props.children}
    </span>
  );
}

export function AppNavSettingItem(props) {
  return (
    <span className={styles.appNavigationSettingItem} onClick={props.onClick}>
      {props.children}
    </span>
  );
}

export function AppBody(props) {
  return <div>{props.children}</div>;
}
