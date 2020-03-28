/**
 * Take care that only necessary modules are imported for the test.
 * @shopgate/engage/constants exports the content of @shopgate/engage/constants/Portals.js which
 * imports from @shopgate/engage/product. This causes loading of a huge amount of files which are
 * not required here but massively increases run time of the tests.
 */
jest.mock('../../constants/', () => ({
  ...jest.requireActual('../../constants/ActionTypes'),
}));
