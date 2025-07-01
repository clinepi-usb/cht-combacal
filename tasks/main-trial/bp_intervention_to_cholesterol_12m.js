const { 
  REPORTS, 
  REPORT, 
  DUE_DATE_TEST_DAYS,
  CHOLESTEROL_TWELVE_MONTHS_BP_FORM,
  BP_INTERVENTION_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const {appliesIfBpInterventionToChol12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForBpInterventiontoCholesterol12m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.bp-intervention-to-cholesterol-12m',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (BP 12 months)',
    appliesTo: REPORTS,
    appliesToType: [BP_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfBpInterventionToChol12m(contact.reports) &&
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
      id: 'bp-intervention-cholesterol-event-12m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForBpInterventiontoCholesterol12m(contact.reports);
      }
    }]
  };
