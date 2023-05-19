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
import Select from '@root/components/basic/Select';

export default function Replications(props: {
  replications: any,
  updateReplications: () => void,
  getReplicationsConfig: GetReplicationsConfig,
  setGetReplicationsConfig: (cfg: GetReplicationsConfig) => void,
}) {
  const [searchDatasets, setSearchDatasets] = React.useState('');
  const [searchProviders, setSearchProviders] = React.useState('');
  const [searchTimeStart, setSearchTimeStart] = React.useState('');
  const [searchTimeEnd, setSearchTimeEnd] = React.useState('');
  const [searchSelfService, setSearchSelfService] = React.useState('');
  const [searchProposalCID, setSearchProposalCID] = React.useState('');
  const [searchPieceCID, setSearchPieceCID] = React.useState('');
  const [searchMessage, setSearchMessage] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [refreshTrigger, setRefreshTrigger] = React.useState(false);

  
  const limit = 100;
  
  function refresh() {
    setRefreshTrigger(val => !val);
  }

  React.useEffect(() => {
    props.updateReplications();
  }, [JSON.stringify(props.getReplicationsConfig), offset, refreshTrigger]);

  React.useEffect(() => applySearch(), []);
  
  function applySearch() {
    setOffset(0);
    props.setGetReplicationsConfig({
      offset: offset,
      limit: limit,
      datasets: searchDatasets.split(',').map((dataset) => dataset.trim()),
      providers: searchProviders.split(',').map((provider) => provider.trim()),
      timeStart: searchTimeStart && new Date(searchTimeStart),
      timeEnd: searchTimeEnd && new Date(searchTimeEnd),
      selfService: searchSelfService === 'true' ? true : searchSelfService === 'false' ? false : undefined,
      proposalCID: searchProposalCID.trim(),
      pieceCID: searchPieceCID.trim(),
      message: searchMessage.trim(),
    });
    refresh();
  }

  function resetSearch() {
    setSearchDatasets('');
    setSearchProviders('');
    setSearchTimeStart('');
    setSearchTimeEnd('');
    setSearchSelfService('');
    setSearchProposalCID('');
    setSearchPieceCID('');
    setSearchMessage('');

    props.setGetReplicationsConfig(null);
  }

  return (
    <div className={styles.body}>
      {
        <div className={tableStyles.body}>
          <div className={styles.filterMenu}>
            <form className={styles.filterMenuBody} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Datasets (Comma-Separated)" placeholder="one-dataset, two-dataset" value={searchDatasets} onChange={(e) => setSearchDatasets(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label="Providers (Comma-Separated)" placeholder="f012345, f067890" value={searchProviders} onChange={(e) => setSearchProviders(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Min." value={searchTimeStart} onChange={(e) => setSearchTimeStart(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Max." value={searchTimeEnd} onChange={(e) => setSearchTimeEnd(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Select label="Self-Service" value={searchSelfService} onChange={(e) => setSearchSelfService(e.target.value)}>
                    <option value="">Any</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Proposal CID" autoComplete="disabled" spellCheck="false" value={searchProposalCID} onChange={(e) => setSearchProposalCID(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label="Piece CID" autoComplete="off" value={searchPieceCID} onChange={(e) => setSearchPieceCID(e.target.value)} />
                </div>
              </div>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Message" value={searchMessage} onChange={(e) => setSearchMessage(e.target.value)} />
                </div>
                <div className={styles.filterMenuButtonColumn}>
                  <Button onClick={resetSearch}>Reset</Button>
                </div>
                <div className={styles.filterMenuButtonColumn}>
                  <Button onClick={applySearch} primary>Apply</Button>
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

  if (!props.total) {
    return (
      <div className={styles.pageIndex}>
        <span>No results</span>
      </div>
    );
  }

  return (
    <div className={styles.pageIndex}>
      <span>
        Showing {firstItem} - {lastItem} of {props.total} results
      </span>
      <span className={styles.indexButton} onClick={(e) => props.onChangeOffset(0)}>
        &lt;&lt;
      </span>
      {...Array(pageCount)
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
