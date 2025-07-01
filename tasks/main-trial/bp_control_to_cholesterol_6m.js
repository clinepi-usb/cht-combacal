const { 
  REPORTS, 
  REPORT, 
  DUE_DATE_TEST_DAYS,
  BP_CONTROL_FORM,
  CHOLESTEROL_SIX_MONTHS_BP_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const {appliesIfBpControlToChol6m, appliesIfBpControlToSmallFormsComplete12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForBpControltoCholesterol6m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.bp-control-to-cholesterol-6m',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (BP 6 months)',
    appliesTo: REPORTS,
    appliesToType: [BP_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfBpControlToChol6m(contact.reports) &&
        appliesIfBpControlToSmallFormsComplete12m(contact.reports) &&
        !contact.contact.date_of_death &&
        //checkBpDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_SIX_MONTHS_BP_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_SIX_MONTHS_BP_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'bp-control-cholesterol-event-6m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForBpControltoCholesterol6m(contact.reports);
      }
    }]
  };
