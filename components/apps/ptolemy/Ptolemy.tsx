import * as React from 'react';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';

export default function Ptolemy(props) {
  return (
    <DefaultLayout apps={props.apps} onSwitchApp={props.onSwitchApp} activeApp={props.activeApp}>
      <AppTitle>Ptolemy</AppTitle>
      <AppVersion>Vesion Placeholder</AppVersion>
      <AppNav>
        <AppNavItem>Jobs</AppNavItem>
        <AppNavSubItem>+ Create job</AppNavSubItem>
      </AppNav>
      <AppBody>
        Placeholder Body
      </AppBody>
    </DefaultLayout>
  )
}