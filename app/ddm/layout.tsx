'use client';

import * as React from 'react';
import PackageJSON from '@root/package.json';
import { CreateDDMState as createDDMState, DDMContext, loadAuth, tooltipStates } from '@common/ddm';
import { associateWallet, checkAuth, getDatasets, getHealth, getProviders, getReplicationProfiles, getReplications, GetReplicationsConfig, getWallets } from '@data/api';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSettingItem, AppNavSettings, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';
import Modal from '@root/components/Modal';

import FormUploadData from '@root/components/apps/ddm/forms/FormUploadData';
import FormAddWallet from '@root/components/apps/ddm/forms/FormAddWallet';
import FormAddProvider from '@root/components/apps/ddm/forms/FormAddProvider';
import FormAddReplication from '@root/components/apps/ddm/forms/FormAddReplication';
import FormNewDataset from '@root/components/apps/ddm/forms/FormNewDataset';
import AddReplicationProfile from '@root/components/apps/ddm/forms/AddReplicationProfile';
import FormSetPreferences from '@root/components/apps/ddm/forms/FormSetPreferences';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DDM(props) {
  const router = useRouter();
  const pathname = usePathname();

  const [health, setHealth] = React.useState(undefined);
  const [commitHash, setCommitHash] = React.useState(undefined);
  const [appTooltipState, setAppTooltipState] = React.useState(0);
  const [unauthorized, setUnauthorized] = React.useState(false);

  const newDatasetButton = React.useRef(null);
  const addProviderButton = React.useRef(null);
  const addReplicationButton = React.useRef(null);
  const addReplicationProfileButton = React.useRef(null);
  const addWalletButton = React.useRef(null);
  const addPreferencesButton = React.useRef(null);

  const anchor = React.useRef(null);
  function setAppTooltip(newID: any, newAnchor: React.ReactHTMLElement<any>) {
    anchor.current = newAnchor;
    setAppTooltipState(newID);
  }

  async function updateHealth() {
    setHealth(await getHealth());
  }

  async function updateCommitHash() {
    setCommitHash((await (await fetch('/api')).json()).commit_hash);
  }

  function dismissTooltip(id) {
    setAppTooltipState((prev) => (prev === id ? 0 : prev));
  }

  // Preliminary auth check
  React.useEffect(() => {
    (async () => {
      let authorized = false;
      try {
        authorized = await checkAuth();
      } catch (e) {
        console.error(e);
      }
      
      if (authorized) {
        updateHealth();
        updateCommitHash();
      } else {
        setUnauthorized(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (unauthorized) {
      if (pathname !== '/ddm/auth') {
        router.replace(`/ddm/auth?return=${encodeURI(pathname)}`);
      }
    }
  });

  function createCustomDDMState() {
    let state = createDDMState();

    // Replace the default anchor ref with one defined in this component so it
    // can be changed / used from here
    state.tooltipAnchor = anchor;

    // Replace tooltip state
    state.tooltipState = appTooltipState;
    state.setTooltipState = setAppTooltipState;

    // Replaced unauthorized state
    state.unauthorized = unauthorized;
    state.setUnauthorized = setUnauthorized;
    
    return state;
  }

  return (
    <DDMContext.Provider value={createCustomDDMState()}>
      <DefaultLayout apps={props.apps} onSwitchApp={props.onSwitchApp} activeApp={props.activeApp}>
        <AppTitle>Delta DM</AppTitle>
        <AppVersion>{`
        UUID: ${health?.uuid || 'not set'} 
        | 
        DDM Version: ${health?.ddm_info.version} (${health?.ddm_info.commit}) 
        | 
        Delta Version: ${health?.delta_info.version} (${health?.delta_info.commit})
        |
        UI Version: ${PackageJSON.version} (${commitHash})
      `}</AppVersion>
        <AppNav>
          <AppNavItem href="/ddm/datasets">Datasets</AppNavItem>
          <AppNavSubItem action={() => setAppTooltip(tooltipStates.newDataset, newDatasetButton.current)}>
            <span ref={newDatasetButton}>+ New dataset</span>
          </AppNavSubItem>
          <AppNavItem href="/ddm/providers">Providers</AppNavItem>
          <AppNavSubItem action={() => setAppTooltip(tooltipStates.addProvider, addProviderButton.current)}>
            <span ref={addProviderButton}>+ Add provider</span>
          </AppNavSubItem>
          <AppNavItem href="/ddm/replication-profiles">Repl. Profiles</AppNavItem>
          <AppNavSubItem action={() => setAppTooltip(tooltipStates.addReplicationProfile, addReplicationProfileButton.current)}>
            <span ref={addReplicationProfileButton}>+ Add profile</span>
          </AppNavSubItem>
          <AppNavItem href="/ddm/replications">Replications</AppNavItem>
          <AppNavSubItem action={() => setAppTooltip(tooltipStates.addReplication, addReplicationButton.current)}>
            <span ref={addReplicationButton}>+ Add replication</span>
          </AppNavSubItem>
          <AppNavItem href="/ddm/wallets">Wallets</AppNavItem>
          <AppNavSubItem action={() => setAppTooltip(tooltipStates.addWallet, addWalletButton.current)}>
            <span ref={addWalletButton}>+ Add wallet</span>
          </AppNavSubItem>
        </AppNav>
        <AppNavSettings>
          <AppNavSettingItem onClick={(e) => setAppTooltip(tooltipStates.setPreferences, addPreferencesButton.current)}>
            <span style={{ fontSize: 26 }}>&#9881;</span>
            <span style={{ marginLeft: 15, paddingTop: 10 }} ref={addPreferencesButton}>
              Settings
            </span>
          </AppNavSettingItem>
        </AppNavSettings>
        <AppBody>
          {props.children}
          {appTooltipState === tooltipStates.newDataset && (
            <Modal anchor={anchor} modalID={tooltipStates.newDataset} onClose={dismissTooltip}>
              <FormNewDataset />
            </Modal>
          )}
          {appTooltipState === tooltipStates.addProvider && (
            <Modal anchor={anchor} modalID={tooltipStates.addProvider} onClose={dismissTooltip}>
              <FormAddProvider />
            </Modal>
          )}
          {appTooltipState === tooltipStates.addWallet && (
            <Modal anchor={anchor} modalID={tooltipStates.addWallet} onClose={dismissTooltip}>
              <FormAddWallet onOutsideClick={dismissTooltip} />
            </Modal>
          )}
          {appTooltipState === tooltipStates.addReplicationProfile && (
            <Modal anchor={anchor} modalID={tooltipStates.addReplicationProfile} onClose={dismissTooltip}>
              <AddReplicationProfile />
            </Modal>
          )}
          {appTooltipState === tooltipStates.attachContent && (
            <Modal anchor={anchor} modalID={tooltipStates.attachContent} onClose={dismissTooltip}>
              <FormUploadData />
            </Modal>
          )}
          {appTooltipState === tooltipStates.addReplication && (
            <Modal anchor={anchor} modalID={tooltipStates.addReplication} onClose={dismissTooltip}>
              <FormAddReplication />
            </Modal>
          )}
          {appTooltipState === tooltipStates.setPreferences && (
            <Modal anchor={anchor} modalID={tooltipStates.setPreferences} onClose={dismissTooltip} attach="bottom">
              <FormSetPreferences />
            </Modal>
          )}
        </AppBody>
      </DefaultLayout>
    </DDMContext.Provider>
  );
}
