'use client';

import styles from './FormUploadData.module.scss';

import * as React from 'react';
import { addContents } from '@root/data/api';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import Input from '@components/Input';
import FileUpload from '@components/FileUpload';
import DatasetSelect from '@components/DatasetSelect';

export default function FormUploadData(props) {
  const [datasetName, setDatasetName] = React.useState(props.selectedDataset || '');
  const [file, setFile] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onUpload(e) {
    e.preventDefault();

    setLoading(true);

    const readFileContents = (file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    };

    try {
      const fileContents = await readFileContents(file);

      JSON.parse(fileContents);

      await addContents(props.selectedDataset, fileContents);
      await props.updateState();
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  function isFormValid() {
    return datasetName && file;
  }

  return (
    <Dismissible className={styles.body} onOutsideClick={props.onOutsideClick}>
      <h2 className={styles.heading}>Attach data for {props.selectedDataset}</h2>
      <p className={styles.paragraph}>Upload a <em>.json</em> dataset file describing contents to upload to the Filecoin network.</p>
      <form onSubmit={onUpload}>
        {/* <div className={styles.formRow}>
          <DatasetSelect label='Dataset Name' datasets={props.state?.datasets} autoFocus onChange={e => setDatasetName(e.target.value)} />
        </div> */}
        <div className={styles.formRow}>
          <FileUpload label='Content JSON' onUpload={file => setFile(file)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!isFormValid()} loading={loading}>Upload</Button>
        </div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Dismissible>
  );
}
