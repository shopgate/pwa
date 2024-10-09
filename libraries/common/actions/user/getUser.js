import fetchUser from './fetchUser';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 * @deprecated Will be removed in the near future. Use fetchUser instead.
 */
const getUser = fetchUser;

export default getUser;
