import * as React from 'react';

import styles from '@components/TagSelect.module.scss';

import Dismissible from '@components/Dismissible';

export default function TagSelect(props: {
  disabled?: boolean,
  selected: number[],
  setSelected: (selected: number[]) => void,
  options: Map<number, string>,
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
    if (props.selected.length === props.options.size) {
      setShowAddMenu(false);
    }
  }, [props.selected])

  function select(value: number) {
    props.setSelected([...props.selected, value]);
  }

  function deselect(value: number) {
    props.setSelected(props.selected.filter((currValue, _) => currValue !== value));
  }

  return (
    <div className={styles.body}>
      {props.selected.map((id, i) => {
        return (
          <span
            className={props.disabled ? styles.selected : styles.selectedInteractive}
            onClick={props.disabled ? undefined : (e => deselect(id))}
            key={i}
          >{props.options.get(id)}</span>
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
              {Array.from(props.options.entries()).filter(([id, label]) => props.selected.indexOf(id) === -1).map(([id, label]) => {
                return (
                  <li className={styles.option} onClick={e => select(id)}>{label}</li>
                )
              })}
            </ul>
          </Dismissible>
        );
      })()}
    </div>
  )
}