const { 
  REPORTS, 
  REPORT, 
  DM_INTERVENTION_FORM,
  DUE_DATE_TEST_DAYS,
  HBA1C_SIX_MONTHS_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact, checkDmDeactivation } = require('../../nools-extras');
const { appliesIfDmInterventionToHba1c6m, appliesIfDmInterventionToSmallFormsComplete12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmInterventiontoHba1c6m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-int-to-hba1c-6m',
    icon: 'icon-healthcare-medicine',
    title: 'HbA1c',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmInterventionToHba1c6m(contact.reports) &&
        appliesIfDmInterventionToSmallFormsComplete12m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, HBA1C_SIX_MONTHS_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: HBA1C_SIX_MONTHS_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-int-hba1c-event-6m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmInterventiontoHba1c6m(contact.reports);
      }
    }]
  };
