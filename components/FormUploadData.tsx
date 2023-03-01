'use client';

import styles from '@components/FormUploadData.module.scss';

import * as React from 'react';

import Button from '@components/Button';

export default function FormUploadData(props) {
  return (
    <div className={styles.body}>
      <h2 className={styles.heading}>Example tootlip/modal thing</h2>
      <p className={styles.paragraph}>This is an example paragraph. You can write anything here to invoke the user to do something. Exercise your power!</p>
      <Button>Choose local CAR file</Button>
    </div>
  );
}
