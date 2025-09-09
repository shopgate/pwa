import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { SheetDrawer, RippleButton } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { getIsCMS2PreviewEnabled } from '../../selectors';
import { toggleCms2Preview } from '../../action-creators';

const useStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    fontWeight: 'normal',
  },
}));

/**
 * Development settings component.
 * @param {Object} props The component props.
 * @param {boolean} props.isOpen Whether the drawer is open.
 * @param {Function} props.onClose The function to call when the drawer should be closed.
 * @returns {JSX.Element}
 */
const DevelopmentSettings = ({
  isOpen,
  onClose,
}) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const isCMS2PreviewEnabled = useSelector(getIsCMS2PreviewEnabled);

  return (
    <SheetDrawer
      title=" "
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.container}>
        <RippleButton
          className={classes.button}
          type="simple"
          onClick={() => {
            onClose();
            setTimeout(() => {
              dispatch(toggleCms2Preview(!isCMS2PreviewEnabled));
            }, 300);
          }}
        >
          { `${isCMS2PreviewEnabled ? 'Disable' : 'Enable'} CMS 2.0 Preview`}
        </RippleButton>
      </div>
    </SheetDrawer>
  );
};

DevelopmentSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DevelopmentSettings;
