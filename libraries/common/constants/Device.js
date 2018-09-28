export const OS_ALL = 'all';
export const OS_ANDROID = 'android';
export const OS_IOS = 'ios';

export const TYPE_PHONE = 'phone';

export const MODEL_NAMES_IPHONE_X = [
  'iPhone10,3',
  'iPhone10,6',
  'iPhone11,2',
  'iPhone11,4',
  'iPhone11,6',
  'iPhone11,8',
];

/**
 * Page insets are device screen areas which can't be used to display content. Those come especially
 * relevant on iOS devices with their status bar ot the iPhone notch at the top of the screen.
 */

export const PAGE_INSET_NAME_TOP = 'safeAreaInsetTop';
export const PAGE_INSET_NAME_BOTTOM = 'safeAreaInsetBottom';
export const PAGE_INSET_NAME_LEFT = 'safeAreaInsetLeft';
export const PAGE_INSET_NAME_RIGHT = 'safeAreaInsetRight';

export const PAGE_INSETS_ANDROID = {
  [PAGE_INSET_NAME_TOP]: 0,
  [PAGE_INSET_NAME_BOTTOM]: 0,
  [PAGE_INSET_NAME_LEFT]: 0,
  [PAGE_INSET_NAME_RIGHT]: 0,
};

export const PAGE_INSETS_IOS = {
  ...PAGE_INSETS_ANDROID,
  [PAGE_INSET_NAME_TOP]: 20,
};

export const PAGE_INSETS_IPHONE_X = {
  ...PAGE_INSETS_IOS,
  [PAGE_INSET_NAME_TOP]: 44,
  [PAGE_INSET_NAME_BOTTOM]: 30,
};
