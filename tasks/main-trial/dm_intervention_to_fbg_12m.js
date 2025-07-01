const { 
  REPORTS, 
  REPORT, 
  DM_INTERVENTION_FORM,
  DUE_DATE_TEST_DAYS,
  FBG_TWELVE_MONTHS_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact } = require('../../nools-extras');
const { appliesIfDmInterventionToFbg12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmInterventiontoFbg12m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-int-to-fbg-12m',
    icon: 'icon-healthcare-medicine',
    title: 'Fasting Blood Sugar Form',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmInterventionToFbg12m(contact.reports) &&
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
      id: 'dm-int-fbg-event-12m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmInterventiontoFbg12m(contact.reports);
      }
    }]
  };
