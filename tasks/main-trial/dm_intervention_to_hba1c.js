const { 
  REPORTS, 
  REPORT, 
  HBA1C_FORM,
  DM_INTERVENTION_FORM,
  DUE_DATE_TEST_DAYS
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact, checkDmDeactivation } = require('../../nools-extras');
const { appliesIfDmInterventionToHba1c, appliesIfDmInterventionToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmInterventiontoHba1c} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-intervention-to-hba1c',
    icon: 'icon-healthcare-medicine',
    title: 'HbA1c',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmInterventionToHba1c(contact.reports) &&
        appliesIfDmInterventionToSmallFormsComplete6m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, HBA1C_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: HBA1C_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-intervention-hba1c-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmInterventiontoHba1c(contact.reports);
      }
    }]
  };
