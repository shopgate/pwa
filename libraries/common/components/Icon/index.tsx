import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fill: 'currentColor',
    width: '1em',
    height: '1em',
  },
});

export interface IconProps {
  content: string;
  className?: string;
  color?: string | null;
  size?: string | number;
  viewBox?: string;
}

/**
 * The Icon component.
 */
const Icon = ({
  content,
  className = '',
  color = null,
  viewBox = '0 0 24 24',
  size = 24,
}: IconProps) => {
  const { cx, classes } = useStyles();

  return (
    <svg
      className={cx(classes.root, 'common__icon', className)}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        fontSize: size,
        fill: color ?? undefined,
      }}
    />
  );
};

export default Icon;
