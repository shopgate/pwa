import React, { Fragment } from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Card, Link } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CheckoutSectionInfo from './CheckoutSectionInfo';
import CheckoutSectionMessages from './CheckoutSectionMessages';
import { i18n } from '../../../core/helpers/i18n';

const { variables } = themeConfig;

const styles = {
  headline: css({
    fontSize: '1.25rem',
    fontWeight: 'normal',
    margin: `0 0 ${variables.gap.small}px 0`,
    color: 'var(--color-text-high-emphasis)',
    textTransform: 'none',
  }),
  card: css({
    display: 'flex',
    flexDirection: 'row',
    fontSize: 15,
    width: '100%',
    overflow: 'inherit !important',
    marginBottom: variables.gap.big,
    boxShadow: 'none',
    background: 'var(--color-background-accent)',
    padding: `${variables.gap.small}px ${variables.gap.big}px`,
    margin: 0,
  }),
  cardWithForm: css({
    background: 'inherit !important',
    boxShadow: 'none  !important',
    padding: '0px !important',
  }).toString(),
  table: css({
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
  labelWithInfoIcon: css({
    paddingRight: variables.gap.small,
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
  id,
}) => (
  <Fragment>
    { title && (
      <h3 className={styles.headline} id={id}>{i18n.text(title)}</h3>
    )}
    <Card
      className={classNames(styles.card.toString(), {
        [styles.cardWithForm.toString()]: hasForm,
      })
      }
      id={!title ? id : null}
    >
      <div className={`${styles.actionsContainer} ${className}`}>
        {children || null}
        {content && (
          <table className={styles.table}>
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
                        {(
                          <Fragment>
                            <span className={classNames({
                              [styles.labelWithInfoIcon]: !!info,
                            })}
                            >
                              {label}
                            </span>
                            { !hasError && (
                            <CheckoutSectionInfo text={info} />
                            )}
                          </Fragment>
                      )}
                      </td>
                      <td>{text}</td>
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
