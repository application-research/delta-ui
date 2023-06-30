'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';
import { updateProvider } from '@root/data/api';

import styles from '@ddm/providers/page.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import ProviderRef from '@components/ProviderRef';
import Button from '@components/Button';
import TagSelect from '@components/TagSelect';
import { DDMContext } from '@root/common/ddm';

export default function Providers() {
  const ctx = React.useContext(DDMContext);

  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    ctx.updateProviders();
  }, []);
  
  return (
    <div className={styles.body}>
      {ctx.providers && (
        <div className={tableStyles.body}>
          <Input
            labelClassName={tableStyles.searchLabel}
            inputClassName={tableStyles.searchInput}
            label={'Search providers'}
            id="scene-provider-search"
            placeholder={'(example: f0123456)'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={tableStyles.header}>
            <span className={styles.columnProviderInfo}>Provider Info</span>
            <span className={styles.columnBytesReplicated}>Bytes Replicated</span>
            <span className={styles.columnCountReplicated}>Count Replicated</span>
            <span className={styles.columnFlags}>Flags</span>
            <span className={styles.columnProviderKey}>Provider Key</span>
          </div>
          {ctx.providers
            .filter((provider, i) => !search || provider.actor_id.includes(search))
            .map((provider, i) => {
              return <ProviderCard provider={provider} key={i} />;
            })}
        </div>
      )}
      {ctx.providers === undefined && <LoadingIndicator padded />}
    </div>
  );
}

function ProviderCard(props: { provider: any }) {
  const ctx = React.useContext(DDMContext);
  
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
      setEditing(false);
    } catch (e) {
      alert('Saving provider failed: ' + e.toString());
      return;
    } finally {
      setSaving(false);
    }

    ctx.updateDatasets();
  }

  if (editing)
    return (
      <div className={tableStyles.row}>
        <span className={styles.columnProviderInfo}>
          <Input
            placeholder="unnamed"
            label={
              <span>
                Rename <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span>
              </span>
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </span>
        <span className={styles.columnBytesReplicated}>
          <div>{Utilities.bytesToSize(provider.bytes_replicated.padded)} (padded)</div>
          <div>{Utilities.bytesToSize(provider.bytes_replicated.raw)} (unpadded)</div>
        </span>
        <span className={styles.columnCountReplicated}>
          <div>{provider.count_replicated}</div>
        </span>
        <span className={styles.columnFlags}>
          <Input type="checkbox" label="Allow self service" checked={allowSelfService} onChange={(e) => setAllowSelfService(e.target.checked)} />
        </span>
        <span className={styles.columnProviderKey}>
          <ProviderKey providerKey={provider.key} />
        </span>
        <Button className={styles.columnButtonCancel} onClick={(e) => cancelEdit()} disabled={saving}>
          Cancel Edit
        </Button>
        <Button className={styles.columnButtonSave} onClick={(e) => submitEdit()} loading={saving}>
          <span>
            Save <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span>
          </span>
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
        <div>{Utilities.bytesToSize(provider.bytes_replicated.padded)} (padded)</div>
        <div>{Utilities.bytesToSize(provider.bytes_replicated.raw)} (unpadded)</div>
      </span>
      <span className={styles.columnCountReplicated}>
          <div>{provider.count_replicated}</div>
        </span>
      <span className={styles.columnFlags}>
        <Input type="checkbox" label="Allow self service" checked={provider.allow_self_service} disabled />
      </span>
      <span className={styles.columnProviderKey}>
        <ProviderKey providerKey={provider.key} />
      </span>
      <Button className={styles.columnButtonManage} onClick={(e) => setEditing(true)}>
        <span>
          Manage <span style={{ textTransform: 'lowercase' }}>{provider.actor_id}</span>
        </span>
      </Button>
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
      <span className={styles.copy} onClick={copy}>
        {copied ? 'copied ✓' : 'copy 📋'}
      </span>
    </span>
  );
}
