import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Link, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import CheckoutSectionInfo from './CheckoutSectionInfo';
import CheckoutSectionMessages from './CheckoutSectionMessages';
import { i18n } from '../../../core/helpers/i18n';

const useStyles = makeStyles()(theme => ({
  headline: {
    margin: theme.spacing(0, 0, 1, 0),
    textTransform: 'none',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: theme.typography.body1.fontSize,
    width: '100%',
    overflow: 'inherit !important',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    background: theme.palette.background.emphasized,
    padding: theme.spacing(1, 2),
    margin: 0,
  },
  cardWithForm: {
    background: 'inherit !important',
    boxShadow: 'none !important',
    padding: '0px !important',
  },
  table: {
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
  actionsContainer: {
    flex: 1,
    display: 'table',
    width: '100%',
  },
  link: {
    textTransform: 'uppercase',
  },
  actions: {
    paddingTop: 8,
  },
  labelWithInfoIcon: {
    paddingRight: theme.spacing(1),
  },
}));

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
  id,
}) => {
  const { classes, cx } = useStyles();

  return (
    <>
      { title && (
        <Typography variant="h3" color="textPrimary" fontWeight="regular" className={classes.headline} id={id}>
          {i18n.text(title)}
        </Typography>
      )}
      <Card
        className={cx(classes.card, {
          [classes.cardWithForm]: hasForm,
        })}
        id={!title ? id : null}
      >
        <div className={cx(classes.actionsContainer, className)}>
          {children || null}
          {content && (
            <table className={classes.table}>
              <tbody>
                {content.map(({
                  label, text, info, messages,
                }) => {
                  const hasMessages = Array.isArray(messages) && messages.length > 0;
                  let hasError = false;

                  if (hasMessages) {
                    hasError = !!messages.find(({ type }) => type === 'error');
                  }

                  return (
                    <Fragment key={label}>
                      <tr>
                        <td>
                          <Typography
                            component="span"
                            className={cx({
                              [classes.labelWithInfoIcon]: !!info,
                            })}
                          >
                            {label}
                          </Typography>
                          { !hasError && (
                          <CheckoutSectionInfo text={info} />
                          )}
                        </td>
                        <td>
                          {typeof text === 'string'
                            ? <Typography component="span">{text}</Typography>
                            : text}
                        </td>
                      </tr>
                      { hasMessages && (
                        <tr>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: 'left',
                              paddingLeft: 0,
                            }}
                          >
                            <CheckoutSectionMessages messages={messages} />
                            { hasError && (
                            <CheckoutSectionInfo text={info} renderIcon={false} />
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>

                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {editLink ? (
          <div className={classes.actions}>
            <Link
              tag="a"
              className={classes.link}
              href={editLink}
            >
              <Typography variant="body2" component="span" color="primary">{i18n.text(editLabel)}</Typography>
            </Link>
          </div>
        ) : null}
      </Card>
    </>
  );
};

CheckoutSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape()),
  editLabel: PropTypes.string,
  editLink: PropTypes.string,
  hasForm: PropTypes.bool,
  id: PropTypes.string,
  title: PropTypes.string,
};

CheckoutSection.defaultProps = {
  title: null,
  className: '',
  children: null,
  content: null,
  hasForm: false,
  editLink: null,
  editLabel: 'checkout.billing.edit',
  id: null,
};

export default CheckoutSection;
