/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import { rem } from '../../helpers/style';

css.global('a', {
  color: 'inherit',
  textDecoration: 'none',
  WebkitTextDecorationSkip: 'objects',
});

css.global('a:hover, a:focus, a:active', {
  outline: 0,
});

css.global('ol, ul', {
  listStyle: 'none',
  margin: 0,
  paddingLeft: 0,
});

css.global('b, strong', {
  fontWeight: 700,
});

css.global('small', {
  fontSize: rem(13),
});

css.global('sub, sup', {
  lineHeight: 0,
});
