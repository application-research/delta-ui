'use client';

import React from 'react';
import { apps } from '@root/common/navigation';

import styles from './Main.module.scss';

import AppDDM from '@components/apps/ddm/DDM';
import AppPtolemy from '@components/apps/ptolemy/Ptolemy';
import { getCookie, setCookie } from '@root/modules/cookies';

export default function Main(props) {
  const [activeApp, _setActiveApp] = React.useState(getCookie('active-app') || apps.ddm);
  function setActiveApp(app: string) {
    _setActiveApp(app);
    setCookie('active-app', app);
  }
  const appNames = Object.keys(apps);

  switch (activeApp) {
    case apps.ddm:
      return <AppDDM apps={appNames} onSwitchApp={setActiveApp} activeApp={activeApp} />
    case apps.ptolemy:
      return <AppPtolemy apps={appNames} onSwitchApp={setActiveApp} activeApp={activeApp} />
  }
}