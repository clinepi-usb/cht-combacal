const { 
  REPORTS, 
  REPORT, 
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS,
  HBA1C_SIX_MONTHS_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, getNumberOfReportsOfTypeExact, checkDmDeactivation } = require('../../nools-extras');
const { appliesIfDmControlToHba1c6m, appliesIfDmControlToSmallFormsComplete12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoHba1c6m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-hba1c-6m',
    icon: 'icon-healthcare-medicine',
    title: 'HbA1c',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToHba1c6m(contact.reports) &&
        appliesIfDmControlToSmallFormsComplete12m(contact.reports) &&
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
      id: 'dm-control-hba1c-event-6m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoHba1c6m(contact.reports);
      }
    }]
  };
