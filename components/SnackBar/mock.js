/**
 * Mocked toast state
 * @type {{toast: [null,null]}}
 */
export const mockedState = {
  toast: {
    dismissed: false,
    toasts: [
      {
        id: 1,
        message: 'Lorem ipsum dolor sit amet.',
        duration: 6000,
      },
    ],
  },
};
