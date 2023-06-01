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
  
  const [refreshTrigger, setRefreshTrigger] = React.useState(false);
  const cfg = React.useRef(props.getReplicationsConfig);
  
  function setSearchDatasets(val: string) { 
    cfg.current.datasets = val.split(',').map((dataset) => dataset.trim());
  }
  function setSearchProviders(val: string) {
    cfg.current.providers = val.split(',').map((provider) => provider.trim());
  }
  function setSearchTimeStart(val: string) {
    cfg.current.timeStart = val && new Date(val);
  }
  function setSearchTimeEnd(val: string) {
    cfg.current.timeEnd = val && new Date(val);
  }
  function setSearchSelfService(val: string) {
    cfg.current.selfService = val === 'true' ? true : val === 'false' ? false : undefined;
  }
  function setSearchProposalCID(val: string) {
    cfg.current.proposalCID = val.trim();
  }
  function setSearchPieceCID(val: string) {
    cfg.current.pieceCID = val.trim();
  } 
  function setSearchMessage(val: string) {
    cfg.current.message = val.trim();
  }
  function setSearchOffset(offset: number) {
    cfg.current.offset = offset;
    applySearch();
  }
  function setSearchLimit(limit: number) {
    cfg.current.limit = limit;
    localStorage.setItem("settings.replications.limit", limit.toString())
    applySearch();
  }

  let formRef = React.useRef();
  
  function refresh() {
    setRefreshTrigger(val => !val);
  }
  
  React.useEffect(() => {
    applySearch();
  }, []);
  React.useEffect(() => {
    props.updateReplications();
    console.log(props.getReplicationsConfig);
  }, [JSON.stringify(props.getReplicationsConfig), refreshTrigger]);
  
  function applySearch() {
    props.setGetReplicationsConfig(cfg.current);
    refresh();
  }

  function resetSearch() {
    (formRef.current as HTMLFormElement)?.reset();
    cfg.current = {
      limit: cfg.current.limit,
      offset: 0,
    } as GetReplicationsConfig;
    applySearch();
  }

  function onSubmit(e) {
    cfg.current.offset = 0;
    e.preventDefault();
    applySearch();
  }

  return (
    <div className={styles.body}>
      {
        <div className={tableStyles.body}>
          <div className={styles.filterMenu}>
            <form className={styles.filterMenuBody} ref={formRef} onSubmit={onSubmit}>
              <div className={styles.filterMenuRow}>
                <div className={styles.filterMenuColumn}>
                  <Input label="Datasets (Comma-Separated)" placeholder="one-dataset, two-dataset" onChange={(e) => setSearchDatasets(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input label="Providers (Comma-Separated)" placeholder="f012345, f067890" onChange={(e) => setSearchProviders(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Min." onChange={(e) => setSearchTimeStart(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Input type="datetime-local" label="Deal Time Max." onChange={(e) => setSearchTimeEnd(e.target.value)} />
                </div>
                <div className={styles.filterMenuColumn}>
                  <Select label="Self-Service" onChange={(e) => setSearchSelfService(e.target.value)}>
                    <option value="">Any</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
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
                  <Button type='reset' onClick={resetSearch}>Reset</Button>
                </div>
                <div className={styles.filterMenuButtonColumn}>
                  <Button type='submit' primary>Apply</Button>
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

      {props.replications !== undefined && <PageIndex
        offset={props.getReplicationsConfig.offset || 0}
        onChangeOffset={(offset) => {
          setSearchOffset(offset);
        }}
        onSearchLimit={(limit) => {
          setSearchLimit(limit);
        }}
        limit={props.getReplicationsConfig.limit || 100}
        total={props.replications?.totalCount || 0}
        />}
      {props.replications === undefined && <LoadingIndicator padded />}
    </div>
  );
}

function PageIndex(props: { offset: number, onChangeOffset: (number) => void, onSearchLimit: (number) => void, limit: number, total: number }) {
  const pageCount = Math.ceil(props.total / props.limit);
  let currPage = Math.floor(props.offset / props.limit);

  const limitOptions = [100, 50, 25, 10]

  const onGoTo = (e) => {
    if (e.key == 'Enter') {
      const page = e.currentTarget.value > pageCount ? pageCount -1 : e.currentTarget.value -1;
      props.onChangeOffset(page * props.limit)
    }
  }

  if (props.total === null) {
    return (
      <div className={styles.pageIndex}>
        <span>No results</span>
      </div>
    );
  }

  return (
    <div className={styles.pageIndex}>
      <div className={styles.indexItems}>
        <span className={currPage == 0 ? styles.indexButtonDisable : styles.indexButton} onClick={(e) => props.onChangeOffset(--currPage * props.limit)}>
          &lt;
        </span>
        <span>{ currPage + 1 } <span className={styles.disabledText}>of</span> { pageCount }</span>
        <span className={currPage == pageCount - 1 ? styles.indexButtonDisable : styles.indexButton} onClick={(e) => props.onChangeOffset(++currPage * props.limit)}>
          &gt;
        </span>
      </div>
      <div className={styles.indexItems}>
        <span>{props.total} <span className={styles.disabledText}>total</span></span>
      </div>
      <div className={styles.indexItems}>
        <Select onChange={(e) => props.onSearchLimit(e.target.value)} value={props.limit.toString()}>
          {limitOptions?.map((item, i) =>
            <option key={i} value={item}>{item} pp</option>
          )}
        </Select>
      </div>
      <div className={styles.indexItems}>
        <span className={styles.disabledText}>Go to</span>
        <Input type="number" className={styles.goToInput} onKeyDown={(e) => onGoTo(e)}/>
      </div>
    </div>
  );
}
