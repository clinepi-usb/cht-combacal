const { 
  REPORTS, 
  REPORT, 
  CHOLESTEROL_FORM,
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const {appliesIfDmControlToChol, appliesIfDmControlToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoCholesterol} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-cholesterol',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (DM Baseline)',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToChol(contact.reports) &&
        appliesIfDmControlToSmallFormsComplete6m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-control-cholesterol-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoCholesterol(contact.reports);
      }
    }]
  };
