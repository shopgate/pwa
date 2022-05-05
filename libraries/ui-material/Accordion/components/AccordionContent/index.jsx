import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as styles from './style';

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent({
  children, open, id, className,
}) {
  const ref = useRef(null);
  const height = (ref.current === null) ? 'auto' : ref.current.clientHeight;
  const style = {
    height: !open ? 0 : height,
  };

  return (
    <div className={styles.content} style={style} id={id} aria-hidden={!open}>
      <div ref={ref} className={classNames(styles.contentInner, className)}>
        {children}
      </div>
    </div>
  );
}

AccordionContent.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
};

AccordionContent.defaultProps = {
  className: '',
  open: false,
};

export default AccordionContent;
