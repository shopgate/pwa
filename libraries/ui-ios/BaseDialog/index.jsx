import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Title from './components/Title';
import Content from './components/Content';
import Buttons from './components/Buttons';
import styles from './style';

/**
 * This component renders a basic dialog in Google Material Design.
 * @param {Object} children The component children to render in the dialog.
 * @param {Object[]} actions The dialog actions.
 * @param {string} actions.label The label of the action.
 * @param {Function} actions.action The callback to invoke when the action is triggered.
 * @param {string|ReactElement} title The title of the dialog.
 * @return {JSX} The rendered dialog.
 */
const BasicDialog = memo(({ children, actions, title }) => (
  <div
    className={styles.container}
    data-test-id="basicDialog"
    role="alertdialog"
    aria-modal
    aria-labelledby="basicDialogTitle basicDialogDesc"
  >
    <div className={styles.content}>
      <Title title={title} />
      <Content content={children} />
    </div>
    <div className={styles.actions}>
      <Buttons actions={actions} />
    </div>
  </div>
));

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
