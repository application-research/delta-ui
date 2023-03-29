import * as React from "react";
import * as path from 'path';

import styles from './FileList.module.scss';

export default function FileList(props) {
  const [files, setFiles] = React.useState([]);

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
        alert(e.toString());
      }
    })()
  }, [props.root]);

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