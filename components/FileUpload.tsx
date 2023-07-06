import { createSlug } from '@common/utilities';
import * as React from 'react';

import styles from '@components/FileUpload.module.scss';

export default function FileUpload(props) {
  let id = (props.id ? props.id + '-' : '') + createSlug(props.label);
  
  const [file, setFile] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>();

  const handleFileChange = (e) => {
    let tmpFile = e.target.files[0];
    setFile(tmpFile);
    props.onUpload(tmpFile);
  };

  const handlePaste = async (e) => {
    if (e.clipboardData.files.length) {
      let tmpFile = e.clipboardData.files[0];
      setFile(tmpFile);
      props.onUpload(tmpFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setDragOver(false);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      let tmpFile = e.dataTransfer.files[0]; 
      setFile(tmpFile);
      props.onUpload(tmpFile);
    }
    setDragOver(false);
  };

  return (
    <div className={styles.fileUpload} onPaste={handlePaste} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <label className={styles.label} htmlFor={id}>{props.label}</label>
      <input
        id={id}
        ref={fileInputRef}
        type='file'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className={`${styles.fileUploadButton} ${dragOver && styles.fileUploadButtonHover}`} type="button" onClick={() => fileInputRef.current?.click()}>
        { file ? file.name : 'Select or Drop File' }
      </button>
    </div>
  );
}