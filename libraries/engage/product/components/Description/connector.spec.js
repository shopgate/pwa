import connect from './connector';

jest.mock('react-redux', () => ({
  connect: (mapState) => {
    const hoc = component => component;
    hoc.mapStateToProps = mapState;
    return hoc;
  },
}));
jest.mock('@shopgate/engage/core', () => ({ historyPush: jest.fn() }));
jest.mock('@shopgate/engage/product', () => ({
  getProductDescription: (state, { productId }) => (
    state.product.descriptionsByProductId[productId]?.description ?? null
  ),
}));

const { mapStateToProps } = connect;

/**
 * Creates a state with a description entry.
 * @param {Object} [entry] The description entry.
 * @returns {Object}
 */
const stateWith = entry => ({
  product: {
    descriptionsByProductId: entry ? { p1: entry } : {},
  },
});

describe('Description connector', () => {
  it('reports loading while the description was not requested or is fetching', () => {
    expect(mapStateToProps(stateWith(), { productId: 'p1' }).isLoading).toBe(true);
    expect(mapStateToProps(stateWith({ isFetching: true }), { productId: 'p1' }).isLoading).toBe(true);
  });

  it('stops loading once the request finished, with or without a description', () => {
    expect(mapStateToProps(stateWith({ isFetching: false, description: '<p>x</p>' }), { productId: 'p1' }))
      .toEqual(expect.objectContaining({ html: '<p>x</p>', isLoading: false }));
    expect(mapStateToProps(stateWith({ isFetching: false }), { productId: 'p1' }))
      .toEqual(expect.objectContaining({ html: null, isLoading: false }));
  });
});
