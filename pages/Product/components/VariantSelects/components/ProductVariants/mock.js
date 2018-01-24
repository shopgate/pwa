/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const variants = {
  products: [{
    id: '1013-1014',
    hasOptions: false,
    characteristics: {
      1: '1',
      2: '1',
    },
    availability: {
      state: 'waning',
      text: 'Limited stock available',
    },
  }, {
    id: '1013-1015',
    hasOptions: false,
    characteristics: {
      1: '1',
      2: '2',
    },
    availability: {
      state: 'alert',
      text: 'Out of stock',
    },
  }, {
    id: '1013-1016',
    hasOptions: false,
    characteristics: {
      1: '1',
      2: '3',
    },
    availability: {
      state: 'ok',
      text: 'Available',
    },
  }, {
    id: '1013-1017',
    hasOptions: false,
    characteristics: {
      1: '2',
      2: '1',
    },
    availability: {
      state: 'ok',
      text: 'Available',
    },
  }, {
    id: '1013-1018',
    hasOptions: false,
    characteristics: {
      1: '2',
      2: '2',
    },
    availability: {
      state: 'ok',
      text: 'Available',
    },
  }, {
    id: '1013-1019',
    hasOptions: false,
    characteristics: {
      1: '2',
      2: '3',
    },
    availability: {
      state: 'ok',
      text: 'Available',
    },
  }],
  characteristics: [{
    id: '1',
    label: 'Color',
    values: [{
      id: '1',
      label: 'Black',
    }, {
      id: '2',
      label: 'Blue',
    }],
  }, {
    id: '2',
    label: 'Size',
    values: [{
      id: '1',
      label: '0',
    }, {
      id: '2',
      label: '11',
    }, {
      id: '3',
      label: '7',
    }],
  }],
};

const initialSelection = [{
  disabled: false,
  id: '1',
  label: 'Color',
  selected: false,
  value: null,
  values: [{
    disabled: false,
    id: '1',
    label: 'Black',
    selected: false,
    availability: null,
  }, {
    disabled: false,
    id: '2',
    label: 'Blue',
    selected: false,
    availability: null,
  }],
}, {
  disabled: true,
  id: '2',
  label: 'Size',
  selected: false,
  value: null,
  values: [{
    disabled: true,
    id: '1',
    label: '0',
    selected: false,
    availability: null,
  }, {
    disabled: true,
    id: '2',
    label: '11',
    selected: false,
    availability: null,
  }, {
    disabled: true,
    id: '3',
    label: '7',
    selected: false,
    availability: null,
  }],
}];

const selectionUpdate = [{
  disabled: false,
  id: '1',
  label: 'Color',
  selected: true,
  value: '1',
  values: [{
    availability: null,
    disabled: false,
    id: '1',
    label: 'Black',
    selected: true,
  }, {
    availability: null,
    disabled: false,
    id: '2',
    label: 'Blue',
    selected: false,
  }],
}, {
  disabled: false,
  id: '2',
  label: 'Size',
  selected: false,
  value: null,
  values: [{
    availability: {
      state: 'waning',
      text: 'Limited stock available',
    },
    disabled: false,
    id: '1',
    label: '0',
    selected: false,
  }, {
    availability: {
      state: 'alert',
      text: 'Out of stock',
    },
    disabled: false,
    id: '2',
    label: '11',
    selected: false,
  }, {
    availability: null,
    disabled: false,
    id: '3',
    label: '7',
    selected: false,
  }],
}];

export {
  initialSelection,
  selectionUpdate,
  variants,
};
