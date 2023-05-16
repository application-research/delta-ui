'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import styles from './Replications.module.scss';
import tableStyles from '@components/Table.module.scss';

import Input from '@components/basic/Input';
import LoadingIndicator from '@components/LoadingIndicator';
import ProviderRef from '@components/ProviderRef';
import Button from '@components/Button';
import { GetReplicationsConfig, updateProvider } from '@root/data/api';

export default function Replications(props: {
  replications: any,
  updateReplications: () => void,
  getReplicationsConfig: GetReplicationsConfig,
  setGetReplicationsConfig: (cfg: GetReplicationsConfig) => void,
}) {
  const [searchDatasets, setSearchDatasets] = React.useState('');
  const [searchProviders, setSearchProviders] = React.useState('');
  const [searchTimeMin, setSearchTimeMin] = React.useState('');
  const [searchTimeMax, setSearchTimeMax] = React.useState('');
  const [searchProposalCID, setSearchProposalCID] = React.useState('');
  const [searchPieceCID, setSearchPieceCID] = React.useState('');
  const [searchMessage, setSearchMessage] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const limit = 100;

  React.useEffect(() => {
    applySearch();
    props.updateReplications();
  }, [offset]);

  function applySearch() {
    props.setGetReplicationsConfig({
      offset: offset,
      limit: limit,
      datasets: searchDatasets.split(',').map((dataset) => dataset.trim()),
      providers: searchProviders.split(',').map((provider) => provider.trim()),
      timeMin: searchTimeMin && new Date(searchTimeMin),
      timeMax: searchTimeMax && new Date(searchTimeMax),
      proposalCID: searchProposalCID.trim(),
      pieceCID: searchPieceCID.trim(),
      message: searchMessage.trim(),
    });
    props.updateReplications();
  }

  return (
    <div className={styles.body}>
      {
        <div className={tableStyles.body}>
          <div className={styles.filterMenu}>
            <form className={styles.filterMenuBody} onClick={(e) => e.preventDefault()}>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Datasets (Comma-Separated)" placeholder="one-dataset,two-dataset" onChange={(e) => setSearchDatasets(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label="Providers (Comma-Separated)" placeholder="f012345,f067890" onChange={(e) => setSearchProviders(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Min." onChange={(e) => setSearchTimeMin(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Max." onChange={(e) => setSearchTimeMax(e.target.value)} />
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Proposal CID" autoComplete="disabled" spellCheck="false" onChange={(e) => setSearchProposalCID(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label="Piece CID" autoComplete="off" onChange={(e) => setSearchPieceCID(e.target.value)} />
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Message" onChange={(e) => setSearchMessage(e.target.value)} />
                </div>
                <div className={styles.filterMenuButtonColumn}>
                  <Button onClick={applySearch}>Apply</Button>
                </div>
              </div>
            </form>
          </div>
          <div className={tableStyles.header}>
            <div className={tableStyles.column}>Dataset</div>
            <div className={tableStyles.column}>Status</div>
            <div className={tableStyles.column}>Provider ID</div>
            <div className={tableStyles.column}>Self Service</div>
            <div className={tableStyles.fluidColumn}>Deal Time</div>
            <div className={tableStyles.fluidColumn}>Proposal CID</div>
            <div className={tableStyles.fluidColumn}>Piece CID (CommP)</div>
            <div className={tableStyles.fluidColumn}>Message</div>
          </div>
          {props.replications?.data?.map((replication, i) => {
            return (
              <div key={i}>
                <div className={tableStyles.row}>
                  <div className={tableStyles.column}>{replication.content.dataset_name}</div>
                  <div className={tableStyles.column}>{replication.status}</div>
                  <div className={tableStyles.column}>
                    <ProviderRef providerID={replication.provider_actor_id} />
                  </div>
                  <div className={tableStyles.column}>{replication.is_self_service ? 'true' : 'false'}</div>
                  <div className={tableStyles.fluidColumn}>{new Date(Date.parse(replication.deal_time)).toUTCString()}</div>
                  <div className={tableStyles.fluidColumn}>{replication.proposal_cid}</div>
                  <div className={tableStyles.fluidColumn}>{replication.content_commp}</div>
                  <div className={tableStyles.fluidColumn}>{replication.delta_message}</div>
                </div>
              </div>
            );
          })}
        </div>
      }
      <PageIndex
        offset={offset}
        onChangeOffset={(offset) => {
          setOffset(offset);
        }}
        limit={limit}
        total={props.replications?.totalCount}
      />
      {props.replications === undefined && <LoadingIndicator padded />}
    </div>
  );
}

function PageIndex(props: { offset: number, onChangeOffset: (number) => void, limit: number, total: number }) {
  const pageCount = Math.ceil(props.total / props.limit);
  const currPage = Math.floor(props.offset / props.limit);

  const itemCount = Math.min(props.limit, props.total - props.offset);
  const firstItem = props.offset + 1;
  const lastItem = props.offset + itemCount;

  return (
    <div className={styles.pageIndex}>
      <span>
        Showing {firstItem} - {lastItem} of {props.total} results
      </span>
      <span className={styles.indexButton} onClick={(e) => props.onChangeOffset(0)}>
        &lt;&lt;
      </span>
      {...Array(pageCount || 1)
        .fill(0)
        .map((_, i) => (
          <span className={i == currPage ? styles.indexButtonActive : styles.indexButton} onClick={(e) => props.onChangeOffset(i * props.limit)}>
            {i + 1}
          </span>
        ))}
      <span className={styles.indexButton} onClick={(e) => props.onChangeOffset((pageCount - 1) * props.limit)}>
        &gt;&gt;
      </span>
    </div>
  );
}
