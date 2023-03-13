import { getCookie } from '@root/modules/cookies';

const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1314/api/v1";

function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie('auth'),
  }
};

export function checkAuthFormat(auth?: string): boolean {
  if (auth === undefined) {
    auth = getCookie('auth');
  }
  
  return /^(EST).*(ARY)$/.test(auth) || /^(DEL).*(TA)$/.test(auth);
}

export async function checkAuth(auth?: string): Promise<boolean> {
  if (auth === undefined) {
    auth = getCookie('auth');
  }
  
  const res = await fetch(apiURL + "/health", {
    headers: {
      ...defaultHeaders(),
      'Authorization': 'Bearer ' + auth,
    }
  });

  if (res.status === 401) {
    return false;
  }

  if (!res.ok) {
    throw 'Unknown authorization failure: ' + await res.text();
  }

  return true;
}