'use client';

import * as React from 'react';
import PackageJSON from '@root/package.json';
import { navigationStates, tooltipStates } from '@common/navigation';
import { getCookie, setCookie } from '@modules/cookies';
import { associateWallet, checkAuth, getDatasets, getHealth, getProviders, getReplications, getWallets } from '@data/api';

import styles from '@components/Application.module.scss';

import DefaultLayout from '@components/DefaultLayout';

import SceneDatasets from '@components/scenes/SceneDatasets';
import SceneProviders from '@components/scenes/SceneProviders';
import SceneReplications from '@components/scenes/SceneReplications';
import SceneWallets from '@components/scenes/SceneWallets';
import SceneAuth from '@components/scenes/SceneAuth';

import FormUploadData from '@components/forms/FormUploadData';
import FormAddWallet from '@components/forms/FormAddWallet';
import FormAddProvider from '@components/forms/FormAddProvider';
import FormAddReplication from '@components/forms/FormAddReplication';
import FormNewDataset from '@components/forms/FormNewDataset';
import FormAssociateWallet from '@components/forms/FormAssociateWallet';


export default function Application(props) {
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
    })()
  }, []);

  React.useEffect(() => {
    if (authToken) {
      updateState();
      updateHealth();
    }
  }, [authToken]);

  if (!authToken) {
    return (
      <SceneAuth
        authToken={authToken}
        setAuthToken={setAuthToken}
        setDDMAddress={setDDMAddress}
      ></SceneAuth>
    )
  }

  return (
    <DefaultLayout
      appTitle={'Delta DM'}
      appVersion={
        `UUID: ${health?.uuid || 'not set'} | DDM Version: ${health?.ddm_info.version} (${health?.ddm_info.commit}) | Delta Version: ${health?.delta_info.version} (${health?.delta_info.commit})`
      }
      appNavigationState={appNavigationState}
      appTooltipState={appTooltipState}
      onClickDatasets={() => setAppNavigationState(navigationStates.datasets)}
      onClickProviders={() => setAppNavigationState(navigationStates.providers)}
      onClickReplications={() => setAppNavigationState(navigationStates.replications)}
      onNewDataset={() => setAppTooltipState(tooltipStates.newDataset)}
      onAddProviders={() => setAppTooltipState(tooltipStates.addProvider)}
      onAddReplication={() => setAppTooltipState(tooltipStates.addReplication)}
      onClickWallets={() => setAppNavigationState(navigationStates.wallets)}
      onAddWallet={() => setAppTooltipState(tooltipStates.addWallet)}
    >
      {appNavigationState === navigationStates.datasets && (
        <SceneDatasets
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
        <SceneProviders
          search={providerSearch}
          onSearchChange={(e) => setProviderSearch(e.target.value)}
          providerLabel="Search your providers"
          placeholder="(example: f0123456)"
          state={state}
          updateState={updateState}
        />
      )}
      {appNavigationState === navigationStates.replications && (
        <SceneReplications
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
        <SceneWallets
          state={state}
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
    </DefaultLayout>
  );
}
