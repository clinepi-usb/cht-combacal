const { 
  REPORTS, 
  REPORT, 
  FBG_FORM,
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const { appliesIfDmControlToFbg, appliesIfDmControlToSmallFormsComplete6m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoFbg} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-fbg',
    icon: 'icon-healthcare-medicine',
    title: 'Fasting Blood Sugar Form',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToFbg(contact.reports) &&
        appliesIfDmControlToSmallFormsComplete6m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, FBG_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: FBG_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-control-fbg-event',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoFbg(contact.reports);
      }
    }]
  };
