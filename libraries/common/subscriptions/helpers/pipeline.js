/**
 * @param {Object} error error
 * @returns {string|*}
 */
export function transformGeneralPipelineError(error) {
  const { message } = error;

  const generalPipelineErrors = [
    'An internal error occured',
    '502 Bad Gateway',
    'error from bigApi',
    'BigApi request',
    'error in bigApi',
  ];

  const general = new RegExp(`(${generalPipelineErrors.join('|')})`, 'i');
  if (general.test(message)) {
    return 'error.general';
  }
  return message;
}
