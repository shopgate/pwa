import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const outerGap = themeConfig.variables.gap.small;

const useStyles = makeStyles()({
  container: {
    position: 'absolute',
    margin: outerGap,
  },
});

/**
 * The Context Menu Position component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Position = ({ children, offset }) => {
  const { classes } = useStyles();
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const [child] = elementRef.current.childNodes;
    if (!child) {
      return;
    }

    const bounds = child.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const gap = outerGap;

    const left = clamp(offset.left, 0, width - bounds.width - (gap * 2));
    const top = clamp(offset.top - gap, 0, height - bounds.height - (gap * 2));

    elementRef.current.style.left = `${left}px`;
    elementRef.current.style.top = `${top}px`;
  }, [offset]);

  return (
    <div ref={elementRef} className={classes.container}>
      {children}
    </div>
  );
};

Position.propTypes = {
  children: PropTypes.node,
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

Position.defaultProps = {
  children: null,
  offset: {
    top: 0,
    left: 0,
  },
};

export default Position;
