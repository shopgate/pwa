import { rem } from '@shopgate/pwa-common/helpers/style';
import { injectGlobal } from '..';

injectGlobal({
  a: {
    color: 'inherit',
    textDecoration: 'none',
    WebkitTextDecorationSkip: 'objects',
  },
  'a:hover, a:focus, a:active, [tabindex]': {
    outline: 0,
  },
  'ol, ul': {
    listStyle: 'none',
    margin: 0,
    paddingLeft: 0,
  },
  'b, strong': {
    fontWeight: 700,
  },
  small: {
    fontSize: rem(13),
  },
  'sub, sup': {
    lineHeight: 0,
  },
});
