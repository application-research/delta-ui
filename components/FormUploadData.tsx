'use client';

import styles from '@components/FormUploadData.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';

export default function FormUploadData(props) {
  const [file, setFile] = React.useState('');

  function onPaste(e) {
    e.preventDefault();

    let pasteValue = (e.clipboardData).getData("text");
    setFile(pasteValue);
  };

  async function onUpload(e) {
    e.preventDefault();

    // TODO: WOW This is so ugly what's a good way to set a default value for
    // this env variable
    let apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1314/api/v1";

    let addDataRes = await fetch(apiURL + "/dataset", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "dataset" + Math.floor(Math.random() * 10000),
        replication_quota: 6,
        deal_delay_start_epoch: 7,
        deal_duration: 540,
      })
    });
    let addDataResBody = await addDataRes.json();

    let addContentsRes = await fetch(apiURL + `/dataset/content/${addDataResBody.name}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: file
    });

    console.log(addContentsRes);

    props.updateState();
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Upload data</h2>
      <p className={styles.paragraph}>Upload a <em>.json</em> dataset file describing contents to upload to the Filecoin network.</p>
      <form onSubmit={onUpload}>
        <label htmlFor="datasetFile" className={`${styles.upload} ${file ? styles.uploadReady : ""}`} onPaste={onPaste}>
          <input type="text" id="datasetFile" name="datasetFile" onClick={e => e.preventDefault()} autoFocus />
          {file ? "✓ Ready" : "Paste here"}
        </label>
        {file && <div>
          <Button>Upload</Button>
        </div>}
      </form>
    </Dismissible>
  );
}
