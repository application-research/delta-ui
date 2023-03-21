'use client';

import styles from './FormUploadData.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import Input from '@components/Input';
import { addContents } from '@root/data/api';

export default function FormUploadData(props) {
  const [datasetName, setDatasetName] = React.useState('');
  const [file, setFile] = React.useState('');
  const [error, setError] = React.useState('');

  function onPaste(e) {
    e.preventDefault();

    let pasteValue = (e.clipboardData).getData("text");
    setFile(pasteValue);
  };

  async function onUpload(e) {
    e.preventDefault();

    try {
      await addContents(props.selectedDataset, file);
    } catch (e) {
      setError(e.toString());
    }
    
    props.updateState();
  }

  function isFormValid() {
    return file && datasetName;
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Upload data for {props.selectedDataset}</h2>
      <p className={styles.paragraph}>Upload a <em>.json</em> dataset file describing contents to upload to the Filecoin network.</p>
      <form onSubmit={onUpload}>
        <Input id='dataset-name' label='Dataset Name' value={datasetName} required onChange={e => setDatasetName(e.target.value)} autoFocus />
        <label htmlFor="dataset-file" className={`${styles.upload} ${file ? styles.uploadReady : ""}`} onPaste={onPaste}>
          <input type="text" id="dataset-file" onClick={e => e.preventDefault()} />
          {file ? "✓ Ready" : "Paste Content File Here"}
        </label>
        <Button disabled={!isFormValid()}>Upload</Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  );
}
