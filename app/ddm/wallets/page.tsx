'use client';

import styles from '@ddm/wallets/page.module.scss';
import tableStyles from '@components/Table.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';
import apiIndex from '@root/pages/api';
import { associateWallet } from '@root/data/api';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import WalletRef from '@components/WalletRef';
import TagSelect from '@components/TagSelect';
import Button from '@components/Button';
import { DDMContext } from '@root/common/ddm';

export default function Wallets() {
  const ctx = React.useContext(DDMContext);

  React.useEffect(() => {
    ctx.updateWallets();
  }, []);
  
  return (
    <div className={styles.body}>
      {ctx.wallets && (
        <div className={tableStyles.body}>
          <div className={tableStyles.header}>
            <span className={styles.columnAddress}>Address</span>
            <span className={tableStyles.column}>Filecoin Balance</span>
            <span className={tableStyles.column}>Datacap Balance</span>
            <span className={tableStyles.fluidColumn}>Datasets</span>
          </div>
          {ctx.wallets.map((wallet, i) => {
            return (
              <div key={i}>
                <WalletCard wallet={wallet} datasets={new Map(ctx.datasets?.map((dataset, i) => [dataset.ID, dataset.name]))} />
              </div>
            );
          })}
        </div>
      )}
      {ctx.walletsLoading && <LoadingIndicator padded />}
    </div>
  );
}

function WalletCard(props: { wallet: any, datasets: Map<number, string> }) {
  const ctx = React.useContext(DDMContext);
  
  let selectedDefault = () => props.wallet.datasets.map((dataset, i) => dataset.ID);

  const [selected, setSelected] = React.useState(selectedDefault());

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  function cancelEdit() {
    setEditing(false);

    setSelected(selectedDefault());
  }

  async function submitEdit() {
    setSaving(true);

    try {
      await associateWallet(props.wallet.address, selected);
      setEditing(false);
    } catch (e) {
      alert('Saving wallet failed: ' + e.toString());
      return;
    } finally {
      setSaving(false);
    }

    ctx.updateDatasets();
  }

  return (
    <div className={tableStyles.row}>
      <span className={styles.columnAddress}>
        <WalletRef address={props.wallet.address} />
      </span>
      <span className={tableStyles.column}>{props.wallet.balance.balance_filecoin / 1000000000000000000} FIL</span>
      <span className={tableStyles.column}>{Utilities.bytesToSize(props.wallet.balance.balance_datacap)}</span>
      <span className={tableStyles.fluidColumn}>
        <TagSelect disabled={!editing} options={props.datasets} selected={selected} setSelected={setSelected} />
      </span>
      {editing ? (
        <>
          <Button className={tableStyles.columnButtonCancel} onClick={(e) => cancelEdit()} disabled={saving}>
            Cancel
          </Button>
          <Button className={tableStyles.columnButtonSave} onClick={(e) => submitEdit()} loading={saving}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Button className={tableStyles.columnButtonManage} onClick={(e) => setEditing(true)}>
            Manage
          </Button>
        </>
      )}
    </div>
  );
}
