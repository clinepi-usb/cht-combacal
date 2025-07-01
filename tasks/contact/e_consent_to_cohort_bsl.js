const { MAIN_COHORT_FORM, REPORT, TASK_EXPIRY_PERIOD, E_CONSENT_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate, getMostRecentReport, isMostRecentReport } = require('../../nools-extras');
const { calculateAge} = require('../utils');
const {appliesIfEConsentToMainCohort} = require('../applies');

module.exports =
{
  name: 'combacal.e-consent-main-cohort',
  icon: 'icon-healthcare-diagnosis',
  title: 'Cohort Baseline Form',
  appliesTo: 'reports',
  appliesToType: [E_CONSENT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'ec');
    return (
      getNumberOfReportsOfType(contact.reports, MAIN_COHORT_FORM) === 0 &&
      appliesIfEConsentToMainCohort(mostRecentReport) &&
      isMostRecentReport(report, mostRecentReport) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [MAIN_COHORT_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: MAIN_COHORT_FORM,
      modifyContent: function (content, contact) {
        // pre-loading from person object
        content.sex = contact.contact.sex;
        content.age = calculateAge(contact.contact);
        content.twic_arm = contact.contact.twic_arm;

      }
    }
  ],
  events: [{
    id: 'consent-to-main-cohort-event',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
