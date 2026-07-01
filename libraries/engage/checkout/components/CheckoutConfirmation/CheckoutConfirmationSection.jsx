import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, TextLink, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core/helpers/i18n';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    padding: theme.spacing(2.5, 2, 0, 2),
  },
  headline: {
    color: theme.palette.grey.medium,
    paddingBottom: theme.spacing(1),
    margin: 0,
  },
  link: {
    color: `${theme.palette.primary.main} !important`,
  },
  card: {
    lineHeight: '1.25rem',
    margin: 0,
    padding: theme.spacing(2),
    flex: '1 0 auto',
  },
  list: {
    margin: 0,
  },
  listTitle: {
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    ':not(:first-of-type)': {
      paddingTop: theme.spacing(1.5),
    },
  },
  listEntry: {
    marginLeft: 0,
    whiteSpace: 'pre-line',
    wordBreak: 'break-all',
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
      paddingTop: 8,
      borderTop: `1px solid ${theme.components.border.medium}`,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));

/**
 * CheckoutConfirmationSegment component
 * @returns {JSX}
 */
const CheckoutConfirmationSegment = ({
  title, content, children, isSummary, className,
}) => {
  const { classes, cx } = useStyles();

  if (!content) {
    return null;
  }

  const isString = typeof content === 'string';

  /* eslint-disable react/no-danger */
  return (
    <div className={cx(classes.wrapper, className)}>
      <Typography
        component="h3"
        className={classes.headline}
      >
        {i18n.text(title)}
      </Typography>
      <Card className={classes.card}>
        {isString && (
          <Typography variant="body2" component="span" color="textSecondary">
            {content}
          </Typography>
        )}
        {!isString && !isSummary && (
          <dl className={classes.list}>
            {content.map(({ label, text, link }) => (
              <Fragment key={label || text}>
                {label && (
                <Typography variant="caption" component="dt" color="textPrimary" fontWeight="bold" className={classes.listTitle}>
                  {i18n.text(label)}
                </Typography>
                )}
                {link ? (
                  <Typography variant="body2" component="dd" color="textSecondary" className={classes.listEntry}>
                    <TextLink href={link} className={classes.link}>
                      <span dangerouslySetInnerHTML={{ __html: text }} />
                    </TextLink>
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    component="dd"
                    color="textSecondary"
                    className={classes.listEntry}
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                )}
              </Fragment>
            ))}
          </dl>
        )}
        {children}
        {isSummary && (
          <table className={classes.table}>
            <tbody>
              {content.map(({ label, text }, index) => {
                const isLastRow = index === content.length - 1;

                return (
                  <tr key={label || text}>
                    {label && (
                    <Typography
                      variant={isLastRow ? 'body1' : 'body2'}
                      component="td"
                    >
                      {i18n.text(label)}
                    </Typography>
                    )}
                    <Typography
                      variant={isLastRow ? 'body1' : 'body2'}
                      component="td"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </tr>
                );
              })}
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
  isSummary: PropTypes.bool,
};

CheckoutConfirmationSegment.defaultProps = {
  children: null,
  content: null,
  isSummary: false,
  className: null,
};

export default CheckoutConfirmationSegment;
