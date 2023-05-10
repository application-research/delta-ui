import * as React from 'react';

import styles from './TagSelect.module.scss';

import Dismissible from '@components/Dismissible';

export default function TagSelect(props: {
  disabled?: boolean,
  selected: string[],
  setSelected: (selected: string[]) => void,
  options: string[],
}) {
  let [showAddMenu, setShowAddMenu] = React.useState(false);
  let [selectMenuPos, setSelectMenuPos] = React.useState({ x: 0, y: 0 });

  function updateSelectMenuPos(node) {
    let anchorRect = node.getBoundingClientRect();
    let anchorOffsetParentRect = node.offsetParent.getBoundingClientRect();
    let left = anchorRect.left - anchorOffsetParentRect.left + anchorRect.width;
    let top = anchorRect.top - anchorOffsetParentRect.top + anchorRect.height * 0.5;
    setSelectMenuPos({ x: left, y: top });
  }

  let addMenuButton = React.useCallback(node => {
    if (node) {
      updateSelectMenuPos(node);
    }
  }, [showAddMenu]);

  React.useEffect(() => {
    if (props.selected.length === props.options.length) {
      setShowAddMenu(false);
    }
  }, [props.selected])

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
            key={i}
          >{option}</span>
        )
      })}
      {!props.disabled && <span ref={addMenuButton} className={styles.addButton} onClick={e => setShowAddMenu(true)}>
        add
      </span>}
      {showAddMenu && (() => {
        return (
          <Dismissible
            className={styles.addMenu}
            onOutsideClick={() => setShowAddMenu(false)}
            style={{
              left: `${selectMenuPos.x}px`,
              top: `${selectMenuPos.y}px`,
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