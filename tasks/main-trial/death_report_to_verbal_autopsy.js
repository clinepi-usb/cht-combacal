const {
  REPORT,
  TASK_EXPIRY_PERIOD,
  DEATH_REPORT_FORM,
  VERBAL_AUTOPSY_FORM
} = require('../../data/ENUM');
const {isMostRecentReport, getMostRecentReport, addDate, getNumberOfReportsOfType, isFormArraySubmittedInWindow} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const {appliesIfDeathToVerbalAutopsy} = require('../applies');

/**
 * Tasks from the bp_confirm form to itself
 */
module.exports =
  {
    name: 'combacal.main-trial.verbal-autopsy',
    icon: 'icon-person',
    title: 'Supervisor Death Report',
    appliesTo: 'reports',
    appliesToType: [DEATH_REPORT_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'de');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        getNumberOfReportsOfType(contact.reports, VERBAL_AUTOPSY_FORM) === 0 &&
        contact.contact.date_of_death &&
        appliesIfDeathToVerbalAutopsy(report) &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(
        contact.reports,
        [VERBAL_AUTOPSY_FORM],
        addDate(dueDate, -event.start).getTime(),
        addDate(dueDate, event.end + 1).getTime()
      );
    },
    actions: [
      {
        type: REPORT,
        form: VERBAL_AUTOPSY_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'verbal-autopsy-self',
      start: TASK_EXPIRY_PERIOD,
      end: TASK_EXPIRY_PERIOD,
      days: 1
    }]
  };
