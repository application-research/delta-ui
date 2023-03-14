'use client';

import styles from '@components/FormUploadData.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import Input from '@components/Input';

export default function FormUploadData(props) {
  const [file, setFile] = React.useState('');

  function onPaste(e) {
    e.preventDefault();

    let pasteValue = (e.clipboardData).getData("text");
    setFile(pasteValue);
  };

  async function onUpload(e) {
    e.preventDefault();

    // TODO
    // let addContentsRes = await fetch(apiURL + `/dataset/content/${addDataResBody.name}`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: file
    // });

    props.updateState();
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Upload data</h2>
      <p className={styles.paragraph}>Upload a <em>.json</em> dataset file describing contents to upload to the Filecoin network.</p>
      <form onSubmit={onUpload}>
        <Input id='dataset-name' autoFocus />
        <label htmlFor="dataset-file" className={`${styles.upload} ${file ? styles.uploadReady : ""}`} onPaste={onPaste}>
          <input type="text" id="dataset-file" onClick={e => e.preventDefault()} />
          {file ? "✓ Ready" : "Paste here"}
        </label>
        {file && <div>
          <Button>Upload</Button>
        </div>}
      </form>
    </Dismissible>
  );
}
