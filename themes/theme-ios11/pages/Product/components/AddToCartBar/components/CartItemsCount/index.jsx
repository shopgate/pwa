import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import CheckIcon from '@shopgate/pwa-ui-shared/icons/CheckIcon';
import { makeStyles } from '@shopgate/engage/styles';
import Count from './components/Count';
import connect from './connector';

export const duration = 200;
export const durationShort = 50;

export const transition = {
  entering: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
    transition: `opacity ${duration}ms, transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34)`,
  },
  entered: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    transition: `opacity ${duration}ms, transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34)`,
  },
  exited: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  exiting: {
    opacity: 0,
    transform: 'translate3d(0, 0, 0)',
  },
};

const useStyles = makeStyles()(theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    transform: 'translate3d(0, 100%, 0)',
    willChange: 'transform',
    lineHeight: 1.25,
  },
  check: {
    fontSize: '1.2rem',
    paddingRight: theme.spacing(1),
  },
}));

/**
 * Cart items count component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const CartItemsCount = ({
  itemCount,
  hasCatchWeight,
  unit,
}) => {
  const { classes } = useStyles();
  const [numItems, setNumItems] = useState(itemCount);
  const [isVisible, setIsVisible] = useState(itemCount > 0);

  useEffect(() => {
    if (itemCount === 0) {
      setIsVisible(false);
      setNumItems(0);
      return;
    }
    setIsVisible(true);
    setNumItems(itemCount);
  }, [itemCount]);

  return (
    <Transition
      in={isVisible}
      timeout={{
        enter: duration,
        exit: durationShort,
      }}
    >
      {state => (
        <div className={classes.container} style={transition[state]} aria-hidden>
          <div className={classes.check}>
            <CheckIcon />
          </div>
          <Count
            unit={unit}
            hasCatchWeight={hasCatchWeight}
            count={numItems}
          />
        </div>
      )}
    </Transition>
  );
};

CartItemsCount.propTypes = {
  itemCount: PropTypes.number.isRequired,
  hasCatchWeight: PropTypes.bool,
  unit: PropTypes.string,
};

CartItemsCount.defaultProps = {
  unit: null,
  hasCatchWeight: false,
};

export default connect(CartItemsCount);
