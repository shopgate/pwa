import cxs from 'cxs';

const fonts = {
  family: 'Roboto, Arial, sans-serif',
  rootSize: 16,
  lineHeight: 1.5,
};

cxs('body', {
  font: `${fonts.rootSize}px/${fonts.lineHeight} ${fonts.family}`,
});

export default fonts;
