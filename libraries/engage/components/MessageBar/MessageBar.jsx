import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { i18n, errorBehavior } from '@shopgate/engage/core/helpers';
import StopIcon from '@shopgate/pwa-ui-shared/icons/StopIcon';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import WarningIcon from '@shopgate/pwa-ui-shared/icons/WarningIcon';

const iconMapping = {
  info: InfoIcon,
  warning: WarningIcon,
  error: StopIcon,
};

const useStyles = makeStyles()((theme) => {
  /**
   * @param {string} sourceColor Source color.
   * @param {string} [textColor] Optional text color.
   * @returns {{ background: string, color: string, borderColor: string }}
   */
  const getMessageColors = (sourceColor, textColor) => ({
    background: theme.alpha(sourceColor, 0.1),
    color: textColor || theme.palette.text.primary,
    borderColor: `${sourceColor}!important`,
  });

  const containerBase = {
    background: theme.palette.background.emphasized,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontWeight: theme.typography.fontWeightRegular,
      border: 'none',
      borderRadius: 'inherit',
      margin: theme.spacing(2),
      boxShadow: 'none',
      background: 'none',
    },
  };

  const messageBase = {
    padding: theme.spacing(2, 2),
    lineHeight: 1.3,
    fontWeight: theme.typography.fontWeightMedium,
    ':not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
    ' > svg': {
      fontSize: `${theme.components.icon.medium} !important`,
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
      background: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(theme.palette.secondary.main),
        ' > svg': {
          color: theme.palette.secondary.main,
        },
        padding: theme.spacing(1.5, 2),
        fontWeight: theme.typography.fontWeightRegular,
        border: '1px solid',
        borderRadius: 4,
        ':not(:last-child)': {
          marginBottom: theme.spacing(1),
        },
      },
    },
    // eslint-disable-next-line tss-unused-classes/unused-classes
    error: {
      ...messageBase,
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(theme.palette.error.main),
        ' > svg': {
          color: theme.palette.error.main,
        },
        padding: theme.spacing(1.5, 2),
        fontWeight: theme.typography.fontWeightRegular,
        border: '1px solid',
        borderRadius: 4,
        ':not(:last-child)': {
          marginBottom: theme.spacing(1),
        },
      },
    },
    // eslint-disable-next-line tss-unused-classes/unused-classes
    warning: {
      ...messageBase,
      background: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        ...getMessageColors(theme.palette.warning.main),
        ' > svg': {
          color: theme.palette.warning.main,
        },
        padding: theme.spacing(1.5, 2),
        fontWeight: theme.typography.fontWeightRegular,
        border: '1px solid',
        borderRadius: 4,
        ':not(:last-child)': {
          marginBottom: theme.spacing(1),
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
  const { classes, cx } = useStyles();
  const containerClass = React.useMemo(() => {
    if (raised) {
      return cx(classes.containerRaised, classNames.containerRaised, 'ui-shared__message-bar');
    }

    return cx(classes.container, classNames.container, 'ui-shared__message-bar');
  }, [classNames.container, classNames.containerRaised, raised,
    classes.container, classes.containerRaised, cx]);

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
            className={cx(
              (classes[type] || null),
              Icon ? classes.withIcon : null,
              classNames.message
            )}
            aria-live="assertive"
            aria-atomic="true"
          >
            {Icon && (
              <Icon className={cx(classes.icon, classNames.icon)} />
            )}
            <span className="sr-only">
              {`${i18n.text(`cart.message_type_${type}`)}: ${messageOutput}`}
            </span>
            <Typography
              variant="body2"
              component="span"
              aria-hidden
              className={Icon ? classes.messageToIcon : null}
            >
              {messageOutput}
            </Typography>
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
