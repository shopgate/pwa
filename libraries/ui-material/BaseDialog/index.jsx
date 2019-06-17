import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
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
const BasicDialog = ({ children, actions, title }) => (
  <div className={styles.container} data-test-id="basicDialog">
    <div className={styles.content}>
      {title && ( // Render the title if required.
        <div className={styles.title}>
          <Ellipsis rows={3}>
            {
              typeof title === 'string'
              ? <I18n.Text string={title} />
              : title
            }
          </Ellipsis>
        </div>
      )}
      {children && ( // Render the children.
        <div className={styles.body}>
          {children}
        </div>
      )}
    </div>
    <div className={styles.actions}>
      <div className={styles.innerActions}>
        {actions.map(({ label, action }) => ( // Create buttons for each action passed.
          <Button key={label} className={styles.button} flat type="primary" onClick={action}>
            <I18n.Text string={label} />
          </Button>
        ))}
      </div>
    </div>
  </div>
);

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
