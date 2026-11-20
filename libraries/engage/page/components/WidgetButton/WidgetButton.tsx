import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Button } from '@shopgate/engage/components/v2';
import { useWidget } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useNavigation } from '@shopgate/engage/core';

/** Where a widget button sits within its row. */
export type WidgetButtonAlignment = 'left' | 'center' | 'right' | 'fullWidth';

export interface WidgetButtonProps {
  /** The button label. */
  text: string;
  /** The link the button opens. */
  link: string;
  /** Where the button sits within its row. */
  alignment: WidgetButtonAlignment;
  /** An optional class name for the row. */
  className?: string;
}

const JUSTIFY_CONTENT: Record<WidgetButtonAlignment, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  fullWidth: 'flex-start',
};

const useStyles = makeStyles<{ alignment: WidgetButtonAlignment }>()((_, { alignment }) => ({
  root: {
    display: 'flex',
    justifyContent: JUSTIFY_CONTENT[alignment] ?? 'center',
  },
  button: {
    maxWidth: '100%',
    textAlign: 'center',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
}));

/**
 * The button of a widget that opens a link.
 */
const WidgetButton = ({
  text,
  link,
  alignment,
  className,
}: WidgetButtonProps) => {
  const { classes, cx } = useStyles({ alignment });
  const { isPreview } = useWidget();
  const { push } = useNavigation();

  const handleClick = useCallback((event: MouseEvent) => {
    if (!link) return;

    if (!isPreview) {
      event.stopPropagation();
    }

    push({ pathname: link });
  }, [isPreview, link, push]);

  return (
    <div className={cx(classes.root, className)} data-alignment={alignment}>
      <Button
        color="primary"
        fullWidth={alignment === 'fullWidth'}
        className={classes.button}
        onClick={handleClick}
      >
        {text}
      </Button>
    </div>
  );
};

export default WidgetButton;
