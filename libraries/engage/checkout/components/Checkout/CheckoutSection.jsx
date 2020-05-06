import React, { Fragment } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { Card } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';

const { colors, variables } = themeConfig;

const styles = {
  headline: css({
    color: colors.shade3,
    fontSize: '1.25rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    margin: `0 0 ${variables.gap.small}px 0`,
    ...(!isIOSTheme() ? {
      color: 'var(--color-text-high-emphasis)',
      textTransform: 'none',
    } : {}),
  }),
  card: css({
    fontSize: 15,
    margin: 0,
    padding: variables.gap.big,
    display: 'table',
    width: '100%',
    ...(!isIOSTheme() ? {
      background: 'var(--color-background-accent)',
      boxShadow: 'none',
      padding: `${variables.gap.small}px ${variables.gap.big}px`,
    } : {}),
  }),
  cardWithForm: css({
    ...(!isIOSTheme() ? {
      background: 'inherit',
      boxShadow: 'none',
      padding: 0,
    } : {}),
  }).toString(),
  table: css({
    ' td:last-child': {
      textAlign: 'right',
      whiteSpace: 'pre-wrap',
    },
    ' tr:nth-last-child(2) td': {
      paddingBottom: 8,
    },
    ' tr:last-child td': {
      paddingTop: 8,
      borderTop: '1px solid #979797',
      fontWeight: '600',
    },
  }),
};

/**
 * CheckoutSection component
 * @returns {JSX}
 */
const CheckoutSection = ({
  title,
  className,
  content,
  children,
  hasForm,
}) => (
  <Fragment>
    <h3 className={styles.headline}>{i18n.text(title)}</h3>
    <Card
      className={`${hasForm && styles.cardWithForm.toString()} ${styles.card.toString()} ${className}`}
    >
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
  hasForm: PropTypes.bool,
};

CheckoutSection.defaultProps = {
  className: '',
  children: null,
  content: null,
  hasForm: false,
};

export default CheckoutSection;
