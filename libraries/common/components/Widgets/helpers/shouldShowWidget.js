/**
 * Checks widget setting and decides if widget should be shown at the moment.
 * @param {Object} settings Widget setting object.
 * @returns {boolean}
 */
function shouldShowWidget(settings = {}) {
  const nowDate = new Date();
  // Show widget if flag does not exist (old widgets)
  if (!settings.hasOwnProperty('published')) {
    return true;
  }

  if (settings.published === false) {
    return false;
  }

  // Defensive here since this data comes from the pipeline, it might be invalid for some reasons.
  if (settings.hasOwnProperty('plan') && settings.plan) {
    let startDate = null;
    let endDate = null;
    let notStartedYet = false;
    let finishedAlready = false;

    if (settings.planDate.valid_from) {
      startDate = new Date(settings.planDate.valid_from);
      notStartedYet = nowDate <= startDate;
    }

    if (settings.planDate.valid_to) {
      endDate = new Date(settings.planDate.valid_to);
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
