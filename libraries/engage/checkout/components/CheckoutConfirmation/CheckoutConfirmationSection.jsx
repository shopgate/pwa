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
    margin: `${variables.gap.big * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.small}px ${variables.gap.small * 1.5}px`,
    ...(!isIOSTheme() ? {
      fontSize: '1.25rem',
      color: colors.dark,
      textTransform: 'none',
    } : {}),
  }),
  card: css({
    fontSize: 15,
    margin: `0 ${variables.gap.small * 1.5}px`,
    padding: variables.gap.big,
    display: 'table',
    width: 'calc(100% - 24px)',
    ...(!isIOSTheme() ? {
      background: colors.shade8,
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
  }),
};

/**
 * CheckoutConfirmationSegment component
 * @returns {JSX}
 */
const CheckoutConfirmationSegment = ({ title, content, hasForm }) => {
  if (!content) {
    return null;
  }

  const isString = typeof content === 'string';

  return (
    <Fragment>
      <h3 className={styles.headline}>{i18n.text(title)}</h3>
      <Card className={`${hasForm && styles.cardWithForm.toString()} ${styles.card.toString()}`}>
        {isString && (<span>{content}</span>)}
        {!isString && (
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
};

CheckoutConfirmationSegment.defaultProps = {
  content: null,
  hasForm: false,
};

export default CheckoutConfirmationSegment;
