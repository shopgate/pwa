import { css } from 'glamor';

const fonts = {
  family: 'system, -apple-system, "SF Pro Display", "Helvetica Neue", "Lucida Grande"',
  rootSize: 17,
  lineHeight: 1.43,
};

css.global('body', {
  font: `${fonts.rootSize}px/${fonts.lineHeight} ${fonts.family}`,
});

export default fonts;
