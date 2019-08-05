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

// Prevent console output on pipeline error test scenario
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Favorites - actions', () => {
  describe(SHOPGATE_USER_DELETE_FAVORITES, () => {
    beforeEach(() => {
      // Pipeline should succeed by default
      mockSuccessResponse = {};
      mockErrorResponse = undefined;
    });

    it('should call the correct pipeline', async () => {
      const result = await removeFavorites('test-123')(jest.fn());
      expect(result.mockInstance.name).toBe(SHOPGATE_USER_DELETE_FAVORITES);
    });

    it('should dispatch the correct action on pipeline success', async () => {
      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      await removeFavorites(productId)(mockedDispatch);
      expect(mockedDispatch).toHaveBeenCalledWith(successRemoveFavorites(productId));
    });

    it('should dispatch the correct action on pipeline failure', async () => {
      // Pipeline should fail this time
      mockErrorResponse = {
        code: 'EUNKNOWN',
        message: 'Mocked pipeline failed',
      };

      const mockedDispatch = jest.fn();
      const productId = 'test-123';
      await removeFavorites(productId)(mockedDispatch);
      expect(mockedDispatch)
        .toHaveBeenCalledWith(errorRemoveFavorites(productId, mockErrorResponse));
    });
  });
});
