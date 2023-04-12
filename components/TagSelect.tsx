import * as React from 'react';

import styles from './TagSelect.module.scss';

import Dismissible from '@components/Dismissible';

export default function TagSelect(props: {
  disabled?: boolean,
  selected: string[],
  setSelected: (selected: string[]) => void,
  options: string[],
}) {
  let addMenuButton = React.useRef(null);
  let [showAddMenu, setShowAddMenu] = React.useState(false);

  function select(value: string) {
    props.setSelected([...props.selected, value]);
  }

  function deselect(value: string) {
    props.setSelected(props.selected.filter((currValue, _) => currValue !== value));
  }

  return (
    <div className={styles.body}>
      {props.selected.map((option, i) => {
        return (
          <span
            className={props.disabled ? styles.selected : styles.selectedInteractive}
            onClick={props.disabled ? undefined : (e => deselect(option))}
          >{option}</span>
        )
      })}
      {!props.disabled && <span ref={addMenuButton} className={styles.addButton} onClick={e => setShowAddMenu(true)}>
        add
      </span>}
      {showAddMenu && (() => {

        let anchorRect = addMenuButton.current.getBoundingClientRect();
        let anchorOffsetParentRect = addMenuButton.current.offsetParent.getBoundingClientRect();
        let left = anchorRect.left - anchorOffsetParentRect.left + anchorRect.width;
        let top = anchorRect.top - anchorOffsetParentRect.top + anchorRect.height * 0.5;

        return (
          <Dismissible
            className={styles.addMenu}
            onOutsideClick={() => setShowAddMenu(false)}
            style={{
              left: `${left}px`,
              top: `${top}px`,
            }}
          >
            <ul className={styles.options}>
              {props.options.filter((option, i) => props.selected.indexOf(option) === -1).map((option, i) => {
                return (
                  <li className={styles.option} onClick={e => select(option)}>{option}</li>
                )
              })}
            </ul>
          </Dismissible>
        );
      })()}
    </div>
  )
}