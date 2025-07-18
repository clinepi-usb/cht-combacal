const { 
  REPORTS, 
  REPORT, 
  DUE_DATE_TEST_DAYS,
  BP_CONTROL_FORM,
  CHOLESTEROL_BP_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact} = require('../../nools-extras');
const {appliesIfBpControlToChol, appliesIfBpControlToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForBpControltoCholesterol} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.bp-control-to-cholesterol',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (BP Baseline)',
    appliesTo: REPORTS,
    appliesToType: [BP_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfBpControlToChol(contact.reports) &&
        appliesIfBpControlToSmallFormsComplete6m(contact.reports) &&
        !contact.contact.date_of_death &&
        //checkBpDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_BP_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_BP_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'bp-control-cholesterol-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForBpControltoCholesterol(contact.reports);
      }
    }]
  };
