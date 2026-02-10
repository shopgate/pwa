import React, { useMemo } from 'react';
import CryptoJs from 'crypto-js';
import styles from './style';

/**
 * Renders empty favorites icon.
 * @return {JSX}
 */
export const EmptyFavoritesIcon = () => {
  const filterId = useMemo(() => {
    const prefix = 'empty-favorite-list-shadow';
    const hash = CryptoJs.MD5(`${prefix}-${Date.now() + Math.random()}`).toString();
    return `${prefix}-${hash}`;
  }, []);

  return (
    <svg className={styles.viewBox} viewBox="0 0 241 241" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={filterId} filterUnits="userSpaceOnUse">
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" result="b" />
          <feFlood floodOpacity="0.169" />
          <feComposite operator="in" in2="b" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <circle className={styles.outerCircle} cx="120.5" cy="120.5" r="120.5" />
      <circle className={styles.innerCircle} cx="120.5" cy="120.5" r="113.5" />
      <circle className={styles.innerCircle} cx="121" cy="121" r="104" />
      <g filter={`url(#${filterId})`}>
        <path className={styles.heart} d="M121.002 187.377s-91.218-57.064-52.369-98.475c15.937-16.934 35.292-8.682 45.396-2.277l-3.559 25.473 11.384 5.834-8.821 21.915 7.537 5.973-.854 16.223 6.119-19.5-4.122-4.123 13.234-23.48-9.392-9.25 14.373-24.9c9.961-3.273 22.484-3.415 33.442 8.111 38.849 41.412-52.368 98.476-52.368 98.476z" />
      </g>
    </svg>
  );
};

export default EmptyFavoritesIcon;
