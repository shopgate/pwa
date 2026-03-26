import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Color from 'color';
import { makeStyles, responsiveMediaQuery, getCSSCustomProp } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { i18n, errorBehavior } from '@shopgate/engage/core/helpers';
import StopIcon from '@shopgate/pwa-ui-shared/icons/StopIcon';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import WarningIcon from '@shopgate/pwa-ui-shared/icons/WarningIcon';

const iconMapping = {
  info: InfoIcon,
  warning: WarningIcon,
  error: StopIcon,
};

/**
 * @param {string} sourceColor Source color.
 * @param {string} [textColor] Optional text color.
 * @returns {{ background: string, color: string, borderColor: string }}
 */
const getMessageColors = (sourceColor, textColor) => ({
  background: Color(sourceColor).fade(0.9).toString(),
  color: textColor || 'var(--color-text-height-emphasis)',
  borderColor: sourceColor,
});

const useStyles = makeStyles()((theme, { secondaryColor }) => {
  const containerBase = {
    background: themeColors.background,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontWeight: 'normal',
      border: 'none',
      borderRadius: 'inherit',
      margin: theme.spacing(2),
      boxShadow: 'none',
      background: 'none',
    },
  };

  const messageBase = {
    padding: theme.spacing(2, 2),
    fontSize: '0.875rem',
    lineHeight: 1.3,
    fontWeight: 500,
    ':not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
    ' > svg': {
      fontSize: '1.5rem !important',
    },
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: theme.spacing(1.5, 2),
      fontWeight: 'normal',
      border: '1px solid',
      borderRadius: 4,
      ':not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
  };

  return {
    container: {
      ...containerBase,
    },
    containerRaised: {
      ...containerBase,
      borderRadius: '0 0 5px 5px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      zIndex: 10,
    },
    // eslint-disable-next-line tss-unused-classes/unused-classes
    info: {
      ...messageBase,
      background: 'var(--color-secondary)',
      color: 'var(--color-secondary-contrast)',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(secondaryColor || themeColors.secondary || '#000'),
        ' > svg': {
          color: 'var(--color-secondary)',
        },
      },
    },
    // eslint-disable-next-line tss-unused-classes/unused-classes
    error: {
      ...messageBase,
      background: themeColors.error,
      color: themeColors.light,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(themeColors.error),
        ' > svg': {
          color: themeColors.error,
        },
      },
    },
    // eslint-disable-next-line tss-unused-classes/unused-classes
    warning: {
      ...messageBase,
      background: themeColors.warning,
      color: themeColors.light,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(themeColors.warning),
        ' > svg': {
          color: themeColors.warning,
        },
      },
    },
    withIcon: {
      display: 'flex',
      minWidth: '100%',
      alignItems: 'center',
    },
    icon: {
      flexGrow: 0,
      flexShrink: 0,
    },
    messageToIcon: {
      flexGrow: 1,
      paddingLeft: theme.spacing(2),
    },
  };
});

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @property {Array} props.messages The message content.
 * @property {Object} props.classNames Styling.
 * @property {boolean} props.raised whether to use specific styling.
 * @property {boolean} props.showIcons whether to show icons.
 * @return {JSX.Element}
 */
const MessageBar = ({
  messages, classNames, raised, showIcons,
}) => {
  const secondaryColor = getCSSCustomProp('--color-secondary');
  const { classes } = useStyles({ secondaryColor });
  const containerClass = React.useMemo(() => {
    if (raised) {
      return classnames(classes.containerRaised, classNames.containerRaised);
    }

    return classnames(classes.container, classNames.container);
  }, [classNames.container, classNames.containerRaised, raised,
    classes.container, classes.containerRaised]);

  return (
    <div
      className={containerClass}
      role={messages.length > 0 ? 'alert' : null}
    >
      {messages.map((item) => {
        const {
          type = 'info',
          message,
          messageParams = null,
          additionalParams = null,
          translated = false,
        } = item;

        let { icon: Icon = null } = item;

        if (Icon === null && showIcons) {
          Icon = iconMapping[type];
        }

        const messageOutput = !translated
          ? errorBehavior.getErrorMessage(message, messageParams || additionalParams)
          : message;

        return (
          <div
            key={`${type}-${message}`}
            className={classnames(
              (classes[type] || null),
              classNames.message,
              Icon ? classes.withIcon : null
            )}
            aria-live="assertive"
            aria-atomic="true"
          >
            {Icon && (
              <Icon className={classnames(classNames.icon, classes.icon)} />
            )}
            <span className="sr-only">
              {`${i18n.text(`cart.message_type_${type}`)}: ${messageOutput}`}
            </span>
            <span aria-hidden className={Icon ? classes.messageToIcon : null}>
              {messageOutput}
            </span>
          </div>
        );
      })}
    </div>
  );
};

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.string,
    containerRaised: PropTypes.string,
    message: PropTypes.string,
    icon: PropTypes.string,
  }),
  raised: PropTypes.bool,
  showIcons: PropTypes.bool,
};

MessageBar.defaultProps = {
  classNames: {
    container: null,
    containerRaised: null,
    message: null,
    icon: null,
  },
  raised: false,
  showIcons: false,
};

export default React.memo(MessageBar);
