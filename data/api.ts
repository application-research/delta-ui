import { getCookie } from '@root/modules/cookies';

function apiURL() {
  return (getCookie('ddm-address') || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, '') || "http://localhost:1314";
}

function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie('auth'),
  }
};

// Checks only whether an auth key is in a valid format, without contacting
// delta-dm API. Optionally accepts an auth key parameter - if not provided, the
// auth cookie will be used.
export function checkAuthFormat(auth?: string): boolean {
  if (auth === undefined) {
    auth = getCookie('auth');
  }

  return /^(EST).*(ARY)$/.test(auth) || /^(DEL).*(TA)$/.test(auth);
}

// Checks auth key validity with delta-dm. Optionally accepts an auth key
// parameter - if not provided, cached cookie values will be used.
//
// This function times out after 5 seconds.
export async function checkAuth(auth?: string, ddmAddress?: string): Promise<boolean> {
  if (auth === undefined) {
    auth = getCookie('auth');
  }

  let res;
  const abortController = new AbortController();
  const timeoutID = setTimeout(() => abortController.abort(), 5000);
  try {
    res = await fetch((ddmAddress || apiURL()) + '/api/v1/health', {
      headers: {
        ...defaultHeaders(),
        'Authorization': 'Bearer ' + auth,
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
    throw new Error('Unknown authorization failure: ' + await res.text());
  }

  return true;
}

export async function getHealth() {
  const res = await fetch(apiURL() + '/api/v1/health', {
    headers: defaultHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function getDatasets() {
  const res = await fetch(apiURL() + '/api/v1/datasets', {
    headers: defaultHeaders()
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  
  return await res.json();
}

export async function addDataset(
  name: string,
  replications: number,
  durationDays: number,
  unsealed: boolean,
  indexed: boolean,
) {
  const res = await fetch(apiURL() + '/api/v1/datasets', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'name': name,
      'replication_quota': Number(replications),
      'deal_duration': Number(durationDays),
      'unsealed': unsealed,
      'indexed': indexed,
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function addContents(
  datasetName: string,
  body: string,
) {
  const res = await fetch(apiURL() + '/api/v1/contents/' + datasetName, {
    method: 'post',
    headers: defaultHeaders(),
    body: body
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function getProviders() {
  const res = await fetch(apiURL() + '/api/v1/providers', {
    headers: defaultHeaders()
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  
  return await res.json();
}

export async function addProvider(id: string, name: string) {
  const res = await fetch(apiURL() + '/api/v1/providers', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'actor_id': id,
      'actor_name': name,
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function updateProvider(id: string, name: string, allowSelfService: boolean) {
  const res = await fetch(apiURL() + '/api/v1/providers/' + id, {
    method: 'put',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'actor_name': name,
      'allow_self_service': allowSelfService ? 'on' : 'off',
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function getReplications() {
  const res = await fetch(apiURL() + '/api/v1/replications', {
    headers: defaultHeaders()
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  
  return await res.json();
}

export async function addReplication(
  providerID: string,
  datasetName: string,
  numDeals: number,
  delayStartDays: number,
) {
  const res = await fetch(apiURL() + '/api/v1/replications', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'provider': providerID,
      'dataset': datasetName,
      'num_deals': Number(numDeals),
      'delay_start_days': Number(delayStartDays),
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

export async function associateWallet(address: string, datasetName: string) {
  const res = await fetch(apiURL() + '/api/v1/wallets/associate', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'address': address,
      'dataset': datasetName
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}