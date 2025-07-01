const { 
  REPORTS, 
  REPORT, 
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS,
  FBG_TWELVE_MONTHS_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const { appliesIfDmControlToFbg12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoFbg12m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-fbg-12m',
    icon: 'icon-healthcare-medicine',
    title: 'Fasting Blood Sugar Form',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToFbg12m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, FBG_TWELVE_MONTHS_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: FBG_TWELVE_MONTHS_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-control-fbg-event-12m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoFbg12m(contact.reports);
      }
    }]
  };
