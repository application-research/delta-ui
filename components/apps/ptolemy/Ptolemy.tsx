import * as React from 'react';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';
import Modal from '@components/Modal';

const formStates = {
  none: 0,
  createJob: 1,
}

export default function Ptolemy(props) {
  const [formState, setFormState] = React.useState(formStates.none);

  const createJobButton = React.useRef(null);

  function onClose(modalID) {
    if (modalID === formState) {
      setFormState(formStates.none);
    }
  }
  
  return (
    <DefaultLayout apps={props.apps} onSwitchApp={props.onSwitchApp} activeApp={props.activeApp}>
      <AppTitle>Ptolemy</AppTitle>
      <AppVersion>Vesion Placeholder</AppVersion>
      <AppNav>
        <AppNavItem>Jobs</AppNavItem>
        <AppNavSubItem onClick={e => setFormState(formStates.createJob)}>
          <span ref={createJobButton}>+ Create job</span>
        </AppNavSubItem>
        {formState === formStates.createJob && <Modal modalID={formStates.createJob} onClose={onClose} anchor={createJobButton}>
          <div>test</div>
        </Modal>}
      </AppNav>
      <AppBody>
      </AppBody>
    </DefaultLayout>
  )
}