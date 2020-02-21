import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './style';

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent({ children, open, id }) {
  const style = {
    height: !open ? 0 : 'auto',
  };

  return (
    <div className={styles.content} style={style} id={id} aria-hidden={!open}>
      <div className={styles.contentInner}>
        {children}
      </div>
    </div>
  );
}

AccordionContent.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

AccordionContent.defaultProps = {
  open: false,
};

export default AccordionContent;
