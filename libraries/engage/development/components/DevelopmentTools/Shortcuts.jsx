import { useSelector, useDispatch } from 'react-redux';
import { toggleInsets } from '@shopgate/engage/development/action-creators';
import { getAreInsetsVisible } from '@shopgate/engage/development/selectors';
import { useShortcut } from './hooks';

/**
 * The Shortcuts component maps shortcuts to actions in development mode.
 * @returns {JSX.Element}
 */
const Shortcuts = () => {
  const dispatch = useDispatch();
  const areInsetsVisible = useSelector(getAreInsetsVisible);

  useShortcut('cmd+i', () => {
    dispatch(toggleInsets(!areInsetsVisible));
  });

  return null;
};

export default Shortcuts;
