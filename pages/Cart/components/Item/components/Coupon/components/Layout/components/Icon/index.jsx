/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

const content = `
  <defs>
    <style>
      .cls-1, .cls-3 {
        fill: #81c6e5;
      }

      .cls-1 {
        opacity: 0.19;
      }

      .cls-2 {
        fill: none;
        fill-rule: evenodd;
      }

      .cls-4 {
        clip-path: url(#clip-path);
      }

      .cls-5, .cls-6 {
        opacity: 0.09;
      }

      .cls-5 {
        fill: url(#linear-gradient);
      }

      .cls-6 {
        fill: url(#linear-gradient-2);
      }

      .cls-7 {
        fill: #fff;
      }
    </style>
    <clipPath id="clip-path">
      <path class="cls-1" d="M39.407,6.8A23.038,23.038,0,0,0,6.6,39.15a23.007,23.007,0,0,0,32.552.2l.1-.1A23.078,23.078,0,0,0,39.407,6.8Z" transform="translate(0 0)"/>
    </clipPath>
    <linearGradient id="linear-gradient" x1="0.273" y1="0.267" x2="0.705" y2="0.641" gradientUnits="objectBoundingBox">
      <stop offset="0"/>
      <stop offset="1" stop-opacity="0.251"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="0.5" y1="0" x2="0.5" y2="1" xlink:href="#linear-gradient"/>
  </defs>
  <g transform="translate(283 -149)">
    <path class="cls-2" d="M39.474-83.7a22.758,22.758,0,0,0-32.346-.1,23.309,23.309,0,0,0-.1,32.455A22.484,22.484,0,0,0,23.1-44.5a22.282,22.282,0,0,0,16.123-6.644l.1-.1A23.26,23.26,0,0,0,39.474-83.7Z" transform="translate(3265.005 8065.5)"/>
    <path class="cls-3" d="M39.407,6.8A23.038,23.038,0,0,0,6.6,39.15a23.007,23.007,0,0,0,32.552.2l.1-.1A23.078,23.078,0,0,0,39.407,6.8Z" transform="translate(3265 7975)"/>
    <g class="cls-4" transform="translate(3265 7975)">
      <path class="cls-5" d="M3173.978,8072.545l-20.807,21.038,17.736,17.381,20.526-22.043Z" transform="translate(-3140.448 -8060)"/>
    </g>
    <path class="cls-6" d="M3160.986,8075.234l-6.975,6.144,6.15,6.08,6.542-6.665Z" transform="translate(124.137 -86.315)"/>
    <path class="cls-2" d="M5.454-46.5a4.99,4.99,0,0,1,4.954,5.009,4.99,4.99,0,0,1-4.954,5.009A4.99,4.99,0,0,1,.5-41.491,4.99,4.99,0,0,1,5.454-46.5Z" transform="translate(3275.621 8032.744)"/>
    <path class="cls-2" d="M32.454-10.482A4.99,4.99,0,0,1,27.5-15.491,4.99,4.99,0,0,1,32.454-20.5a4.99,4.99,0,0,1,4.954,5.009A4.99,4.99,0,0,1,32.454-10.482Z" transform="translate(3262.269 8020.033)"/>
    <g transform="translate(3276.244 7986.244)">
      <path class="cls-7" d="M5.008,0a5.073,5.073,0,0,1,5.008,5.12,5.073,5.073,0,0,1-5.008,5.12A5.073,5.073,0,0,1,0,5.12,5.073,5.073,0,0,1,5.008,0Z" transform="translate(0 0)"/>
      <path class="cls-7" d="M2.553,23.044a1.533,1.533,0,0,1-1.067.467,1.448,1.448,0,0,1-1.067-.467,1.559,1.559,0,0,1,0-2.127L20.485.428a1.481,1.481,0,0,1,2.083,0,1.614,1.614,0,0,1,.051,2.127Z" transform="translate(0.511 0)"/>
      <path class="cls-7" d="M4.854,9.927A4.918,4.918,0,0,1,0,4.963,4.918,4.918,0,0,1,4.854,0,4.918,4.918,0,0,1,9.709,4.963,4.918,4.918,0,0,1,4.854,9.927Z" transform="translate(13.802 13.584)"/>
    </g>
  </g>
`;

export default () => (
  <Icon viewBox="3548 7826 45.999 46" content={content} />
);
