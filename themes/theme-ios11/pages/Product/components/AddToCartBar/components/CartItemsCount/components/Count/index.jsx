import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

export const duration = 200;

export const transition = {
  entering: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  entered: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  exited: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
  },
  exiting: {
    opacity: 0,
    transform: 'translate3d(0, 100%, 0)',
    transition: 'transform 50ms linear',
  },
};

const useStyles = makeStyles()(() => ({
  container: {
    transition: `transform ${duration}ms cubic-bezier(0.07,0.29,0.31,1.34), opacity ${duration}ms linear`,
  },
}));

/**
 * Reducer for transition visibility vs displayed item count.
 * @param {Object} state Current state with `in` and `numItems`.
 * @param {Object} action Dispatched action with `type` and optional `count`.
 * @returns {Object} Next state.
 */
const reducer = (state, action) => {
  if (action.type === 'countChanged') {
    return {
      ...state,
      in: false,
      numItems: action.count,
    };
  }
  if (action.type === 'exited') {
    return {
      ...state,
      in: true,
    };
  }
  return state;
};

/**
 * Count component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Count = ({ count, hasCatchWeight, unit }) => {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    in: true,
    numItems: count,
  });

  useEffect(() => {
    if (count !== state.numItems) {
      dispatch({
        type: 'countChanged',
        count,
      });
    }
  }, [count, state.numItems]);

  const handleOnExited = useCallback(() => {
    dispatch({ type: 'exited' });
  }, []);

  return (
    <Transition
      in={state.in}
      onExited={handleOnExited}
      timeout={state.in ? duration : 0}
    >
      {transitionStatus => (
        <div className={classes.container} style={transition[transitionStatus]}>
          {((unit && hasCatchWeight) || false) ? (
            <I18n.Text
              string="product.item_added_unit"
              params={{
                unit,
                count: state.numItems,
              }}
            />
          ) : (
            <I18n.Text
              string="product.item_added"
              params={{
                count: state.numItems,
              }}
            />
          )}
        </div>
      )}
    </Transition>
  );
};

Count.propTypes = {
  count: PropTypes.number.isRequired,
  hasCatchWeight: PropTypes.bool,
  unit: PropTypes.string,
};

Count.defaultProps = {
  unit: null,
  hasCatchWeight: false,
};

export default Count;
