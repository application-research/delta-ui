import * as React from 'react';

import FileList from '@components/FileList';

export default function FileSelect(props: {
  label?: string,
  root?: string,
  onSelectFile?: (path: string) => void,
  onChangeRoot?: (path: string) => void,
}) {
  const [root, setRoot] = React.useState('/');
  
  return (
    <FileList root={root} onChangeRoot={setRoot} onSelectFile={props.onSelectFile} />
  )
}