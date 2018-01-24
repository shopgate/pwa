/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable extra-rules/no-single-line-objects */
/* eslint-disable object-property-newline */

const selection = [
  {
    id: '1',
    label: 'Coloras kdjakdsjaklsdj aksdj aksjdkajsdkajsdjaskdjaksdjkajsdaiweiriasjd',
    value: null,
    selected: false,
    disabled: false,
    values: [
      { id: '1', label: 'Pink', disabled: false, selected: false },
      { id: '2', label: 'Black', disabled: true, selected: false },
    ],
  },
  {
    id: '2',
    label: 'Size',
    value: '2',
    selected: true,
    disabled: false,
    values: [
      { id: '1', label: 'S', disabled: false, selected: false },
      { id: '2', label: 'M', disabled: false, selected: true },
      { id: '3', label: 'asjdaksdlkasdkalsklaeksoas iodialskdajsdjasdjkajdkajsd adshj', disabled: true, selected: false },
      { id: '4', label: 'XS', disabled: false, selected: false },
      { id: '5', label: 'XL', disabled: false, selected: false },
      { id: '6', label: 'XL', disabled: false, selected: false },
      { id: '7', label: 'XL', disabled: false, selected: false },
      { id: '8', label: 'XL', disabled: false, selected: false },
      { id: '9', label: 'XL', disabled: false, selected: false },
      { id: '10', label: 'XL', disabled: false, selected: false },
      { id: '11', label: 'XL', disabled: false, selected: false },
      { id: '12', label: 'XL', disabled: false, selected: false },
      { id: '13', label: 'XL', disabled: false, selected: false },
    ],
  },
  {
    id: '3',
    label: 'FOOasodjaksd jkasjdkajsdk askdjaksdjaskd kasjkdjaksdjasjdk',
    value: 'Barasdhasjd kasjdkajskdjaksdjaksdjaksjdakjsdkajsd aksjdakjsdkajd kjdkajskdja',
    selected: false,
    disabled: true,
    values: [
      { id: '7', label: 'XL', disabled: false, selected: false },
      { id: '8', label: 'XL', disabled: false, selected: false },
      { id: '9', label: 'XL', disabled: false, selected: false },
      { id: '10', label: 'XL', disabled: false, selected: false },
      { id: '11', label: 'XL', disabled: false, selected: false },
      { id: '12', label: 'XL', disabled: false, selected: false },
      { id: '13', label: 'XL', disabled: false, selected: false },
    ],
  },
];

const selectionWithWarning = [
  {
    id: '1',
    label: 'Color',
    value: null,
    selected: false,
    disabled: false,
    values: [
      { id: '1', label: 'Red', disabled: false, selected: false, availability: {
        text: 'Only 1 left',
        state: 'warning',
      } },
      { id: '2', label: 'Blue', disabled: false, selected: false, availability: {
        text: 'Only 2 left',
        state: 'warning',
      } },
      { id: '3', label: 'Green', disabled: false, selected: false, availability: {
        text: 'Only 3 left',
        state: 'warning',
      } },
      { id: '4', label: 'Pink', disabled: false, selected: false, availability: {
        text: 'Available',
        state: 'ok',
      } },
    ],
  },
];

const selectionWithAlert = [
  {
    id: '1',
    label: 'Size',
    value: null,
    selected: false,
    disabled: false,
    values: [
      { id: '1', label: 'S', disabled: false, selected: false, availability: { text: 'Available', state: 'ok' } },
      { id: '2', label: 'M', disabled: false, selected: false, availability: { text: 'Out of stock', state: 'alert' } },
      { id: '3', label: 'L', disabled: false, selected: false, availability: { text: 'Out of stock', state: 'alert' } },
    ],
  },
];

export {
  selection,
  selectionWithWarning,
  selectionWithAlert,
};

/* eslint-enable extra-rules/no-single-line-objects */
/* eslint-enable object-property-newline */
