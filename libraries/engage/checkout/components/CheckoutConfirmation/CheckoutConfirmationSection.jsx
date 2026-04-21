import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, TextLink } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';

const { colors } = themeConfig;
const useStyles = makeStyles()(theme => ({
  wrapper: {
    padding: theme.spacing(2.5, 2, 0, 2),
  },
  headline: {
    color: colors.shade3,
    fontSize: '1rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(1),
    margin: 0,
    ...(!isIOSTheme() ? {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      fontWeight: 500,
      color: theme.palette.text.primary,
      textTransform: 'none',
    } : {}),
  },
  link: {
    color: 'var(--color-primary) !important',
  },
  card: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    margin: 0,
    padding: theme.spacing(2),
    color: 'var(--color-text-medium-emphasis)',
    flex: '1 0 auto',
    ...(!isIOSTheme() ? {
      background: 'var(--color-background-accent)',
      boxShadow: 'none',
    } : {}),
  },
  cardWithForm: {
    ...(!isIOSTheme() ? {
      background: 'inherit',
      boxShadow: 'none',
      padding: 0,
    } : {}),
  },
  list: {
    margin: 0,
  },
  listTitle: {
    fontSize: '0.625rem',
    lineHeight: '1rem',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: theme.palette.text.primary,
    ':not(:first-of-type)': {
      paddingTop: theme.spacing(1.5),
    },
  },
  listEntry: {
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    marginLeft: 0,
    whiteSpace: 'pre-line',
    wordBreak: 'break-all',
    color: 'var(--color-text-medium-emphasis)',
  },
  table: {
    color: theme.palette.text.primary,
    ' td': {
      padding: theme.spacing(0.5, 0),
    },
    ' td:last-of-type': {
      textAlign: 'right',
      whiteSpace: 'pre-wrap',
      paddingLeft: theme.spacing(0.5),
    },
    ' tr:nth-last-of-type(2) td': {
      paddingBottom: 8,
    },
    ' tr:last-of-type td': {
      fontSize: '1rem',
      paddingTop: 8,
      borderTop: '1px solid #979797',
      fontWeight: 'bold',
    },
  },
}));

/**
 * CheckoutConfirmationSegment component
 * @returns {JSX}
 */
const CheckoutConfirmationSegment = ({
  title, content, children, hasForm, isSummary, className,
}) => {
  const { classes, cx } = useStyles();

  if (!content) {
    return null;
  }

  const isString = typeof content === 'string';

  /* eslint-disable react/no-danger */
  return (
    <div className={cx(classes.wrapper, className)}>
      <h3 className={classes.headline}>{i18n.text(title)}</h3>
      <Card className={cx(classes.card, {
        [classes.cardWithForm]: hasForm,
      })}
      >
        {isString && (<span>{content}</span>)}
        {!isString && !isSummary && (
          <dl className={classes.list}>
            {content.map(({ label, text, link }) => (
              <Fragment key={label || text}>
                {label && (
                  <dt className={classes.listTitle}>{i18n.text(label)}</dt>
                )}
                {link ? (
                  <dd className={classes.listEntry}>
                    <TextLink href={link} className={classes.link}>
                      <span dangerouslySetInnerHTML={{ __html: text }} />
                    </TextLink>
                  </dd>
                ) : (
                  <dd className={classes.listEntry} dangerouslySetInnerHTML={{ __html: text }} />
                )}
              </Fragment>
            ))}
          </dl>
        )}
        {children}
        {isSummary && (
          <table className={classes.table}>
            <tbody>
              {content.map(({ label, text }) => (
                <tr key={label || text}>
                  {label && (
                    <td>{i18n.text(label)}</td>
                  )}
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <td dangerouslySetInnerHTML={{ __html: text }} />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

/* eslint-enable react/no-danger */

CheckoutConfirmationSegment.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.string,
  ]),
  hasForm: PropTypes.bool,
  isSummary: PropTypes.bool,
};

CheckoutConfirmationSegment.defaultProps = {
  children: null,
  content: null,
  hasForm: false,
  isSummary: false,
  className: null,
};

export default CheckoutConfirmationSegment;
