import { getDatasets, getProviders, getReplicationProfiles, getReplications, GetReplicationsConfig, getWallets } from '@root/data/api';
import React from 'react';

let limit;
if (typeof window !== 'undefined') {
  limit = localStorage.getItem('settings.replications.limit');
}

export function CreateDDMState() {
  const [getReplicationsConfig, setGetReplicationsConfig] = React.useState({ limit: limit || 10 } as GetReplicationsConfig);
  const [datasets, setDatasets] = React.useState(null);
  const [datasetsLoading, setDatasetsLoading] = React.useState(false);
  const [providers, setProviders] = React.useState(null);
  const [providersLoading, setProvidersLoading] = React.useState(false);
  const [replicationProfiles, setReplicationProfiles] = React.useState(null);
  const [replicationProfilesLoading, setReplicationProfilesLoading] = React.useState(false);
  const [replications, setReplications] = React.useState(null);
  const [replicationsLoading, setReplicationsLoading] = React.useState(false);
  const [wallets, setWallets] = React.useState(null);
  const [walletsLoading, setWalletsLoading] = React.useState(false);
  const [tooltipState, setTooltipState] = React.useState(null);
  const [selectedDataset, setSelectedDataset] = React.useState(null);

  return {
    getReplicationsConfig,
    setGetReplicationsConfig,
    datasets,
    datasetsLoading,
    providers,
    providersLoading,
    replicationProfiles,
    replicationProfilesLoading,
    replications,
    replicationsLoading,
    wallets,
    tooltipState,
    setTooltipState,
    selectedDataset,
    setSelectedDataset,
    async updateDatasets() {
      setDatasetsLoading(true);
      setDatasets(await getDatasets());
      setDatasetsLoading(false);
    },
    async updateProviders() {
      setProvidersLoading(true);
      setProviders(await getProviders());
      setProvidersLoading(false);
    },
    async updateReplicationProfiles() {
      setReplicationProfilesLoading(true);
      setReplicationProfiles(await getReplicationProfiles());
      setReplicationProfilesLoading(false);
    },
    async updateReplications() {
      setReplicationsLoading(true);
      setReplications(await getReplications(this.getReplicationsConfig));
      setReplicationsLoading(false);
    },
    async updateWallets() {
      setWalletsLoading(true);
      setWallets(await getWallets());
      setWalletsLoading(false);
    },
  };
}

export const DDMContext = React.createContext(null);

export const tooltipStates = {
  newDataset: 1,
  attachContent: 2,
  addProvider: 3,
  addWallet: 4,
  addReplicationProfile: 5,
  addReplication: 6,
  associateWallet: 7,
  setPreferences: 8,
};

export function loadAuth(): string {
  return localStorage.getItem('auth');
}

export function saveAuth(val: string) {
  localStorage.setItem('auth', val);
}

export function loadDDMAddress(): string {
  return localStorage.getItem('ddmAddress');
}

export function saveDDMAddress(val: string) {
  localStorage.setItem('ddmAddress', val);
}
