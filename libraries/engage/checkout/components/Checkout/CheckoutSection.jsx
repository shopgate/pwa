import React, { Fragment } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { Card } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '../../../core/helpers/i18n';

const { colors, variables } = themeConfig;
const styles = {
  headline: css({
    color: colors.shade3,
    fontSize: '1rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    margin: `0 0 ${variables.gap.small}px 0`,
  }),
  card: css({
    fontSize: 15,
    margin: 0,
    padding: variables.gap.big,
    display: 'table',
    width: '100%',
  }),
  table: css({
    ' td:last-child': {
      textAlign: 'right',
      whiteSpace: 'pre-wrap',
    },
  }),
};

/**
 * CheckoutSection component
 * @returns {JSX}
 */
const CheckoutSection = ({
  title, className, content, children,
}) => (
  <Fragment>
    <h3 className={styles.headline}>{i18n.text(title)}</h3>
    <Card className={`${styles.card.toString()} ${className}`}>
      {children || null}
      {!children && (
        <table className={styles.table}>
          <tbody>
            {content.map(({ label, text }) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  </Fragment>
);

CheckoutSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape()),
};

CheckoutSection.defaultProps = {
  className: '',
  children: null,
  content: null,
};

export default CheckoutSection;
