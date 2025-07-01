const { 
  REPORTS, 
  REPORT, 
  CHOLESTEROL_FORM,
  DM_INTERVENTION_FORM,
  DUE_DATE_TEST_DAYS
} = require('../../data/ENUM');
const {getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact} = require('../../nools-extras');
const {appliesIfDmInterventionToChol, appliesIfDmInterventionToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmInterventiontoCholesterol} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-intervention-to-cholesterol',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (DM Baseline)',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmInterventionToChol(contact.reports) &&
        appliesIfDmInterventionToSmallFormsComplete6m(contact.reports) &&
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
      id: 'dm-intervention-cholesterol-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmInterventiontoCholesterol(contact.reports);
      }
    }]
  };

