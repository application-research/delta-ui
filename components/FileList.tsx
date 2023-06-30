import * as React from "react";
import * as path from 'path';

import styles from '@components/FileList.module.scss';

export default function FileList(props) {
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        let res = await fetch(`http://localhost:8080/files?root=${encodeURIComponent(props.root)}`);

        if (!res.ok) {
          throw new Error(await res.text());
        }

        let files = await res.json();

        if (props.root !== '/') {
          files.unshift({
            name: '..',
            full_path: path.dirname(props.root),
            is_dir: true,
          })
        }

        setFiles(files);
      } catch (e) {
        console.log(e);
        setError('Failed to get directory');
      } finally {
        setLoading(false);
      }
    })()
  }, [props.root]);

  if (loading) {
    return (
      <div className={styles.body}>
        <div className={styles.row}>
          Loading...
        </div>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className={styles.body}>
        <div className={styles.row}>
          {error}
        </div>
      </div>
    )
  }
  
  return (
    <div className={styles.body}>
      {files.map((file) => (
        <div key={file.full_path} className={styles.row} onClick={e => props.onSelectFile(file.full_path)}>
          <div className={styles.column}>
            {file.is_dir ? (
              <div className={styles.directory} onClick={e => {
                props.onChangeRoot(file.full_path);
                e.stopPropagation();
              }}>
                {file.name}/
              </div>
            ) : (
              <div className={styles.file}>
                {file.name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}