import { Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { WidgetRichText } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import WidgetHeadline from '../../components/WidgetHeadline';
import WidgetButton from '../../components/WidgetButton';
import {
  splitSeconds, useCountdownWidget, useRemainingSeconds, type CountdownDisplay,
} from './hooks';

const useStyles = makeStyles<{
  backgroundColor?: string;
  textColor?: string;
}>()((theme, { backgroundColor, textColor }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    textAlign: 'center',
    ...(backgroundColor && { background: backgroundColor }),
    ...(textColor && { color: textColor }),
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  headline: {
    alignSelf: 'stretch',
    padding: 0,
  },
  text: {
    '& a': {
      color: 'inherit',
      textDecoration: 'underline',
    },
  },
  button: {
    alignSelf: 'stretch',
  },
  boxes: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: theme.spacing(0, -0.5, -1),
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 64,
    margin: theme.spacing(0, 0.5, 1),
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    background: [
      theme.palette.background.emphasized,
      'color-mix(in srgb, currentcolor 10%, transparent)',
    ],
  },
  value: {
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  },
  line: {
    fontVariantNumeric: 'tabular-nums',
  },
}));

/**
 * Pads a number of a time unit to two digits.
 * @param value The number.
 * @returns The number with at least two digits.
 */
const pad = (value: number) => String(value).padStart(2, '0');

/**
 * The remaining time as tiles or as one line. Screen readers get it as one sentence.
 * @param props The component props.
 * @param props.seconds The remaining seconds.
 * @param props.display How the time is shown.
 * @returns The JSX.
 */
const CountdownTime = ({
  seconds,
  display,
}: {
  seconds: number;
  display: CountdownDisplay;
}) => {
  const { classes, cx } = useStyles({});
  const time = splitSeconds(seconds);

  const units = (['days', 'hours', 'minutes', 'seconds'] as const)
    .filter(unit => unit !== 'days' || time.days > 0);

  return (
    <div
      role="timer"
      aria-label={i18n.text('page.countdown.remaining', time)}
      className="widget__countdown__timer"
    >
      {display === 'inline' ? (
        <Typography variant="h3" component="div" className={classes.line} aria-hidden>
          {i18n.text('common.countdown', {
            days: time.days,
            time: `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`,
          })}
        </Typography>
      ) : (
        <div className={classes.boxes} aria-hidden>
          {units.map(unit => (
            <div key={unit} className={cx(classes.box, 'widget__countdown__box')}>
              <Typography
                variant="h2"
                component="span"
                className={cx(classes.value, 'widget__countdown__value')}
              >
                {unit === 'days' ? time.days : pad(time[unit])}
              </Typography>
              <Typography variant="caption" className="widget__countdown__unit">
                {i18n.text(`page.countdown.${unit}`, { count: time[unit] })}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * The CountdownWidget counts down to the end of a campaign.
 * @returns The JSX.
 */
const Countdown = () => {
  const {
    endDate,
    display,
    showHeadline,
    headline,
    text,
    buttonText,
    link,
    buttonAlignment,
    backgroundColor,
    textColor,
    afterExpiry,
    expiredText,
  } = useCountdownWidget();
  const { classes, cx } = useStyles({
    backgroundColor,
    textColor,
  });
  const remainingSeconds = useRemainingSeconds(endDate);

  if (remainingSeconds === null) return null;

  const isExpired = remainingSeconds === 0;

  if (isExpired && afterExpiry !== 'showText') return null;

  return (
    <div className={cx(classes.root, 'widget__countdown')} data-display={display}>
      {showHeadline && headline ? (
        <WidgetHeadline headline={headline} className={classes.headline} />
      ) : null}
      {!isExpired ? (
        <CountdownTime seconds={remainingSeconds} display={display} />
      ) : null}
      <WidgetRichText content={isExpired ? expiredText : text} className={classes.text} />
      {!isExpired && link && buttonText?.trim() ? (
        <WidgetButton
          text={buttonText}
          link={link}
          alignment={buttonAlignment}
          className={classes.button}
        />
      ) : null}
    </div>
  );
};

export default Countdown;
