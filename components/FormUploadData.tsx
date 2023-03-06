'use client';

import styles from '@components/FormUploadData.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';

export default function FormUploadData(props) {
  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Example tootlip/modal thing</h2>
      <p className={styles.paragraph}>This is an example paragraph. You can write anything here to invoke the user to do something. Exercise your power!</p>
      <p className={styles.paragraph}>There should be enough example code for you to wire up the other two Elijah!</p>
      <Button>Choose local CAR file</Button>
    </Dismissible>
  );
}
