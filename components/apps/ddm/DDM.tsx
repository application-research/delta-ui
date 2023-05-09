'use client';

import * as React from 'react';
import PackageJSON from '@root/package.json';
import { navigationStates, tooltipStates } from '@common/navigation';
import { getCookie, setCookie } from '@modules/cookies';
import { associateWallet, checkAuth, getDatasets, getHealth, getProviders, getReplications, getWallets } from '@data/api';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';

import Datasets from '@root/components/apps/ddm/scenes/Datasets';
import Providers from '@root/components/apps/ddm/scenes/Providers';
import Replications from '@root/components/apps/ddm/scenes/Replications';
import Wallets from '@components/apps/ddm/scenes/Wallets';
import Auth from '@root/components/apps/ddm/scenes/Auth';

import FormUploadData from '@components/forms/FormUploadData';
import FormAddWallet from '@components/forms/FormAddWallet';
import FormAddProvider from '@components/forms/FormAddProvider';
import FormAddReplication from '@components/forms/FormAddReplication';
import FormNewDataset from '@components/forms/FormNewDataset';
import FormAssociateWallet from '@components/forms/FormAssociateWallet';

export default function DDM(props) {
  const [appNavigationState, setAppNavigationState] = React.useState(1);
  const [datasetSearch, setDatasetSearch] = React.useState('');
  const [providerSearch, setProviderSearch] = React.useState('');
  const [replicationSearch, setReplicationSearch] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [selectedDataset, setSelectedDataset] = React.useState('');
  const [selectedWallet, setSelectedWallet] = React.useState('');
  const [state, setState] = React.useState({ 
    datasets: undefined, 
    providers: undefined, 
    replications: undefined, 
    wallets: undefined 
  });
  const [health, setHealth] = React.useState(undefined);
  const [commitHash, setCommitHash] = React.useState(undefined);
  const [appTooltipState, setAppTooltipState] = React.useState(0);
  const [authToken, setAuthTokenEphemeral] = React.useState('');
  const setAuthToken = authToken => {
    setAuthTokenEphemeral(authToken);
    setCookie('auth', authToken);
  };
  const setDDMAddress = ddmAddress => {
    setCookie('ddm-address', ddmAddress);
  };

  async function updateState() {
    setState({
      datasets: await getDatasets(),
      providers: await getProviders(),
      replications: await getReplications(),
      wallets: await getWallets(),
    });
  }

  async function updateHealth() {
    setHealth(await getHealth());
  }

  async function updateCommitHash() {
    setCommitHash((await (await fetch('/api')).json()).commit_hash)
  }

  function dismissTooltip() {
    setAppTooltipState(0);
  }

  React.useEffect(() => {
    (async () => {
      setAuthTokenEphemeral(getCookie('auth'));

      try {
        if (!await checkAuth()) {
          throw new Error();
        }
      } catch {
        setAuthTokenEphemeral('');
        return;
      }
    })();
  }, []);

  React.useEffect(() => {
    if (authToken) {
      updateState();
      updateHealth();
      updateCommitHash();
    }
  }, [authToken]);

  if (!authToken) {
    return (
      <Auth
        authToken={authToken}
        setAuthToken={setAuthToken}
        setDDMAddress={setDDMAddress}
      ></Auth>
    )
  }

  return (
    <DefaultLayout apps={props.apps} onSwitchApp={props.onSwitchApp}>
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
        <AppNavItem onClick={e => setAppNavigationState(navigationStates.datasets)}>
          Datasets {appNavigationState === navigationStates.datasets && '➝'}
        </AppNavItem>
        <AppNavSubItem onClick={e => setAppTooltipState(tooltipStates.newDataset)}>
          + New dataset
        </AppNavSubItem>
        <AppNavItem onClick={e => setAppNavigationState(navigationStates.providers)}>
          Providers {appNavigationState === navigationStates.providers && '➝'}
        </AppNavItem>
        <AppNavSubItem onClick={e => setAppTooltipState(tooltipStates.addProvider)}>
          + Add provider
        </AppNavSubItem>
        <AppNavItem onClick={e => setAppNavigationState(navigationStates.replications)}>
          Replications {appNavigationState === navigationStates.replications && '➝'}
        </AppNavItem>
        <AppNavSubItem onClick={e => setAppTooltipState(tooltipStates.addReplication)}>
          + Add replication
        </AppNavSubItem>
        <AppNavItem onClick={e => setAppNavigationState(navigationStates.wallets)}>
          Wallets {appNavigationState === navigationStates.wallets && '➝'}
        </AppNavItem>
        <AppNavSubItem onClick={e => setAppTooltipState(tooltipStates.addWallet)}>
          + Add wallet
        </AppNavSubItem>
      </AppNav>
      <AppBody>
        {appNavigationState === navigationStates.datasets && (
          <Datasets
            search={datasetSearch}
            onSearchChange={(e) => setDatasetSearch(e.target.value)}
            searchLabel="Search datasets"
            placeholder="(example: university-bird-sounds)"
            state={state}
            onAttachContent={() => setAppTooltipState(tooltipStates.attachContent)}
            selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
          />
        )}
        {appNavigationState === navigationStates.providers && (
          <Providers
            search={providerSearch}
            onSearchChange={(e) => setProviderSearch(e.target.value)}
            providerLabel="Search providers"
            placeholder="(example: f0123456)"
            state={state}
            updateState={updateState}
          />
        )}
        {appNavigationState === navigationStates.replications && (
          <Replications
            search={replicationSearch}
            onSearchChange={e => setReplicationSearch(e.target.value)}
            searchLabel='Search replications'
            placeholder='search any field (replication filtering is w.i.p.)'
            selectedProvider={selectedProvider}
            setSelectedProvider={() => {
              alert('test');
            }}
            selectedDataset={selectedDataset}
            setSelectedDataset={() => { }}
            state={state}
          />
        )}
        {appNavigationState === navigationStates.wallets && (
          <Wallets
            state={state}
            updateState={updateState}
            onAssociateWallet={() => setAppTooltipState(tooltipStates.associateWallet)}
            setSelectedWallet={setSelectedWallet}
          />
        )}

        {appTooltipState === tooltipStates.newDataset && (
          <FormNewDataset
            onOutsideClick={dismissTooltip}
            updateState={updateState}
          />
        )}
        {appTooltipState === tooltipStates.addProvider && (
          <FormAddProvider
            onOutsideClick={dismissTooltip}
            updateState={updateState}
          />
        )}
        {appTooltipState === tooltipStates.addWallet && (
          <FormAddWallet
            onOutsideClick={dismissTooltip}
          />
        )}
        {appTooltipState === tooltipStates.attachContent && (
          <FormUploadData
            onOutsideClick={dismissTooltip}
            updateState={updateState}
            selectedDataset={selectedDataset}
          />
        )}
        {appTooltipState === tooltipStates.addReplication && (
          <FormAddReplication
            onOutsideClick={dismissTooltip}
            updateState={updateState}
            providers={state.providers}
            datasets={state.datasets}
          />
        )}
        {appTooltipState === tooltipStates.associateWallet && (
          <FormAssociateWallet
            onOutsideClick={dismissTooltip}
            selectedWallet={selectedWallet}
            state={state}
            updateState={updateState}
          />
        )}
      </AppBody>
    </DefaultLayout>
  )
}
