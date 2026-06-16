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
    lineHeight: '1.5rem',
  },
  link: {
    color: `${theme.palette.primary.main} !important`,
  },
  card: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    margin: 0,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    flex: '1 0 auto',
    background: theme.palette.background.emphasized,
    boxShadow: 'none',
  },
  cardWithForm: {
    background: 'inherit',
    boxShadow: 'none',
    padding: 0,
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
    lineHeight: '1.5rem',
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
      fontSize: '1rem',
      paddingTop: 8,
      borderTop: `1px solid ${theme.components.border.medium}`,
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
      <Typography
        variant="body1"
        component="h3"
        color="textPrimary"
        className={classes.headline}
      >
        {i18n.text(title)}
      </Typography>
      <Card className={cx(classes.card, {
        [classes.cardWithForm]: hasForm,
      })}
      >
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
                  <dt className={classes.listTitle}>{i18n.text(label)}</dt>
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
