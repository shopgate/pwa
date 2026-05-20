import React from 'react';
import PropTypes from 'prop-types';
import { FocusTrap } from '@shopgate/engage/a11y/components';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import Title from './components/Title';
import Content from './components/Content';
import Buttons from './components/Buttons';

const outerGap = 40;
const borderColor = 'rgba(0,0,0,0.2)';

const useStyles = makeStyles()({
  container: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: 270,
    maxHeight: `calc(100vh - ${outerGap * 2}px)`,
    borderRadius: 14,
    background: themeColors.lightTransparent,
    backdropFilter: 'blur(20px)',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    borderTop: `0.5px solid ${borderColor}`,
    display: 'flex',
    flexWrap: 'wrap',
  },
});

/**
 * This component renders a basic dialog in Google Material Design.
 * @param {Object} props The component props.
 * @param {ReactNode} props.children The component children to render in the dialog.
 * @param {Array<{label: string, action: Function}>} props.actions The dialog actions:
 * the label and the callback to invoke when the action is triggered
 * @param {string | ReactNode} props.title The title of the dialog.
 * @return {JSX.Element} The rendered dialog.
 */
const BasicDialog = ({ children, actions, title }) => {
  const { classes, cx } = useStyles();

  return (
    <FocusTrap>
      <div
        className={cx(classes.container, 'ui-ios__base-dialog')}
        data-test-id="basicDialog"
        role="alertdialog"
        aria-modal
        aria-labelledby="basicDialogTitle basicDialogDesc"
      >
        <div className={classes.content}>
          <Title title={title} />
          <Content content={children} />
        </div>
        <div className={classes.actions}>
          <Buttons actions={actions} />
        </div>
      </div>
    </FocusTrap>
  );
};

BasicDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  })),
  children: PropTypes.node,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

BasicDialog.defaultProps = {
  children: null,
  actions: [],
  title: null,
};

export default BasicDialog;
