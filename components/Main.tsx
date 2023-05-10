'use client';

import React from 'react';
import { apps } from '@root/common/navigation';

import styles from './Main.module.scss';

import AppDDM from '@components/apps/ddm/DDM';
import AppPtolemy from '@components/apps/ptolemy/Ptolemy';

export default function Main(props) {
  const [activeApp, setActiveApp] = React.useState(apps.ddm);
  const appNames = Object.keys(apps);

  switch (activeApp) {
    case apps.ddm:
      return <AppDDM apps={appNames} onSwitchApp={setActiveApp} activeApp={activeApp} />
    case apps.ptolemy:
      return <AppPtolemy apps={appNames} onSwitchApp={setActiveApp} activeApp={activeApp} />
  }
}