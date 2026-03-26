import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import { makeStyles, useTheme } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'absolute',
    margin: theme.spacing(1),
  },
}));

/**
 * The Context Menu Position component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Position = ({
  children,
  offset,
}) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const elementRef = useRef(null);
  const gap = theme.spacing(1);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) {
      return;
    }

    const [child] = el.childNodes;
    if (!child) {
      return;
    }

    const bounds = child.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const left = clamp(offset.left, 0, width - bounds.width - (gap * 2));
    const top = clamp(offset.top - gap, 0, height - bounds.height - (gap * 2));

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * match legacy componentDidMount: position once */
  }, []);

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
