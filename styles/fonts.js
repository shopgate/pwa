import { css } from 'glamor';

const fonts = {
  family: 'Roboto, Arial, sans-serif',
  rootSize: 16,
  lineHeight: 1.5,
};

css.global('body', {
  font: `${fonts.rootSize}px/${fonts.lineHeight} ${fonts.family}`,
});

/**
 * Add the font manually in development mode. This will allow developers to
 * see the font on any device that does not natively support Roboto.
 */
if (process.env.NODE_ENV === 'development') {
  const robotoRegular = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    src: "local('Roboto'), local('Roboto'), url(https://fonts.gstatic.com/s/roboto/v16/Ks_cVxiCiwUWVsFWFA3Bjn-_kf6ByYO6CLYdB4HQE-Y.woff2) format('woff2')",
    unicodeRange: 'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF',
  };

  const robotoMedium = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    src: "local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v16/oOeFwZNlrTefzLYmlVV1UIX0hVgzZQUfRDuZrPvH3D8.woff2) format('woff2')",
    unicodeRange: 'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF',
  };

  const robotoBold = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 700,
    src: "local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW4X0hVgzZQUfRDuZrPvH3D8.woff2) format('woff2')",
    unicodeRange: 'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF',
  };

  const robotoBlack = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 900,
    src: "local('Roboto Black'), local('Roboto-Black'), url(https://fonts.gstatic.com/s/roboto/v16/9_7S_tWeGDh5Pq3u05RVkoX0hVgzZQUfRDuZrPvH3D8.woff2) format('woff2')",
    unicodeRange: 'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF',
  };

  css.fontFace(robotoRegular);
  css.fontFace(robotoMedium);
  css.fontFace(robotoBold);
  css.fontFace(robotoBlack);
}

export default fonts;
