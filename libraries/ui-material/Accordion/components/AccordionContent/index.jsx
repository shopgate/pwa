import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import * as styles from './style';

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent({ children, open }) {
  const ref = useRef(null);
  const height = (ref.current === null) ? 'auto' : ref.current.clientHeight;
  const [style, set] = useSpring(() => ({
    height: !open ? 0 : height,
    config: { duration: 150 },
  }));

  // Change the styles when the 'open' flag changes.
  useEffect(() => {
    set({ height: !open ? 0 : height });
  }, [open]);

  return (
    <animated.div className={styles.content} style={style}>
      <div ref={ref} className={styles.contentInner}>
        {children}
      </div>
    </animated.div>
  );
}

AccordionContent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
};

AccordionContent.defaultProps = {
  open: false,
};

export default AccordionContent;
