import { css } from 'glamor';

export const hidden = css({
  display: 'none',
}).toString();

// Headline needs an own class, to be identifiable by the script which checks for child nodes.
export const headline = css({
  display: 'none',
}).toString();
