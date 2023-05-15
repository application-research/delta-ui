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
  const [datasets, setDatasets] = React.useState([]);
  const [providers, setProviders] = React.useState([]);
  const [replications, setReplications] = React.useState([]);
  const [wallets, setWallets] = React.useState([]);
  const [health, setHealth] = React.useState(undefined);
  const [commitHash, setCommitHash] = React.useState(undefined);
  const [appTooltipState, setAppTooltipState] = React.useState(0);
  const [authToken, setAuthTokenEphemeral] = React.useState('');
  const setAuthToken = (authToken) => {
    setAuthTokenEphemeral(authToken);
    setCookie('auth', authToken);
  };
  const setDDMAddress = (ddmAddress) => {
    setCookie('ddm-address', ddmAddress);
  };

  const getReplicationsConfig = React.useRef<GetReplicationsConfig>();
  const setGetReplicationsConfig = (cfg: GetReplicationsConfig) => getReplicationsConfig.current = cfg;

  const updateDatasets = async () => setDatasets(await getDatasets());
  const updateProviders = async () => setProviders(await getProviders());
  const updateReplications = async () => setReplications(await getReplications(getReplicationsConfig.current));
  const updateWallets = async () => setWallets(await getWallets());

  const newDatasetButton = React.useRef(null);
  const addProviderButton = React.useRef(null);
  const addReplicationButton = React.useRef(null);
  const addWalletButton = React.useRef(null);

  async function updateHealth() {
    setHealth(await getHealth());
  }

  async function updateCommitHash() {
    setCommitHash((await (await fetch('/api')).json()).commit_hash);
  }

  function dismissTooltip(id) {
    console.log('closing ' + id + ', currently active ' + appTooltipState);
    if (appTooltipState === id) {
      setAppTooltipState(0);
    }
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
      updateReplications();
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
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.newDataset)}>
          <span ref={newDatasetButton}>+ New dataset</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.providers)}>Providers {appNavigationState === navigationStates.providers && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addProvider)}>
          <span ref={addProviderButton}>+ Add provider</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.replications)}>Replications {appNavigationState === navigationStates.replications && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addReplication)}>
          <span ref={addReplicationButton}>+ Add replication</span>
        </AppNavSubItem>
        <AppNavItem onClick={(e) => setAppNavigationState(navigationStates.wallets)}>Wallets {appNavigationState === navigationStates.wallets && '➝'}</AppNavItem>
        <AppNavSubItem onClick={(e) => setAppTooltipState(tooltipStates.addWallet)}>
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
            onAttachContent={() => setAppTooltipState(tooltipStates.attachContent)}
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
        {appNavigationState === navigationStates.replications && <Replications replications={replications} updateReplications={updateReplications} setGetReplicationsConfig={setGetReplicationsConfig} />}
        {appNavigationState === navigationStates.wallets && (
          <Wallets
            wallets={wallets}
            updateWallets={updateWallets}
            datasets={datasets}
            updateDatasets={updateDatasets}
            // setSelectedWallet={setSelectedWallet}
          />
        )}

        {appTooltipState === tooltipStates.newDataset && (
          <Modal anchor={newDatasetButton} modalID={tooltipStates.newDataset} onClose={dismissTooltip}>
            <FormNewDataset updateDatasets={updateDatasets} />
          </Modal>
        )}
        {appTooltipState === tooltipStates.addProvider && (
          <Modal anchor={addProviderButton} modalID={tooltipStates.addProvider} onClose={dismissTooltip}>
            <FormAddProvider updateProviders={updateProviders} />
          </Modal>
        )}
        {appTooltipState === tooltipStates.addWallet && (
          <Modal anchor={addWalletButton} modalID={tooltipStates.addWallet} onClose={dismissTooltip}>
            <FormAddWallet onOutsideClick={dismissTooltip} />
          </Modal>
        )}
        {appTooltipState === tooltipStates.attachContent && <FormUploadData onOutsideClick={dismissTooltip} updateDatasets={updateDatasets} selectedDataset={selectedDataset} />}
        {appTooltipState === tooltipStates.addReplication && (
          <Modal anchor={addReplicationButton} modalID={tooltipStates.addReplication} onClose={dismissTooltip}>
            <FormAddReplication providers={providers} datasets={datasets} updateReplications={updateReplications} />
          </Modal>
        )}
      </AppBody>
    </DefaultLayout>
  );
}
