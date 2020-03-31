// @flow
import * as React from 'react';
import classnames from 'classnames';
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use/lib/useMeasure';
import * as styles from './style';

export type Props = {
  children: React.Node,
  id: string,
  open?: boolean,
  className?: string,
}

/**
 * The accordion content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function AccordionContent(props: Props) {
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
    <animated.div className={styles.content} style={expand} id={id} aria-hidden={!open}>
      <div ref={ref}>
        <div className={classnames(styles.contentInner, className)}>
          {children}
        </div>
      </div>
    </animated.div>
  );
}

AccordionContent.defaultProps = {
  open: false,
  className: null,
};

export default AccordionContent;
