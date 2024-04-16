import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import removeFavorites from './removeFavorites';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

// Forces the pipeline request to be mocked so each test can decide how it resolves
let mockSuccessResponse;
let mockErrorResponse;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      if (mockErrorResponse === undefined) {
        resolve({
          ...mockSuccessResponse,
          mockInstance,
        });
      } else {
        reject(mockErrorResponse);
      }
    })
  )
);

// Mock the config object using class getters
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get favoritesMode() { return { hasMultipleFavoritesLists: true }; },
}));

const mockState = {
  favorites: {
    lists: {
      expires: 0,
      lists: [{
        id: 'DEFAULT',
        name: 'Wish List',
      }],
    },
  },
};

const mockedGetState = jest.fn(() => mockState);

describe('Favorites - actions', () => {
  describe(SHOPGATE_USER_DELETE_FAVORITES, () => {
    beforeEach(() => {
      // Pipeline should succeed by default
      mockSuccessResponse = {};
      mockErrorResponse = undefined;
    });

    it('should call the correct pipeline', async () => {
      const result = await removeFavorites('test-123')(jest.fn(), mockedGetState);
      expect(result.mockInstance.name).toBe(SHOPGATE_USER_DELETE_FAVORITES);
    });

    it('should dispatch the correct action on pipeline success', async () => {
      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      await removeFavorites(productId)(mockedDispatch, mockedGetState);
      expect(mockedDispatch).toHaveBeenCalledWith(successRemoveFavorites(productId, 'DEFAULT'));
    });

    it('should dispatch the correct action on pipeline failure', (done) => {
      // Pipeline should fail this time
      mockErrorResponse = {
        code: 'EUNKNOWN',
        message: 'Mocked pipeline failed',
      };

      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      removeFavorites(productId)(mockedDispatch, mockedGetState)
        .then(() => {
          done('resolved!');
        })
        .catch(() => {
          expect(mockedDispatch)
            .toHaveBeenCalledWith(errorRemoveFavorites(productId, 'DEFAULT', mockErrorResponse));
          done();
        });
    });
  });
});
