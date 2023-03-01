'use client';

import styles from '@components/Application.module.scss';

import * as React from 'react';

import PackageJSON from '@root/package.json';
import DefaultLayout from '@components/DefaultLayout';

import SceneDatasets from '@components/SceneDatasets';
import SceneProviders from '@components/SceneProviders';
import SceneReplications from '@components/SceneReplications';

import FormUploadData from '@components/FormUploadData';

export default function Application(props) {
  const [appNavigationState, setAppNavigationState] = React.useState(1);
  const [searchValue, setSearchChange] = React.useState('');
  const [providerValue, setProviderChange] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [selectedData, setSelectedData] = React.useState('');
  const [state, setState] = React.useState({ data: [], providers: [], replications: [] });
  const [appTooltipState, setTooltipState] = React.useState(0);

  React.useEffect(() => {
    // TODO(alvin, json, cake):
    // You can insert the hydration point here, and all page updates here.
    // You could use websockets, or something else, whatever you desire.
    async function init() {
      const response = await fetch('/api');
      const json = await response.json();

      console.log(json);
      setState({ data: [...json.response.data], providers: [...json.response.providers], replications: [...json.response.replications] });
    }

    init();
  }, []);

  return (
    <DefaultLayout
      appTitle={PackageJSON.name}
      appVersion={PackageJSON.version}
      appNavigationState={appNavigationState}
      onClickDatasets={() => setAppNavigationState(1)}
      onClickProviders={() => setAppNavigationState(2)}
      onClickReplications={() => setAppNavigationState(3)}
      onUploadData={() => setTooltipState(appTooltipState !== 1 ? 1 : 0)}
      onImportData={() => alert('work in progress')}
      onAddProviders={() => alert('work in progress')}
    >
      {appNavigationState === 1 ? (
        <SceneDatasets
          onSearchChange={(e) => setSearchChange(e.target.value)}
          searchValue={searchValue}
          searchLabel="Search your DDM"
          placeholder="(example: university-bird-sounds.zip)"
          state={state}
        />
      ) : null}
      {appNavigationState === 2 ? (
        <SceneProviders
          onProviderChange={(e) => setProviderChange(e.target.value)}
          providerChange={providerValue}
          providerLabel="Search your providers"
          placeholder="(example: f0123456)"
          state={state}
        />
      ) : null}
      {appNavigationState === 3 ? (
        <SceneReplications
          selectedProvider={selectedProvider}
          setSelectedProvider={() => {
            alert('test');
          }}
          selectedData={selectedData}
          setSelectedData={() => {}}
          state={state}
        />
      ) : null}
      {appTooltipState === 1 ? <FormUploadData /> : null}
    </DefaultLayout>
  );
}
