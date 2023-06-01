'use client';

import * as React from 'react';
import PackageJSON from '@root/package.json';
import { navigationStates, tooltipStates } from '@common/navigation';
import { getCookie, setCookie } from '@modules/cookies';
import { associateWallet, checkAuth, getDatasets, getHealth, getProviders, getReplications, GetReplicationsConfig, getWallets } from '@data/api';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';
import Modal from '@root/components/Modal';

import Datasets from '@root/components/apps/ddm/scenes/Datasets';
import Providers from '@root/components/apps/ddm/scenes/Providers';
import Replications from '@root/components/apps/ddm/scenes/Replications';
import Wallets from '@components/apps/ddm/scenes/Wallets';
import Auth from '@root/components/apps/ddm/scenes/Auth';

import FormUploadData from '@root/components/apps/ddm/forms/FormUploadData';
import FormAddWallet from '@root/components/apps/ddm/forms/FormAddWallet';
import FormAddProvider from '@root/components/apps/ddm/forms/FormAddProvider';
import FormAddReplication from '@root/components/apps/ddm/forms/FormAddReplication';
import FormNewDataset from '@root/components/apps/ddm/forms/FormNewDataset';

export default function DDM(props) {
  const [appNavigationState, setAppNavigationState] = React.useState(1);
  const [datasetSearch, setDatasetSearch] = React.useState('');
  const [providerSearch, setProviderSearch] = React.useState('');
  const [replicationSearch, setReplicationSearch] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [selectedDataset, setSelectedDataset] = React.useState('');
  const [selectedWallet, setSelectedWallet] = React.useState('');
  const [datasets, setDatasets] = React.useState(undefined);
  const [providers, setProviders] = React.useState(undefined);
  const [replications, setReplications] = React.useState(undefined);
  const [wallets, setWallets] = React.useState(undefined);
  const [health, setHealth] = React.useState(undefined);
  const [commitHash, setCommitHash] = React.useState(undefined);
  const [appTooltipID, setAppTooltipID] = React.useState(0);
  const [authToken, setAuthTokenEphemeral] = React.useState('');
  const setAuthToken = (authToken) => {
    setAuthTokenEphemeral(authToken);
    setCookie('auth', authToken);
  };
  const setDDMAddress = (ddmAddress) => {
    setCookie('ddm-address', ddmAddress);
  };

  let limit;
  if (typeof window !== 'undefined') {
    limit = localStorage.getItem('settings.replications.limit')
  }

  const [getReplicationsConfig, setGetReplicationsConfig] = React.useState({ limit: limit || 10 } as GetReplicationsConfig);

  const updateDatasets = async () => { setDatasets(undefined); setDatasets(await getDatasets()) };
  const updateProviders = async () => { setProviders(undefined); setProviders(await getProviders()) };
  const updateReplications = async () => { setReplications(undefined); setReplications(await getReplications(getReplicationsConfig)) };
  const updateWallets = async () => { setWallets(undefined); setWallets(await getWallets()) };

  const newDatasetButton = React.useRef(null);
  const addProviderButton = React.useRef(null);
  const addReplicationButton = React.useRef(null);
  const addWalletButton = React.useRef(null);
  
  const anchor = React.useRef(null);
  function setAppTooltipState(newID: any, newAnchor: React.ReactHTMLElement<any>) {
    anchor.current = newAnchor;
    setAppTooltipID(newID);
  }

  async function updateHealth() {
    setHealth(await getHealth());
  }

  async function updateCommitHash() {
    setCommitHash((await (await fetch('/api')).json()).commit_hash);
  }

  function dismissTooltip(id) {
    setAppTooltipID((prev) => (prev === id ? 0 : prev));
  }

  React.useEffect(() => {
    (async () => {
      setAuthTokenEphemeral(getCookie('auth'));

      try {
        if (!(await checkAuth())) {
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
      updateDatasets();
      updateProviders();
      // updateReplications();
      updateWallets();

      updateHealth();
      updateCommitHash();
    }
  }, [authToken]);

  if (!authToken) {
    return <Auth authToken={authToken} setAuthToken={setAuthToken} setDDMAddress={setDDMAddress}></Auth>;
  }

  return (
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
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.datasets)}>Datasets {appNavigationState === navigationStates.datasets && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.newDataset, newDatasetButton.current)}>
          <span ref={newDatasetButton}>+ New dataset</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.providers)}>Providers {appNavigationState === navigationStates.providers && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addProvider, addProviderButton.current)}>
          <span ref={addProviderButton}>+ Add provider</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.replications)}>Replications {appNavigationState === navigationStates.replications && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addReplication, addReplicationButton.current)}>
          <span ref={addReplicationButton}>+ Add replication</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.wallets)}>Wallets {appNavigationState === navigationStates.wallets && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addWallet, addWalletButton.current)}>
          <span ref={addWalletButton}>+ Add wallet</span>
        </AppNavSubItem>
      </AppNav>
      <AppBody>
        {appNavigationState === navigationStates.datasets && (
          <Datasets
            search={datasetSearch}
            onSearchChange={(e) => setDatasetSearch(e.target.value)}
            searchLabel="Search datasets"
            placeholder="(example: university-bird-sounds)"
            datasets={datasets}
            onAttachContent={(anchor) => setAppTooltipState(tooltipStates.attachContent, anchor)}
            // selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
          />
        )}
        {appNavigationState === navigationStates.providers && (
          <Providers
            providers={providers}
            datasets={datasets}
            updateDatasets={updateDatasets}
            search={providerSearch}
            onSearchChange={(e) => setProviderSearch(e.target.value)}
            providerLabel="Search providers"
            placeholder="(example: f0123456)"
          />
        )}
        {appNavigationState === navigationStates.replications && (
          <Replications
            replications={replications}
            updateReplications={updateReplications}
            getReplicationsConfig={getReplicationsConfig}
            setGetReplicationsConfig={setGetReplicationsConfig}
          />
        )}
        {appNavigationState === navigationStates.wallets && (
          <Wallets
            wallets={wallets}
            updateWallets={updateWallets}
            datasets={datasets}
            updateDatasets={updateDatasets}
            // setSelectedWallet={setSelectedWallet}
          />
        )}

        {appTooltipID === tooltipStates.newDataset && (
          <Modal anchor={anchor} modalID={tooltipStates.newDataset} onClose={dismissTooltip}>
            <FormNewDataset updateDatasets={updateDatasets} />
          </Modal>
        )}
        {appTooltipID === tooltipStates.addProvider && (
          <Modal anchor={anchor} modalID={tooltipStates.addProvider} onClose={dismissTooltip}>
            <FormAddProvider updateProviders={updateProviders} />
          </Modal>
        )}
        {appTooltipID === tooltipStates.addWallet && (
          <Modal anchor={anchor} modalID={tooltipStates.addWallet} onClose={dismissTooltip}>
            <FormAddWallet onOutsideClick={dismissTooltip} />
          </Modal>
        )}
        {appTooltipID === tooltipStates.attachContent && (
          <Modal anchor={anchor} modalID={tooltipStates.attachContent} onClose={dismissTooltip}>
            <FormUploadData updateDatasets={updateDatasets} selectedDataset={selectedDataset} />
          </Modal>
        )}
        {appTooltipID === tooltipStates.addReplication && (
          <Modal anchor={anchor} modalID={tooltipStates.addReplication} onClose={dismissTooltip}>
            <FormAddReplication providers={providers} datasets={datasets} updateReplications={updateReplications} />
          </Modal>
        )}
      </AppBody>
    </DefaultLayout>
  );
}
