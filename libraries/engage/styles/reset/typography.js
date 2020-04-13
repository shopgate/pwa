import { css } from 'glamor';
import { rem } from '@shopgate/pwa-common/helpers/style';

css.global('a', {
  color: 'inherit',
  textDecoration: 'none',
  WebkitTextDecorationSkip: 'objects',
});

css.global('a:hover, a:focus, a:active, [tabindex]', {
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
