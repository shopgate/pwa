import { useEffect, useMemo, useRef } from 'react';
import { SurroundPortals, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';
import { APP_BAR_HEADLINE } from '@shopgate/pwa-common/constants/Portals';

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.components.appBar.background,
    color: theme.components.appBar.color,
  },
  text: {
    margin: 0,
    padding: theme.spacing(1.5, 2),
    outline: 0,
  },
}));

interface Props {
  title?: string;
  /** Whether the headline takes the focus when it appears, for screen readers. */
  focus?: boolean;
}

/**
 * The page title of the modern header style. It continues the header above the content.
 * @param props The component props.
 * @param props.title The title.
 * @param props.focus Whether the headline takes the focus when it appears.
 * @returns The headline, or nothing without a title.
 */
const AppBarHeadline = ({ title = '', focus = false }: Props) => {
  const { classes, cx } = useStyles();
  const text = useMemo(() => htmlToText(title) as string, [title]);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focus) {
      ref.current?.focus();
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
          variant="h1"
          component="h1"
          tabIndex={-1}
          className={cx(classes.text, 'headline', 'theme__headline')}
        >
          {text}
        </Typography>
      </div>
    </SurroundPortals>
  );
};

export default AppBarHeadline;
