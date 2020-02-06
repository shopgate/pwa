export const ACTION_TYPE_UPDATE_PROVINCE_ELEMENT = 'updateProvinceElement';
export const ACTION_TYPE_SET_VISIBILITY = 'setVisibility';
export const ACTION_TYPE_SET_VALUE = 'setValue';
export const ACTION_TYPE_TRANSFORM = 'transform';

export const ACTION_SET_VALUE_FIXED = 'fixed';
export const ACTION_SET_VALUE_COPY_FROM = 'copyFrom';
export const ACTION_SET_VALUE_LENGTH_OF = 'lengthOf';

export const ACTION_RULE_TYPE_NOT_IN = 'notIn';
export const ACTION_RULE_TYPE_ONE_OF = 'oneOf';
export const ACTION_RULE_TYPE_BOOLEAN = 'boolean';
export const ACTION_RULE_TYPE_REGEX = 'regex';

// Rule data is formatted as array
export const ACTION_RULE_DATA_TYPES = {
  [ACTION_RULE_TYPE_NOT_IN]: 'array',
  [ACTION_RULE_TYPE_ONE_OF]: 'array',
  [ACTION_RULE_TYPE_BOOLEAN]: 'boolean',
  [ACTION_RULE_TYPE_REGEX]: 'string',
};

export const ACTION_RULES_CONCAT_METHOD_ALL = 'all';
export const ACTION_RULES_CONCAT_METHOD_ANY = 'any';
export const ACTION_RULES_CONCAT_METHOD_NONE = 'none';
