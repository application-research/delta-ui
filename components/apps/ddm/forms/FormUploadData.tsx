'use client';

import * as React from 'react';
import { addContents } from '@root/data/api';

import styles from '@components/apps/ddm/forms/FormUploadData.module.scss';

import Button from '@components/Button';
import Dismissible from '@components/Dismissible';
import FileUpload from '@components/FileUpload';
import Feedback from '@components/Feedback';
import { pluralize, truncCid } from '@root/common/utilities';
import { DDMContext } from '@root/common/ddm';

export default function FormUploadData(props: {}) {
  const ctx = React.useContext(DDMContext);
  
  const [datasetName, setDatasetName] = React.useState(ctx.selectedDataset || '');
  const [file, setFile] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState(<Feedback />);

  async function onUpload(e) {
    e.preventDefault();

    setFeedback(<Feedback />)
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

      let res = await addContents(ctx.selectedDataset, fileContents);
      ctx.updateDatasets();

      setFeedback(
        <Feedback type='success'>
          {res.success &&
            <>
              <p>Attached {res.success.length} {pluralize('content', res.success.length)}</p>
              <ul>
                {res.success.map((cid, i) => <li>{truncCid(cid)}</li>)}
              </ul>
            </>
          }
          <br />
          {res.fail && <p>Skipped {res.fail.length} duplicate {pluralize('content', res.fail.length)}</p>}
        </Feedback>
      );
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
    <div>
      <h2 className={styles.heading}>Attach data for {ctx.selectedDataset}</h2>
      <p className={styles.paragraph}>Upload a <em>.json</em> dataset file describing contents to upload to the Filecoin network.</p>
      <form onSubmit={onUpload}>
        <div className={styles.formRow}>
          <FileUpload label='Content JSON' onUpload={file => setFile(file)} />
        </div>
        <div className={styles.formRow}>
          <Button disabled={!isFormValid() || feedback?.props.type === 'success'} loading={loading} primary>Upload</Button>
        </div>
      </form>
      {feedback}
    </div>
  );
}
