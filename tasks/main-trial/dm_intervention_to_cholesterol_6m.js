const { 
  REPORTS, 
  REPORT, 
  DM_INTERVENTION_FORM,
  DUE_DATE_TEST_DAYS,
  CHOLESTEROL_SIX_MONTHS_FORM
} = require('../../data/ENUM');
const {getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact} = require('../../nools-extras');
const {appliesIfDmInterventionToChol6m, appliesIfDmInterventionToSmallFormsComplete12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmInterventiontoCholesterol6m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-int-to-cholesterol-6m',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (DM 6 months)',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmInterventionToChol6m(contact.reports) &&
        appliesIfDmInterventionToSmallFormsComplete12m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_SIX_MONTHS_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_SIX_MONTHS_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-int-cholesterol-event-6m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmInterventiontoCholesterol6m(contact.reports);
      }
    }]
  };
