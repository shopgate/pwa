import createBreakpoints from './createBreakpoints';

describe('theme => createBreakpoints', () => {
  const breakpoints = createBreakpoints({});

  describe('up', () => {
    it('should work for xs', () => {
      expect(breakpoints.up('xs')).toEqual('@media (min-width:0px)');
    });

    it('should work for md', () => {
      expect(breakpoints.up('md')).toEqual('@media (min-width:768px)');
    });
  });

  describe('down', () => {
    it('should work', () => {
      expect(breakpoints.down('sm')).toEqual('@media (max-width:479.95px)');
    });

    it('should work for md', () => {
      expect(breakpoints.down('md')).toEqual('@media (max-width:767.95px)');
    });

    it('should work for xs', () => {
      expect(breakpoints.down('xs')).toEqual('@media (max-width:-0.05px)');
    });

    it('should accept a number', () => {
      expect(breakpoints.down(600)).toEqual('@media (max-width:599.95px)');
    });

    it('should work for xl', () => {
      expect(breakpoints.down('xl')).toEqual('@media (max-width:1279.95px)');
    });
  });

  describe('between', () => {
    it('should work', () => {
      expect(breakpoints.between('sm', 'md')).toEqual(
        '@media (min-width:480px) and (max-width:767.95px)'
      );
    });

    it('should accept numbers', () => {
      expect(breakpoints.between(600, 800)).toEqual(
        '@media (min-width:600px) and (max-width:799.95px)'
      );
    });

    it('should work on largest breakpoints', () => {
      expect(breakpoints.between('lg', 'xl')).toEqual(
        '@media (min-width:1024px) and (max-width:1279.95px)'
      );
    });
  });

  describe('only', () => {
    it('should work', () => {
      expect(breakpoints.only('md')).toEqual('@media (min-width:768px) and (max-width:1023.95px)');
    });

    it('on xl should call up', () => {
      expect(breakpoints.only('xl')).toEqual('@media (min-width:1280px)');
    });
  });

  describe('not', () => {
    it('should work', () => {
      expect(breakpoints.not('md')).toEqual(
        '@media not all and (min-width:768px) and (max-width:1023.95px)'
      );
    });

    it('should invert up for xl', () => {
      expect(breakpoints.not('xl')).toEqual('@media (max-width:1279.95px)');
    });

    it('should invert down for xs', () => {
      expect(breakpoints.not('xs')).toEqual('@media (min-width:480px)');
    });
  });
});
