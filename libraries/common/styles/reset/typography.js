/**
 * @deprecated used @shopgate/engage/styles instead
 */

import { insertGlobalRule } from '@shopgate/engage/styles/utils/globalStyles';
import { rem } from '../../helpers/style';

insertGlobalRule('a', {
  color: 'inherit',
  textDecoration: 'none',
  WebkitTextDecorationSkip: 'objects',
});

insertGlobalRule('a:hover, a:focus, a:active, [tabindex]', {
  outline: 0,
});

insertGlobalRule('ol, ul', {
  listStyle: 'none',
  margin: 0,
  paddingLeft: 0,
});

insertGlobalRule('b, strong', {
  fontWeight: 700,
});

insertGlobalRule('small', {
  fontSize: rem(13),
});

insertGlobalRule('sub, sup', {
  lineHeight: 0,
});
