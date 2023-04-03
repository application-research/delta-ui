'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from './SceneProviders.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import ProviderRef from '@components/ProviderRef';
import { updateProvider } from '@root/data/api';
import Button from '../Button';

export default function SceneProviders(props) {
  return (
    <div className={styles.body}>
      <Input label={props.providerLabel} id="scene-provider-search" placeholder={props.placeholder} value={props.search} onChange={props.onSearchChange} />
      {props.state.providers &&
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            <span className={styles.columnProviderInfo}>Provider Info</span>
            <span className={styles.columnBytesReplicated}>Bytes Replicated (Padded)</span>
            <span className={styles.columnBytesReplicated}>Bytes Replicated (Raw)</span>
            <span className={styles.columnFlags}>Flags</span>
            <span className={styles.columnProviderKey}>Provider Key</span>
          </div>
          {props.state.providers
            .filter(
              (provider, i) => !props.search || provider.actor_id.includes(props.search)
            )
            .map(
              (provider, i) => {
                return <ProviderCard provider={provider} updateState={props.updateState} key={i} />
              }
            )
          }
        </div>
      }
      {props.state.providers === undefined && <LoadingIndicator padded />}
    </div>
  );
}

function ProviderCard(props) {
  let provider = props.provider;

  let [editing, setEditing] = React.useState(false);
  let [name, setName] = React.useState(provider.actor_name);
  let [allowSelfService, setAllowSelfService] = React.useState(provider.allow_self_service);
  let [saving, setSaving] = React.useState(false);

  function cancelEdit() {
    setAllowSelfService(provider.allow_self_service);
    setName(provider.actor_name);
    setEditing(false);
  }

  async function submitEdit() {
    setSaving(true);

    try {
      await updateProvider(provider.actor_id, name, allowSelfService);
    } catch (e) {
      alert('Saving provider failed: ' + e.toString());
      setSaving(false);
      return;
    }

    await props.updateState();

    setSaving(false);
    setEditing(false);
  }

  if (editing) return (
    <div className={tableStyles.row}>
      <span className={styles.columnProviderInfo}>
        <Input
          placeholder='unnamed'
          label={<span>Rename <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span></span>}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </span>
      <span className={styles.columnBytesReplicated}>
        <div>{Utilities.bytesToSize(provider.bytes_replicated.padded)}</div>
      </span>
      <span className={styles.columnBytesReplicated}>
        <div>{Utilities.bytesToSize(provider.bytes_replicated.raw)}</div>
      </span>
      <span className={styles.columnFlags}>
        <Input type='checkbox' label='Allow self service' checked={allowSelfService} onChange={e => setAllowSelfService(e.target.checked)} />
      </span>
      <span className={styles.columnProviderKey}><div className={styles.secret}>{provider.key}</div><div className={styles.copy}>copy</div></span>
      <span className={styles.columnButtonCancel} onClick={e => cancelEdit()}>Cancel Edit</span>
      <Button className={styles.columnButtonSave} onClick={e => submitEdit()} loading={saving}>
        <span>Save <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span></span>
      </Button>
    </div>
  );

  return (
    <div className={tableStyles.row}>
      <span className={styles.columnProviderInfo}>
        <div className={styles.providerName}>{provider.actor_name || 'unnamed'}</div>
        <ProviderRef providerID={provider.actor_id} />
      </span>
      <span className={styles.columnBytesReplicated}>
        <div>{Utilities.bytesToSize(provider.bytes_replicated.padded)}</div>
      </span>
      <span className={styles.columnBytesReplicated}>
        <div>{Utilities.bytesToSize(provider.bytes_replicated.raw)}</div>
      </span>
      <span className={styles.columnFlags}>
        <Input type='checkbox' label='Allow self service' checked={provider.allow_self_service} disabled />
      </span>
      <span className={styles.columnProviderKey}><ProviderKey providerKey={provider.key} /></span>
      <span className={styles.columnButtonManage} onClick={e => setEditing(true)}>
        <span>Manage <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span></span>
      </span>
    </div>
  );
}

function ProviderKey(props) {

  const [copied, setCopied] = React.useState(false);

  function copy() {
    navigator.clipboard.writeText(props.providerKey);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  }
  
  return (
    <span>
      <span className={styles.secret}>{props.providerKey}</span>
      <span className={styles.copy} onClick={copy}>{copied ? 'copied ✓' : 'copy' }</span>
    </span>
  );
}