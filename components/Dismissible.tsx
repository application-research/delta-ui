import * as React from 'react';

function Dismissible(props) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        event.stopPropagation();
        // TODO(jim): Sad hack, I'm rusty.
        // So embarassing.
        setTimeout(() => {
          props.onOutsideClick(event);
        }, 100);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className={props.className} style={props.style} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default Dismissible;
