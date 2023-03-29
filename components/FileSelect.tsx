import * as React from 'react';

import FileList from '@components/FileList';

export default function FileSelect(props) {
  const [root, setRoot] = React.useState('/home/elijah');
  
  return (
    <FileList root={root} onChangeRoot={setRoot} onSelectFile={props.onSelectFile} />
  )
}