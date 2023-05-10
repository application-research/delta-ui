import * as React from 'react';

import styles from '@components/Form.module.scss';

import DefaultLayout, { AppBody, AppNav, AppNavItem, AppNavSubItem, AppTitle, AppVersion } from '@components/DefaultLayout';
import Modal from '@components/Modal';
import Input from '@components/Input';
import Select from '@components/Select';
import FileSelect from '@components/FileSelect';

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
          <h2 className={styles.header}>Create Job</h2>
          <div className={styles.formRow}>
            <Input label='Job Name' />
          </div>
          <div className={styles.formRow}>
            <Select label='Encryption' disabled default='to be implemented...' />
          </div>
          <div className={styles.formRow}>
            <FileSelect label='Target Area' />
          </div>
          <div className={styles.formRow}>
            <FileSelect label='Staging Area' />
          </div>
          <div className={styles.formRow}>
            <Input type='number' label='Thread Count' value='1' />
          </div>
          <div className={styles.formRow}>
            <Input type='range' label='Shard Size' min='1' max='31' />
          </div>
        </Modal>}
      </AppNav>
      <AppBody>
      </AppBody>
    </DefaultLayout>
  )
}