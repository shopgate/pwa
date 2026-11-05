import { useEffect, useMemo, useRef } from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { htmlToText } from '@shopgate/engage/core/helpers';
import { APP_BAR_HEADLINE } from '@shopgate/engage/core/constants';
import { focusElement } from '../../../../helpers/focus';

interface Props {
  title?: string;
  /** Whether the title takes the focus when it appears, for screen readers. */
  focus?: boolean;
}

/**
 * The page title in the center of the header.
 * @param props The component props.
 * @param props.title The title.
 * @param props.focus Whether the title takes the focus when it appears.
 * @returns The title, or nothing without a title.
 */
const AppBarHeadline = ({ title = '', focus = false }: Props) => {
  const text = useMemo(() => htmlToText(title) as string, [title]);
  const ref = useRef<HTMLElement>(null);

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
      <AppBar.Title ref={ref} title={title} />
    </SurroundPortals>
  );
};

export default AppBarHeadline;
