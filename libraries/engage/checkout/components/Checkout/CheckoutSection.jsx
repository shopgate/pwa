import React, { Fragment } from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Card, Link } from '@shopgate/engage/components';
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
    display: 'flex',
    flexDirection: 'row',
    fontSize: 15,
    margin: `0 0 ${variables.gap.xbig}px`,
    padding: variables.gap.big,
    width: '100%',
    ...(!isIOSTheme() ? {
      background: 'var(--color-background-accent)',
      boxShadow: 'none',
      padding: `${variables.gap.small}px ${variables.gap.big}px`,
      margin: 0,
    } : {}),
  }),
  cardWithForm: css({
    ...(!isIOSTheme() ? {
      background: 'inherit !important',
      boxShadow: 'none  !important',
      padding: '0px !important',
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
  actionsContainer: css({
    flex: 1,
    display: 'table',
    width: '100%',
  }).toString(),
  link: css({
    fontSize: '0.875rem',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
  }).toString(),
  actions: css({
    paddingTop: 8,
  }).toString(),
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
  editLink,
  editLabel,
}) => (
  <Fragment>
    <h3 className={styles.headline}>{i18n.text(title)}</h3>
    <Card
      className={classNames(styles.card.toString(), {
        [styles.cardWithForm.toString()]: hasForm,
      })
      }
    >
      <div className={`${styles.actionsContainer} ${className}`}>
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
      </div>
      {editLink ? (
        <div className={styles.actions}>
          <Link
            tag="a"
            className={styles.link}
            href={editLink}
          >
            {i18n.text(editLabel)}
          </Link>
        </div>
      ) : null}
    </Card>
  </Fragment>
);

CheckoutSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape()),
  editLabel: PropTypes.string,
  editLink: PropTypes.string,
  hasForm: PropTypes.bool,
};

CheckoutSection.defaultProps = {
  className: '',
  children: null,
  content: null,
  hasForm: false,
  editLink: null,
  editLabel: 'checkout.billing.edit',
};

export default CheckoutSection;
