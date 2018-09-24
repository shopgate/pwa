/**
 * Builds an Object, that contains all validation errors given as array of objects
 * @param {{path: string, message: string}[]} validationErrors Associated object containing errors
 * @return {Object}
 */
export default validationErrors => validationErrors.reduce((result, validationError) => ({
  ...result,
  [validationError.path]: validationError.message,
}), {});
