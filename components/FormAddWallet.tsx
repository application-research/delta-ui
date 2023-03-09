'use client';

import styles from '@components/FormAddWallet.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';

export default function FormAddWallet(props) {
  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Add wallet</h2>
      <p className={styles.paragraph}>For security reasons, please use the CLI to add a wallet:</p>
      <code className={styles.codeExample}>./delta-dm wallet import --dataset dataset-name --file &lt;path-to-file&gt;</code>
    </Dismissible>
  );
}
