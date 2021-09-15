import { css } from 'glamor';

export const scrolledIn = css({
  '&&': {
    transform: 'translateY(0%)',
  },
}).toString();

export const scrolledOut = css({
  '&&': {
    transform: 'translateY(-250%)',
  },
}).toString();

export const transition = css({
  transition: 'transform 0.2s ease,transform 0.2s',
});
