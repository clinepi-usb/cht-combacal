const { 
  REPORTS, 
  REPORT, 
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS,
  FBG_SIX_MONTHS_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const { appliesIfDmControlToFbg6m, appliesIfDmControlToSmallFormsComplete12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoFbg6m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-fbg-6m',
    icon: 'icon-healthcare-medicine',
    title: 'Fasting Blood Sugar Form',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToFbg6m(contact.reports) &&
        appliesIfDmControlToSmallFormsComplete12m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, FBG_SIX_MONTHS_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: FBG_SIX_MONTHS_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-control-fbg-event-6m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoFbg6m(contact.reports);
      }
    }]
  };
