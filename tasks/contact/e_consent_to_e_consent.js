const { MAIN_COHORT_FORM, REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, E_CONSENT_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, getMostRecentReport, getMostRecentReportAll, isMostRecentReport } = require('../../nools-extras');
const { calculateAge} = require('../utils');
const {appliesIfEConsentToEConsent} = require('../applies');
const { calculateDueDateForEConsentSelf } = require('../dueDate');

module.exports =
{
  name: 'combacal.e-consent-e-consent',
  icon: 'icon-healthcare-diagnosis',
  title: 'Consent Form',
  appliesTo: 'reports',
  appliesToType: [E_CONSENT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'ec');
    return (
      getNumberOfReportsOfType(contact.reports, MAIN_COHORT_FORM) === 0 &&
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfEConsentToEConsent(mostRecentReport) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return getMostRecentReportAll(contact.reports).form !== E_CONSENT_FORM;
  },
  actions: [
    {
      type: REPORT,
      form: E_CONSENT_FORM,
      modifyContent: function (content, contact) {
        // pre-loading from person object
        content.sex = contact.contact.sex;
        content.age = calculateAge(contact.contact);
      }
    }
  ],
  events: [{
    id: 'consent-to-consent-event',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'ec');
      return calculateDueDateForEConsentSelf(mostRecentReport);
    }
  }]
};
