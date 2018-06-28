import { css } from 'glamor';

export default css({
  ' h1, h2, h3, h4, h5, h6, p, ul, ol': {
    margin: '1rem 0',
  },
  ' h1, h2, h3, h4, h5, h6': {
    fontWeight: 600,
  },
  ' h1': {
    fontSize: '1.5rem',
  },
  ' h2': {
    fontSize: '1.25rem',
  },
  ' h3': {
    fontSize: '1.1rem',
  },
  ' h4, h5, h6': {
    fontSize: '1rem',
  },
  ' img': {
    display: 'initial',
  },
  // Clearfix for floated widget content
  ':after': {
    clear: 'both',
    content: '.',
    display: 'block',
    visibility: 'hidden',
    height: 0,
  },
}).toString();
