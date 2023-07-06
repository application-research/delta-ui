'use client';

import * as React from 'react';
import { checkAuth, checkAuthFormat } from '@data/api';

import styles from '@ddm/auth/page.module.scss';

import Button from '@components/Button';
import Input from '@components/basic/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { DDMContext, loadAuth, loadDDMAddress, saveAuth, saveDDMAddress } from '@root/common/ddm';

async function auth(ctx: any, authToken: string, ddmAddress: string, setLoading: (loading: boolean) => void) {
  setLoading(true);

  try {
    if (!(await checkAuth(authToken, ddmAddress))) {
      alert('Unauthorized token');
      return;
    }
  } catch (e) {
    alert(e.toString());
    return;
  } finally {
    setLoading(false);
  }

  saveAuth(authToken);
  saveDDMAddress(ddmAddress);

  // Make sure to unset the unauthorized flag so user doesn't get redirected
  // back here after.
  ctx.setUnauthorized(false);
}

function returnToOriginalPage(router, searchParams) {
  let returnLocation = searchParams.get('return') || '/ddm/datasets';
  router.replace(returnLocation);
}

export default function Auth(props: {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ctx = React.useContext(DDMContext);

  // Store a tmp auth token in the component so the main application auth token
  // state doesn't update until the user submits the form
  const [tmpAuthToken, setTmpAuthToken] = React.useState('');
  const [tmpDDMAddress, setTmpDDMAddress] = React.useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1415');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let loadedAuth = loadAuth();
    if (loadedAuth) {
      setTmpAuthToken(loadedAuth);
    }

    let loadedDDMAddress = loadDDMAddress();
    if (loadedDDMAddress) {
      setTmpDDMAddress(loadedDDMAddress);
    }
  }, []);

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.body}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await auth(ctx, tmpAuthToken, tmpDDMAddress, setLoading);
            returnToOriginalPage(router, searchParams);
          }}
        >
          <Input label="Delta API Authorization Token" id="auth-token" value={tmpAuthToken} onChange={(e) => setTmpAuthToken(e.target.value)} />
          <Input label="Delta-DM API Address" id="ddm-address" value={tmpDDMAddress} onChange={(e) => setTmpDDMAddress(e.target.value)} />
          <Button disabled={!checkAuthFormat(tmpAuthToken)} loading={loading} primary>
            {tmpAuthToken == '' || checkAuthFormat(tmpAuthToken) ? 'Connect' : 'Invalid Token Format'}
          </Button>
        </form>
      </div>
    </>
  );
}

Auth.getLayout = (page) => {
  return page.Component.getLayout();
};
