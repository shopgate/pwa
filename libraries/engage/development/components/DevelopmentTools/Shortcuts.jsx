import { useSelector, useDispatch } from 'react-redux';
import { toggleInsets } from '@shopgate/engage/development/action-creators';
import { getAreSimulatedInsetsInjected } from '@shopgate/engage/development/selectors';
import { useShortcut } from './hooks';

/**
 * The Shortcuts component maps shortcuts to actions in development mode.
 * @returns {JSX.Element}
 */
const Shortcuts = () => {
  const dispatch = useDispatch();
  const areInsetsInjected = useSelector(getAreSimulatedInsetsInjected);

  useShortcut('ctrl+i', () => {
    dispatch(toggleInsets(!areInsetsInjected));
  });

  return null;
};

export default Shortcuts;
