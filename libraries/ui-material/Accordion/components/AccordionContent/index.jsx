import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use/lib/useMeasure';
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
  const [contentHeight, setContentHeight] = React.useState(0);
  const [ref, { height }] = useMeasure();

  React.useEffect(() => {
    setContentHeight(height);
    window.addEventListener('resize', setContentHeight(height));
    return () => {
      window.removeEventListener('resize', setContentHeight(height));
    };
  }, [height]);

  const expand = useSpring({
    config: {
      duration: 175,
      tension: 100,
      friction: 20,
    },
    height: open ? contentHeight : 0,
  });

  return (
    <animated.div className={classnames('ui-material__accordion-content', styles.content)} style={expand} id={id} aria-hidden={!open}>
      <div ref={ref}>
        <div className={classnames(styles.contentInner, className)}>
          {children}
        </div>
      </div>
    </animated.div>
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
