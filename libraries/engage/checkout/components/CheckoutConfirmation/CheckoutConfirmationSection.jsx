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
    fontSize: '1rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    margin: `${variables.gap.bigger}px ${variables.gap.big}px ${variables.gap.small}px ${variables.gap.big}px`,
    ...(!isIOSTheme() ? {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      fontWeight: 500,
      color: 'var(--color-text-high-emphasis)',
      textTransform: 'none',
    } : {}),
  }),
  card: css({
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    margin: `0 ${variables.gap.big}px 0 ${variables.gap.big}px`,
    padding: variables.gap.big,
    color: 'var(--color-text-medium-emphasis)',
    ...(!isIOSTheme() ? {
      background: 'var(--color-background-accent)',
      boxShadow: 'none',
    } : {}),
  }),
  cardWithForm: css({
    ...(!isIOSTheme() ? {
      background: 'inherit',
      boxShadow: 'none',
      padding: 0,
    } : {}),
  }).toString(),
  list: css({
    margin: 0,
  }),
  listTitle: css({
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--color-text-high-emphasis)',
    ':not(:first-child)': {
      paddingTop: variables.gap.xsmall * 3,
    },
  }),
  listEntry: css({
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    marginLeft: 0,
    whiteSpace: 'pre-line',
    wordBreak: 'break-all',
    color: 'var(--color-text-medium-emphasis)',
  }),
  table: css({
    lineHeight: '1.75rem',
    color: 'var(--color-text-high-emphasis)',
    ' td:last-child': {
      textAlign: 'right',
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
    ' tr:nth-last-child(2) td': {
      paddingBottom: 8,
    },
    ' tr:last-child td': {
      fontSize: '1rem',
      paddingTop: 8,
      borderTop: '1px solid #979797',
      fontWeight: 'bold',
    },
  }),
};

/**
 * CheckoutConfirmationSegment component
 * @returns {JSX}
 */
const CheckoutConfirmationSegment = ({
  title, content, hasForm, isSummary,
}) => {
  if (!content) {
    return null;
  }

  const isString = typeof content === 'string';

  return (
    <Fragment>
      <h3 className={styles.headline}>{i18n.text(title)}</h3>
      <Card className={`${hasForm && styles.cardWithForm.toString()} ${styles.card.toString()}`}>
        {isString && (<span>{content}</span>)}
        {!isString && !isSummary && (
          <dl className={styles.list}>
            {content.map(({ label, text }) => (
              <Fragment key={label}>
                <dt className={styles.listTitle}>{label}</dt>
                <dd className={styles.listEntry}>{text}</dd>
              </Fragment>
            ))}
          </dl>
        )}
        {isSummary && (
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
};

CheckoutConfirmationSegment.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.string,
  ]),
  hasForm: PropTypes.bool,
  isSummary: PropTypes.bool,
};

CheckoutConfirmationSegment.defaultProps = {
  content: null,
  hasForm: false,
  isSummary: false,
};

export default CheckoutConfirmationSegment;
