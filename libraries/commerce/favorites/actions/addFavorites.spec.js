import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import addFavorites from './addFavorites';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

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
  describe(SHOPGATE_USER_ADD_FAVORITES, () => {
    beforeEach(() => {
      // Pipeline should succeed by default
      mockSuccessResponse = {};
      mockErrorResponse = undefined;
    });

    it('should call the correct pipeline', async () => {
      const result = await addFavorites('test-123')(jest.fn(), mockedGetState);
      expect(result.mockInstance.name).toBe(SHOPGATE_USER_ADD_FAVORITES);
    });

    it('should dispatch the correct action on pipeline success', async () => {
      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      await addFavorites(productId)(mockedDispatch, mockedGetState);
      expect(mockedDispatch).toHaveBeenCalledWith(successAddFavorites(productId, 'DEFAULT'));
    });

    it('should dispatch the correct action on pipeline failure', (done) => {
      // Pipeline should fail this time
      mockErrorResponse = {
        code: 'EUNKNOWN',
        message: 'Mocked pipeline failed',
      };

      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      addFavorites(productId)(mockedDispatch, mockedGetState)
        .then(() => {
          done('resolved!');
        })
        .catch(() => {
          expect(mockedDispatch)
            .toHaveBeenCalledWith(errorAddFavorites(productId, mockErrorResponse, 'DEFAULT'));
          done();
        });
    });
  });
});
