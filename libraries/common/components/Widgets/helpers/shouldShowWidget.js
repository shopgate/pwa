/**
 * Checks widget setting and decides if widget should be shown at the moment.
 * @param {Object} setting Widget setting object.
 * @returns {boolean}
 */
function shouldShowWidget(setting = {}) {
  const nowDate = new Date();
  // Show widget if flag does not exist (old widgets)
  if (!setting.hasOwnProperty('published')) {
    return true;
  }

  if (setting.published === false) {
    return false;
  }

  // Defensive here since this data comes from the pipeline, it might be invalid for some reasons.
  if (setting.hasOwnProperty('plan') && setting.plan) {
    let startDate = null;
    let endDate = null;
    let notStartedYet = false;
    let finishedAlready = false;

    if (setting.planDate.valid_from) {
      startDate = new Date(setting.planDate.valid_from);
      notStartedYet = nowDate <= startDate;
    }

    if (setting.planDate.valid_to) {
      endDate = new Date(setting.planDate.valid_to);
      finishedAlready = nowDate >= endDate;
    }
    // Don't hide if no dates found
    if (!startDate && !endDate) {
      return true;
    }

    // Hide if some wrong dates are passed
    if (startDate && endDate && (startDate >= endDate)) {
      return false;
    }

    // Hide if start date is set but it is not there yet
    // Hide if end date is reached
    if ((startDate && notStartedYet) || (endDate && finishedAlready)) {
      return false;
    }
  }

  return true;
}

export default shouldShowWidget;
