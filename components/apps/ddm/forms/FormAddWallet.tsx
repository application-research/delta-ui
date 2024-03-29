'use client';

import * as React from 'react';

import styles from '@components/apps/ddm/forms/FormAddWallet.module.scss';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';

export default function FormAddWallet(props) {
  return (
    <div>
      <h2 className={styles.heading}>Add wallet</h2>
      <p className={styles.paragraph}>For security reasons, please use the CLI to add a wallet:</p>
      <code className={styles.codeExample}>./delta-dm wallet import --hex $(lotus wallet export &lt;wallet address&gt;)</code>
    </div>
  );
}
