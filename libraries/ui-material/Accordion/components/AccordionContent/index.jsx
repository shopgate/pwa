import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useMeasure } from 'react-use';
import * as styles from './style';

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent(props) {
  const {
    children, open, id, className,
  } = props;
  const [ref, { height }] = useMeasure();

  const style = useMemo(() => ({ height: open ? height : 0 }), [height, open]);

  return (
    <div className={styles.content} style={style} id={id} aria-hidden={!open}>
      <div ref={ref} className={classnames(styles.contentInner, className)}>
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
