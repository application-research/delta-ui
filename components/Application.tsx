'use client';

import styles from '@components/Application.module.scss';

import * as React from 'react';

import PackageJSON from '@root/package.json';
import DefaultLayout from '@components/DefaultLayout';

import SceneDatasets from '@components/SceneDatasets';
import SceneProviders from '@components/SceneProviders';
import SceneReplications from '@components/SceneReplications';
import SceneWallets from '@components/SceneWallets';

import FormUploadData from '@components/FormUploadData';
import FormAddWallet from '@components/FormAddWallet';
import FormAddProvider from '@components/FormAddProvider';

import { navigationStates, tooltipStates } from '@common/navigation';
import SceneAuth from '@components/SceneAuth';
import FormNewDataset from '@components/FormNewDataset';
import { getCookie, setCookie } from '@root/modules/cookies';
import { checkAuth, getDatasets, getProviders, getReplications } from '@root/data/api';
import FormAddReplication from './FormAddReplication';

export default function Application(props) {
  const [appNavigationState, setAppNavigationState] = React.useState(1);
  const [searchValue, setSearchChange] = React.useState('');
  const [providerValue, setProviderChange] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [selectedDataset, setSelectedDataset] = React.useState('');
  const [state, setState] = React.useState({ datasets: [], providers: [], replications: [] });
  const [appTooltipState, setAppTooltipState] = React.useState(0);
  const [authToken, setAuthTokenEphemeral] = React.useState('');
  const setAuthToken = authToken => {
    setAuthTokenEphemeral(authToken);
    setCookie('auth', authToken);
  }

  async function updateState() {
    setState({
      datasets: await getDatasets(),
      providers: await getProviders(),
      replications: await getReplications(),
    });
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
    }
  }, [authToken]);

  if (!authToken) {
    return (
      <SceneAuth
        authToken={authToken}
        setAuthToken={setAuthToken}
      ></SceneAuth>
    )
  }

  return (
    <DefaultLayout
      appTitle={PackageJSON.name}
      appVersion={PackageJSON.version}
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
          onSearchChange={(e) => setSearchChange(e.target.value)}
          searchValue={searchValue}
          searchLabel="Search your DDM"
          placeholder="(example: university-bird-sounds.zip)"
          state={state}
          onAttachContent={() => setAppTooltipState(tooltipStates.attachContent)}
          selectedDataset={selectedDataset}
          setSelectedDataset={setSelectedDataset}
        />
      )}
      {appNavigationState === navigationStates.providers && (
        <SceneProviders
          onProviderChange={(e) => setProviderChange(e.target.value)}
          providerChange={providerValue}
          providerLabel="Search your providers"
          placeholder="(example: f0123456)"
          state={state}
        />
      )}
      {appNavigationState === navigationStates.replications && (
        <SceneReplications
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
        <SceneWallets />
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
        <FormAddWallet onOutsideClick={dismissTooltip} />
      )}
      {appTooltipState === tooltipStates.attachContent && (
        <FormUploadData onOutsideClick={dismissTooltip} updateState={updateState} selectedDataset={selectedDataset} />
      )}
      {appTooltipState === tooltipStates.addReplication && (
        <FormAddReplication onOutsideClick={dismissTooltip} updateState={updateState} />
      )}
    </DefaultLayout>
  );
}
