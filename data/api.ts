import { getCookie } from '@root/modules/cookies';

const apiURL = process.env.NEXT_PUBLIC_API_URL ? (process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') + '/api/v1') : "http://localhost:1314/api/v1";

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
// parameter - if not provided, the auth cookie will be used.
export async function checkAuth(auth?: string): Promise<boolean> {
  if (auth === undefined) {
    auth = getCookie('auth');
  }

  const res = await fetch(apiURL + '/health', {
    headers: {
      ...defaultHeaders(),
      'Authorization': 'Bearer ' + auth,
    }
  });

  if (res.status === 401) {
    return false;
  }

  if (!res.ok) {
    throw new Error('Unknown authorization failure: ' + await res.text());
  }

  return true;
}

export async function getDatasets() {
  const res = await fetch(apiURL + '/datasets', {
    headers: defaultHeaders()
  });
  return await res.json();
}

export async function addDataset(
  name: string,
  replications: number,
  durationDays: number,
  unsealed: boolean,
  indexed: boolean,
) {
  const res = await fetch(apiURL + '/datasets', {
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
  const res = await fetch(apiURL + '/datasets/content/' + datasetName, {
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
  const res = await fetch(apiURL + '/providers', {
    headers: defaultHeaders()
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  
  return await res.json();
}

export async function addProvider(id: string, name: string) {
  const res = await fetch(apiURL + '/providers', {
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

export async function getReplications() {
  const res = await fetch(apiURL + '/replication', {
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
) {
  const res = await fetch(apiURL + '/replication', {
    method: 'post',
    headers: defaultHeaders(),
    body: JSON.stringify({
      'provider': providerID,
      'dataset': datasetName,
      'num_deals': Number(numDeals),
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function getWallets() {
  const res = await fetch(apiURL + '/wallets', {
    headers: defaultHeaders(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function associateWallet(address: string, datasetName: string) {
  const res = await fetch(apiURL + '/wallets/associate', {
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