import { useEffect, useMemo, useRef } from 'react';
import { SurroundPortals, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { htmlToText } from '@shopgate/engage/core/helpers';
import { APP_BAR_HEADLINE } from '@shopgate/engage/core/constants';
import { focusElement } from '../../../../helpers/focus';

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    top: 0,
    left: 'var(--app-bar-title-inset, 90px)',
    right: 'var(--app-bar-title-inset, 90px)',
    pointerEvents: 'none',
  },
  text: {
    margin: 0,
    fontSize: 17,
    lineHeight: '44px',
    textAlign: 'center',
    color: 'inherit',
    outline: 0,
  },
});

interface Props {
  title?: string;
  /** Whether the title takes the focus when it appears, for screen readers. */
  focus?: boolean;
}

/**
 * The page title, centered in the header between the buttons of both sides. Long titles end
 * with an ellipsis.
 * @param props The component props.
 * @param props.title The title.
 * @param props.focus Whether the title takes the focus when it appears.
 * @returns The title, or nothing without a title.
 */
const AppBarHeadline = ({ title = '', focus = false }: Props) => {
  const { classes, cx } = useStyles();
  const text = useMemo(() => htmlToText(title) as string, [title]);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focus && ref.current) {
      focusElement(ref.current);
    }
  }, [focus]);

  if (!text) {
    return null;
  }

  return (
    <SurroundPortals portalName={APP_BAR_HEADLINE} portalProps={{ title: text }}>
      <div className={cx(classes.root, 'theme__app-bar__headline')}>
        <Typography
          ref={ref}
          variant="h4"
          component="h1"
          noWrap
          fontWeight="bold"
          tabIndex={-1}
          aria-live="polite"
          className={cx(classes.text, 'theme__app-bar__title')}
          data-test-id={`title: ${text}`}
        >
          {text}
        </Typography>
      </div>
    </SurroundPortals>
  );
};

export default AppBarHeadline;
