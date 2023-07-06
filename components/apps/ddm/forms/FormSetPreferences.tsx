'use client';

import * as React from 'react';

import styles from '@components/apps/ddm/forms/FormSetPreferences.module.scss';

import Input from '@components/basic/Input';
import { useState } from 'react';

export default function FormSetPreferences(props) {

  const [isChecked, setIsChecked] = useState(localStorage.getItem('settings.global.useLocalTime') == 'true');

  const handleCheckboxChange = (e) => {
    localStorage.setItem('settings.global.useLocalTime', e.target.checked)
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <h2 className={styles.heading}>Preferences</h2>
      <div className={styles.formRow}>
        <Input type="checkbox"
               label="Display in Local Time"
               checked={isChecked}
               onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
}
