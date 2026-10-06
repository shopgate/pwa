import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { RECEIVE_REVIEW_RATE } from '../constants';
import { SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_RATE } from '../constants/Pipelines';
import submitReviewRate from './submitReviewRate';

type MockedRequest = {
  name: string;
  input: unknown;
};

let mockedResolver: (
  mockInstance: MockedRequest,
  resolve: (result?: unknown) => void,
  reject: (error: Error) => void
) => void;

jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((
    mockInstance: MockedRequest,
    resolve: (result?: unknown) => void,
    reject: (error: Error) => void
  ) => {
    mockedResolver(mockInstance, resolve, reject);
  })
);

/**
 * @param reviewVotes The votes the user already gave.
 * @returns A getState function with one stored review.
 */
const createGetState = (reviewVotes = {}) => () => ({
  reviews: {
    reviewsById: {
      12: {
        id: 12,
        rate: 80,
        reviewRate: {
          up: 3,
          down: 1,
        },
      },
    },
    reviewsByHash: {},
    reviewsByProductId: {},
    userReviewsByProductId: {},
  },
  reviewVotes,
});

const submit = submitReviewRate as unknown as (reviewId: number, rate: 'up' | 'down') => (
  dispatch: jest.Mock,
  getState: ReturnType<typeof createGetState>
) => Promise<unknown>;

/**
 * Lets the promise handlers of the action run.
 * @returns A promise that resolves after pending microtasks.
 */
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Reviews actions: submitReviewRate', () => {
  let request: MockedRequest | undefined;

  beforeEach(() => {
    request = undefined;
    mockedResolver = (mockInstance, resolve) => {
      request = mockInstance;
      resolve({
        up: 4,
        down: 1,
      });
    };
  });

  it('should send the vote and store the returned counts', async () => {
    const dispatch = jest.fn();

    await submit(12, 'up')(dispatch, createGetState());
    await flush();

    expect(request?.name).toBe(SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_RATE);
    expect(request?.input).toEqual({
      reviewId: 12,
      rate: 'up',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: RECEIVE_REVIEW_RATE,
      reviewId: 12,
      rate: 'up',
      reviewRate: {
        up: 4,
        down: 1,
      },
    });
  });

  it('should increment the stored count when the response has no counts', async () => {
    mockedResolver = (mockInstance, resolve) => resolve({});
    const dispatch = jest.fn();

    await submit(12, 'down')(dispatch, createGetState());
    await flush();

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      reviewRate: {
        up: 3,
        down: 2,
      },
    }));
  });

  it('should not send a second vote for a review the user voted on', async () => {
    const dispatch = jest.fn();

    const result = await submit(12, 'down')(dispatch, createGetState({ 12: 'up' }));

    expect(result).toBeNull();
    expect(request).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should not send a second vote while one is in flight', async () => {
    let resolveFirst: (result?: unknown) => void = () => undefined;
    let requests = 0;
    mockedResolver = (mockInstance, resolve) => {
      requests += 1;
      resolveFirst = resolve;
    };
    const dispatch = jest.fn();

    submit(12, 'up')(dispatch, createGetState());
    const second = await submit(12, 'down')(dispatch, createGetState());

    expect(second).toBeNull();
    expect(requests).toBe(1);

    resolveFirst({
      up: 4,
      down: 1,
    });
    await flush();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      reviewId: 12,
      rate: 'up',
    }));
  });

  it('should not store a vote when the request fails and allow another attempt', async () => {
    mockedResolver = (mockInstance, resolve, reject) => reject(new Error('failed'));
    const dispatch = jest.fn();

    await submit(12, 'up')(dispatch, createGetState()).catch(() => undefined);
    await flush();

    expect(dispatch).not.toHaveBeenCalled();

    mockedResolver = (mockInstance, resolve) => resolve({
      up: 4,
      down: 1,
    });
    await submit(12, 'up')(dispatch, createGetState());
    await flush();

    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
