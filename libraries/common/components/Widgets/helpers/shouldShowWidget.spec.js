import shouldHideWidget from './shouldShowWidget';

describe('shouldHideWidget', () => {
  it('should return true when widget has no schedule related flags', () => {
    expect(shouldHideWidget({})).toBe(true);
  });
  it('should return false, when widget is not published', () => {
    expect(shouldHideWidget({ published: false })).toBe(false);
  });
  it('should return false, when widget is not yet available', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() + 1000).toISOString(),
      },
    })).toBe(false);
  });
  it('should return false, when widget is not yet available and has valid_to', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() + 10000).toISOString(),
        valid_to: new Date(Date.now() + 20000).toISOString(),
      },
    })).toBe(false);
  });
  it('should return false, when widget is no longer available', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_to: new Date(Date.now() - 1000).toISOString(),
      },
    })).toBe(false);
  });
  it('should return false, when widget was but is no longer available', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() - 2000).toISOString(),
        valid_to: new Date(Date.now() - 1000).toISOString(),
      },
    })).toBe(false);
  });
  it('should return true, when widget is already available', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() - 1000).toISOString(),
      },
    })).toBe(true);
  });
  it('should return true, when widget is already available and has endDate', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() - 1000).toISOString(),
        valid_to: new Date(Date.now() + 1000).toISOString(),
      },
    })).toBe(true);
  });
  it('should return true, when widget is has only endDate in the future', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_to: new Date(Date.now() + 1000).toISOString(),
      },
    })).toBe(true);
  });
  it('should return true, when widget has plan but no valid_* fields', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {},
    })).toBe(true);
  });
  it('should return false, when valid_to is higher than valid_from', () => {
    expect(shouldHideWidget({
      published: true,
      plan: true,
      planDate: {
        valid_from: new Date(Date.now() + 2000).toISOString(),
        valid_to: new Date(Date.now() + 1000).toISOString(),
      },
    })).toBe(false);
  });
});
