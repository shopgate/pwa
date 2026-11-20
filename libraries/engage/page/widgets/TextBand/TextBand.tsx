import { useRef, type ComponentType, type ReactNode } from 'react';
import { Link as EngageLink } from '@shopgate/engage/components';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { keyframes, makeStyles } from '@shopgate/engage/styles';
import {
  useTextBandWidget, type TextBandEntry, type TextBandSpeed,
} from './hooks';

const Link = EngageLink as unknown as ComponentType<{
  href: string;
  tabIndex?: number;
  className?: string;
  children?: ReactNode;
}>;

const PIXELS_PER_SECOND: Record<TextBandSpeed, number> = {
  slow: 25,
  normal: 45,
  fast: 70,
};

const scroll = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-50%)' },
});

const useStyles = makeStyles<{
  backgroundColor?: string;
  textColor?: string;
}>()((theme, { backgroundColor, textColor }) => ({
  root: {
    overflow: 'hidden',
    background: backgroundColor ?? theme.palette.background.emphasized,
    color: textColor ?? theme.palette.text.primary,
  },
  list: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  staticList: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
  },
  track: {
    display: 'flex',
    width: 'max-content',
    '&:focus-within': {
      animationName: 'none',
    },
    '@media (hover: hover)': {
      '&:hover': {
        animationPlayState: 'paused',
      },
    },
  },
  moving: {
    animationName: scroll,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  copy: {
    flexShrink: 0,
    minWidth: '100vw',
    justifyContent: 'space-around',
  },
  entry: {
    display: 'block',
    padding: theme.spacing(1.5, 2),
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: 'inherit',
  },
  scrollingEntry: {
    whiteSpace: 'nowrap',
  },
  link: {
    display: 'block',
    width: 'auto',
    color: 'inherit',
    '&:focus-visible': {
      outline: '2px solid currentcolor',
      outlineOffset: -2,
    },
  },
}));

/**
 * The entries of the band as a list.
 * @param props The component props.
 * @param props.entries The entries.
 * @param props.className The class name of the list.
 * @param props.entryClassName The class name of each entry.
 * @param props.duplicate Whether the list repeats the entries for the loop and is hidden from
 * assistive technology.
 * @returns The JSX.
 */
const EntryList = ({
  entries,
  className,
  entryClassName,
  duplicate = false,
}: {
  entries: TextBandEntry[];
  className: string;
  entryClassName?: string;
  duplicate?: boolean;
}) => {
  const { classes, cx } = useStyles({});

  return (
    <ul
      className={cx(classes.list, className, 'widget__text-band__list')}
      aria-hidden={duplicate || undefined}
    >
      {entries.map((entry, index) => {
        const text = (
          <span className={cx(classes.entry, entryClassName, 'widget__text-band__entry')}>
            {entry.text}
          </span>
        );

        return (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            {entry.link ? (
              <Link
                href={entry.link}
                tabIndex={duplicate ? -1 : 0}
                className={cx(classes.link, 'widget__text-band__link')}
              >
                {text}
              </Link>
            ) : text}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * The entries moving from right to left in an endless loop. The second copy of the entries
 * continues the first one, so the loop has neither a gap nor a jump.
 * @param props The component props.
 * @param props.entries The entries.
 * @param props.speed How fast the entries move.
 * @returns The JSX.
 */
const ScrollingEntries = ({
  entries,
  speed,
}: {
  entries: TextBandEntry[];
  speed: TextBandSpeed;
}) => {
  const { classes, cx } = useStyles({});
  const trackRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useElementSize(trackRef, { includeWidth: true });
  const pixelsPerSecond = PIXELS_PER_SECOND[speed] ?? PIXELS_PER_SECOND.normal;

  return (
    <div
      ref={trackRef}
      className={cx(classes.track, { [classes.moving]: width > 0 }, 'widget__text-band__track')}
      style={width > 0 ? { animationDuration: `${width / 2 / pixelsPerSecond}s` } : undefined}
    >
      <EntryList
        entries={entries}
        className={classes.copy}
        entryClassName={classes.scrollingEntry}
      />
      <EntryList
        entries={entries}
        className={classes.copy}
        entryClassName={classes.scrollingEntry}
        duplicate
      />
    </div>
  );
};

/**
 * The TextBandWidget shows short messages in a slim band, side by side or scrolling.
 * @returns The JSX.
 */
const TextBand = () => {
  const {
    entries,
    display,
    speed,
    backgroundColor,
    textColor,
  } = useTextBandWidget();
  const { classes, cx } = useStyles({
    backgroundColor,
    textColor,
  });
  const reduceMotion = useReduceMotion();

  if (!entries.length) return null;

  const isScrolling = display === 'scrolling' && !reduceMotion;

  return (
    <div
      className={cx(classes.root, 'widget__text-band')}
      data-display={isScrolling ? 'scrolling' : 'static'}
    >
      {isScrolling ? (
        <ScrollingEntries entries={entries} speed={speed} />
      ) : (
        <EntryList entries={entries} className={classes.staticList} />
      )}
    </div>
  );
};

export default TextBand;
