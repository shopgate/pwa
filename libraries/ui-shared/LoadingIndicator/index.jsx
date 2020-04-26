import React from 'react';
import classNames from 'classnames';
import IndicatorCircle from '../IndicatorCircle';
import styles from './style';

type Props = {
  className?: string
}

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = ({ className }: Props) => (
  <div className={classNames(className, styles)}>
    <IndicatorCircle />
  </div>
);

LoadingIndicator.defaultProps = {
  className: null,
};

export default LoadingIndicator;
