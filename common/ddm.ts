import { AuthError, getDatasets, getProviders, getReplicationProfiles, getReplications, GetReplicationsConfig, getWallets } from '@root/data/api';
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
  const tooltipAnchor = React.useRef(null);
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  
  // Should get set to true if any function fails with an auth error. If this
  // becomes true while any page other than that auth page is loaded, user will
  // be redirected to the auth page.
  const [unauthorized, setUnauthorized] = React.useState(false);

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
    tooltipAnchor,
    selectedDataset,
    setSelectedDataset,
    unauthorized,
    setUnauthorized,
    async updateDatasets() {
      try {
        setDatasets(await getDatasets());
      } catch (e) {
        this.setUnauthorized(true);
      }
    },
    async updateProviders() {
      try {
        setProviders(await getProviders());
      } catch (e) {
        this.setUnauthorized(true);
      }
    },
    async updateReplicationProfiles() {
      try {
        setReplicationProfiles(await getReplicationProfiles());
      } catch (e) {
        this.setUnauthorized(true);
      }
    },
    async updateReplications() {
      try {
        setReplications(await getReplications(this.getReplicationsConfig));
      } catch (e) {
        this.setUnauthorized(true);
      }
    },
    async updateWallets() {
      try {
        setWallets(await getWallets());
      } catch (e) {
        this.setUnauthorized(true);
      }
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
