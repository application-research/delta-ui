import { getDatasets, getProviders, getReplicationProfiles, getReplications, GetReplicationsConfig, getWallets } from '@root/data/api';
import React from 'react';

let limit;
if (typeof window !== 'undefined') {
  limit = localStorage.getItem('settings.replications.limit');
}

export function CreateDDMState() {
  const [getReplicationsConfig, setGetReplicationsConfig] = React.useState({ limit: limit || 10 } as GetReplicationsConfig);
  const [datasets, setDatasets] = React.useState(null);
  const [providers, setProviders] = React.useState(null);
  const [replicationProfiles, setReplicationProfiles] = React.useState(null);
  const [replications, setReplications] = React.useState(null);
  const [wallets, setWallets] = React.useState(null);
  const [tooltipState, setTooltipState] = React.useState(null);
  const [selectedDataset, setSelectedDataset] = React.useState(null);

  return {
    getReplicationsConfig,
    setGetReplicationsConfig,
    datasets,
    providers,
    replicationProfiles,
    replications,
    wallets,
    tooltipState,
    setTooltipState,
    selectedDataset,
    setSelectedDataset,
    async updateDatasets() {
      // setDatasets(undefined);
      setDatasets(await getDatasets());
    },
    async updateProviders() {
      // setProviders(undefined);
      setProviders(await getProviders());
    },
    async updateReplicationProfiles() {
      // setReplicationProfiles(undefined);
      setReplicationProfiles(await getReplicationProfiles());
    },
    async updateReplications() {
      // setReplications(undefined);
      setReplications(await getReplications(this.getReplicationsConfig));
    },
    async updateWallets() {
      // setWallets(undefined);
      setWallets(await getWallets());
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
