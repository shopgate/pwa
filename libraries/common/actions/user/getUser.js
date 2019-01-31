import { fetchUser } from './fetchUser';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
const getUser = fetchUser;

export default getUser;
