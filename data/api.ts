import { loadAuth, loadDDMAddress } from '@root/common/ddm';

function apiURL() {
  return (loadDDMAddress() || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, '') || 'http://localhost:1415';
}

function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + loadAuth(),
  };
}

// Checks only whether an auth key is in a valid format, without contacting
// delta-dm API. Optionally accepts an auth key parameter - if not provided, the
// cached value will be used.
export function checkAuthFormat(auth?: string): boolean {
  if (auth === undefined) {
    auth = loadAuth();
  }

  return /^(EST).*(ARY)$/.test(auth) || /^(DEL).*(TA)$/.test(auth);
}

// Checks auth key validity with delta-dm. Optionally accepts an auth key
// parameter - if not provided, cached values will be used.
//
// This function times out after 5 seconds.
export async function checkAuth(auth?: string, ddmAddress?: string): Promise<boolean> {
  if (auth === undefined) {
    auth = loadAuth();
  }

  let res;
  const abortController = new AbortController();
  const timeoutID = setTimeout(() => abortController.abort(), 5000);
  try {
    res = await fetch((ddmAddress || apiURL()) + '/api/v1/health', {
      headers: {
        ...defaultHeaders(),
        Authorization: 'Bearer ' + auth,
      },
      signal: abortController.signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('Timed out');
    } else {
      throw e;
    }
  } finally {
    clearTimeout(timeoutID);
  }

  if (res.status === 401) {
    return false;
  }

  if (!res.ok) {
    throw new Error('Unknown authorization failure: ' + (await res.text()));
  }

  return true;
}

export class AuthError extends Error {}

async function handleHTTPResponse(res: Response): Promise<any> {
  if (res.ok) {
    return await res.json();
  }

  if (res.status === 401) {
    throw new AuthError();
  }

  throw new Error(await res.text());
}

export async function getHealth() {
  const res = await fetch(apiURL() + '/api/v1/health', {
    headers: defaultHeaders(),
  });

  return await handleHTTPResponse(res);
}

export async function getDatasets() {
  const res = await fetch(apiURL() + '/api/v1/datasets', {
    headers: defaultHeaders(),
  });

  return await handleHTTPResponse(res);
}

export async function addDataset(name: string, replications: number, durationDays: number) {
  const res = await fetch(apiURL() + '/api/v1/datasets', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      name: name,
      replication_quota: Number(replications),
      deal_duration: Number(durationDays),
    }),
  });

  return await handleHTTPResponse(res);
}

export async function addContents(datasetName: string, body: string) {
  const res = await fetch(apiURL() + '/api/v1/contents/' + datasetName, {
    method: 'post',
    headers: defaultHeaders(),
    body: body,
  });

  return await handleHTTPResponse(res);
}

export async function getProviders() {
  const res = await fetch(apiURL() + '/api/v1/providers', {
    headers: defaultHeaders(),
  });

  return await handleHTTPResponse(res);
}

export async function addProvider(id: string, name: string) {
  const res = await fetch(apiURL() + '/api/v1/providers', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      actor_id: id,
      actor_name: name,
    }),
  });

  return await handleHTTPResponse(res);
}

export async function updateProvider(id: string, name: string, allowSelfService: boolean) {
  const res = await fetch(apiURL() + '/api/v1/providers/' + id, {
    method: 'put',
    headers: defaultHeaders(),
    body: JSON.stringify({
      actor_name: name,
      allow_self_service: allowSelfService ? 'on' : 'off',
    }),
  });

  return await handleHTTPResponse(res);
}

export async function getReplicationProfiles() {
  const res = await fetch(apiURL() + '/api/v1/replication-profiles', {
    headers: defaultHeaders(),
  });

  return await handleHTTPResponse(res);
}

export async function addReplicationProfile(provider: string, datasetID: number, indexed: boolean, unsealed: boolean) {
  const res = await fetch(apiURL() + '/api/v1/replication-profiles', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      provider_actor_id: provider,
      dataset_id: datasetID,
      indexed: indexed,
      unsealed: unsealed,
    }),
  });

  return await handleHTTPResponse(res);
}

export async function updateReplicationProfile(provider: string, datasetID: number, indexed: boolean, unsealed: boolean) {
  const res  = await fetch(apiURL() + '/api/v1/replication-profiles', {
    method: 'put',
    headers: defaultHeaders(),
    body: JSON.stringify({
      provider_actor_id: provider,
      dataset_id: datasetID,
      indexed: indexed,
      unsealed: unsealed,
    }),
  });

  return await handleHTTPResponse(res);
}

export async function deleteReplicationProfile(provider: string, datasetID: number) {
  const res = await fetch(apiURL() + '/api/v1/replication-profiles', {
    method: 'delete',
    headers: defaultHeaders(),
    body: JSON.stringify({
      provider_actor_id: provider,
      dataset_id: datasetID,
    }),
  });

  return await handleHTTPResponse(res);
}

export interface GetReplicationsConfig {
  offset: number;
  limit: number;
  datasets: string[];
  providers: string[];
  timeStart: Date;
  timeEnd: Date;
  selfService: boolean,
  proposalCID: string;
  pieceCID: string;
  message: string;
}

export async function getReplications(cfg: GetReplicationsConfig) {
  let path = '/api/v1/replications';

  if (cfg) {
    let params = {
      offset: cfg.offset?.toString(),
      limit: cfg.limit?.toString(),
      datasets: cfg.datasets?.join(','),
      providers: cfg.providers?.join(','),
      deal_time_start: !!cfg.timeStart && Math.floor(cfg.timeStart.getTime() / 1000).toString(),
      deal_time_end: !!cfg.timeEnd && Math.floor(cfg.timeEnd.getTime() / 1000).toString(),
      self_service: cfg.selfService?.toString(),
      proposal_cid: cfg.proposalCID,
      piece_cid: cfg.pieceCID,
      message: cfg.message,
    };

    // Remove values that are null or undefined
    let ignoreKeys = [];
    for (let key in params) {
      if (!params[key]) {
        ignoreKeys.push(key);
      }
    }
    for (let key of ignoreKeys) {
      delete params[key];
    }
    
    path += '?' + new URLSearchParams(params);
  }
  
  console.log(path);
  
  const res = await fetch(
    apiURL() + path,
    {
      headers: defaultHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function addReplication(providerID: string, datasetID: number, numDeals: number, delayStartDays: number) {
  const res = await fetch(apiURL() + '/api/v1/replications', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      provider: providerID,
      dataset_id: datasetID || undefined,
      num_deals: Number(numDeals),
      delay_start_days: Number(delayStartDays),
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function getWallets() {
  const res = await fetch(apiURL() + '/api/v1/wallets', {
    headers: defaultHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function associateWallet(address: string, datasets: number[]) {
  const res = await fetch(apiURL() + '/api/v1/wallets/associate', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      address: address,
      datasets: datasets,
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}
