const { 
  REPORTS, 
  REPORT, 
  DM_CONTROL_FORM,
  DUE_DATE_TEST_DAYS,
  CHOLESTEROL_TWELVE_MONTHS_FORM
} = require('../../data/ENUM');
const {getMostRecentReport, isMostRecentReport, checkDmDeactivation, getNumberOfReportsOfTypeExact} = require('../../nools-extras');
const {appliesIfDmControlToChol12m} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {calculateDueDateForDmControltoCholesterol12m} = require('../dueDate');

module.exports =
  {
    name: 'combacal.main-trial.dm-control-to-cholesterol-12m',
    icon: 'icon-healthcare-medicine',
    title: 'Cholesterol (DM 12 months)',
    appliesTo: REPORTS,
    appliesToType: [DM_CONTROL_FORM],
    appliesIf: function (contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        appliesIfDmControlToChol12m(contact.reports) &&
        !contact.contact.date_of_death &&
        checkDmDeactivation() &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      return getNumberOfReportsOfTypeExact(contact.reports, CHOLESTEROL_TWELVE_MONTHS_FORM) >= 1;
    },
    actions: [
      {
        type: REPORT,
        form: CHOLESTEROL_TWELVE_MONTHS_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact);
        }
      }
    ],
    events: [{
      id: 'dm-control-cholesterol-event-12m',
      start: DUE_DATE_TEST_DAYS,
      end: 150,
      dueDate: function(event, contact) {
        return calculateDueDateForDmControltoCholesterol12m(contact.reports);
      }
    }]
  };
