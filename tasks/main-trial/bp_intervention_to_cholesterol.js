const { 
  REPORTS, 
  REPORT, 
  DUE_DATE_TEST_DAYS,
  BP_INTERVENTION_FORM,
  CHOLESTEROL_BP_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact} = require('../../nools-extras');
const {appliesIfBpInterventionToChol, appliesIfBpInterventionToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForBpInterventiontoCholesterol} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.bp-intervention-to-cholesterol',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (BP Baseline)',
    appliesTo: REPORTS,
    appliesToType: [BP_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfBpInterventionToChol(contact.reports) &&
        appliesIfBpInterventionToSmallFormsComplete6m(contact.reports) &&
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
      id: 'bp-intervention-cholesterol-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForBpInterventiontoCholesterol(contact.reports);
      }
    }]
  };
