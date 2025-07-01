const { 
  REPORTS, 
  REPORT, 
  DUE_DATE_TEST_DAYS,
  BP_CONTROL_FORM,
  CHOLESTEROL_TWELVE_MONTHS_BP_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const {appliesIfBpControlToChol12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForBpControltoCholesterol12m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.bp-control-to-cholesterol-12m',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (BP 12 months)',
    appliesTo: REPORTS,
    appliesToType: [BP_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfBpControlToChol12m(contact.reports) &&
        !contact.contact.date_of_death &&
        //checkBpDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_TWELVE_MONTHS_BP_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_TWELVE_MONTHS_BP_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'bp-control-cholesterol-event-12m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForBpControltoCholesterol12m(contact.reports);
      }
    }]
  };
