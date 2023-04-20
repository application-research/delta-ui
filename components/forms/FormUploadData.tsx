'use client';

import styles from './FormUploadData.module.scss';

import * as React from 'react';
import { addContents } from '@root/data/api';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import FileUpload from '@components/FileUpload';
import Feedback from '@components/Feedback';

export default function FormUploadData(props: {
  selectedDataset: string,
  onOutsideClick: React.MouseEventHandler,
  updateState: () => void,
}) {
  const [datasetName, setDatasetName] = React.useState(props.selectedDataset || '');
  const [file, setFile] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(<Feedback />);

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

      // This is just to make sure the file is in valid JSON format
      JSON.parse(fileContents);

      let res = await addContents(props.selectedDataset, fileContents);
      props.updateState();

      setFeedback(
        <Feedback type='success'>
          {JSON.stringify(res)}
        </Feedback>
      );
      // setTimeout(props.onOutsideClick, 1000);
    } catch (e) {
      setFeedback(<Feedback type='error'>{e.toString()}</Feedback>);
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
      {feedback}
    </Dismissible>
  );
}
