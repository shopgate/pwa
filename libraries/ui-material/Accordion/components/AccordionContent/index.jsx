import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as styles from './style';

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent({
  children, open, id, className,
}) {
  const style = {
    height: !open ? 0 : 'auto',
  };

  return (
    <div className={styles.content} style={style} id={id} aria-hidden={!open}>
      <div className={classnames(styles.contentInner, className)}>
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
  open: false,
  className: null,
};

export default AccordionContent;
