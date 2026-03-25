import React from 'react';
import PropTypes from 'prop-types';
import { FocusTrap } from '@shopgate/engage/a11y/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import Title from './components/Title';
import Content from './components/Content';
import Buttons from './components/Buttons';

const outerGap = 40;

const useStyles = makeStyles()({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100vw - ${outerGap * 2}px)`,
    maxHeight: `calc(100vh - ${outerGap * 2}px)`,
    borderRadius: 2,
    boxShadow: themeConfig.shadows.dialog,
    background: themeConfig.colors.light,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      width: `calc(80vh - ${outerGap * 2}px)`,
      maxHeight: `calc(80vh - ${outerGap * 2}px)`,
    },
    [responsiveMediaQuery('>md', { webOnly: true })]: {
      width: `calc(var(--page-content-width) * 0.5 - ${outerGap * 2}px)`,
      maxHeight: `calc(var(--page-content-width) * 0.5 - ${outerGap * 2}px)`,
    },
  },
  content: {
    padding: themeConfig.variables.gap.small * 3,
    overflowY: 'auto',
  },
  actions: {
    alignSelf: 'flex-end',
    padding: themeConfig.variables.gap.small,
  },
  innerActions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
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
  const { classes } = useStyles();

  return (
    <FocusTrap>
      <div
        className={`${classes.container} ui-material__base-dialog`}
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
          <div className={classes.innerActions}>
            <Buttons actions={actions} />
          </div>
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
