import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Card, TextLink } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';

const { colors, variables } = themeConfig;
const useStyles = makeStyles()({
  wrapper: {
    padding: `${variables.gap.bigger}px ${variables.gap.big}px 0 ${variables.gap.big}px`,
  },
  headline: {
    color: colors.shade3,
    fontSize: '1rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    paddingBottom: variables.gap.small,
    margin: 0,
    ...(!isIOSTheme() ? {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      fontWeight: 500,
      color: 'var(--color-text-high-emphasis)',
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
    padding: variables.gap.big,
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
    color: 'var(--color-text-high-emphasis)',
    ':not(:first-child)': {
      paddingTop: variables.gap.xsmall * 3,
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
    color: 'var(--color-text-high-emphasis)',
    ' td': {
      padding: `${variables.gap.xsmall}px 0`,
    },
    ' td:last-child': {
      textAlign: 'right',
      whiteSpace: 'pre-wrap',
      paddingLeft: variables.gap.xsmall,
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
  },
});

/**
 * CheckoutConfirmationSegment component
 * @returns {JSX}
 */
const CheckoutConfirmationSegment = ({
  title, content, children, hasForm, isSummary, className,
}) => {
  const { classes } = useStyles();

  if (!content) {
    return null;
  }

  const isString = typeof content === 'string';

  return (
    <div className={classNames(classes.wrapper, className)}>
      <h3 className={classes.headline}>{i18n.text(title)}</h3>
      <Card className={classNames(classes.card, {
        [classes.cardWithForm]: hasForm,
      })}
      >
        {isString && (<span>{content}</span>)}
        {!isString && !isSummary && (
          <dl className={classes.list}>
            {content.map(({ label, text, link }) => (
              <Fragment key={label || text}>
                { label && (
                  <dt className={classes.listTitle}>{i18n.text(label)}</dt>
                )}
                { link ? (
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
                { label && (
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
