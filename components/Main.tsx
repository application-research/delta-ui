'use client';

import React from 'react';
import { apps } from '@root/common/navigation';

import styles from './Main.module.scss';

import AppDDM from '@components/apps/ddm/DDM';

export default function Main(props) {
  const [activeApp, setActiveApp] = React.useState(apps.ddm);

  switch (activeApp) {
    case apps.ddm:
      return <AppDDM apps={Object.keys(apps )} onSwitchApp={setActiveApp} />
    case apps.ptolemy:
      // TODO
  }
}