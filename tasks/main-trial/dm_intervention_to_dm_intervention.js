const { DM_INTERVENTION_FORM, REPORT, DUE_DATE_TEST_DAYS, TASK_EXPIRY_PERIOD } = require('../../data/ENUM');
const { isMostRecentReport, checkDmDeactivation } = require('../../nools-extras');
const {appliesIfDmInterventionSelf} = require('../applies');
const {getMostRecentReport} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForDmInterventionSelf } = require('../dueDate');

module.exports =
{
  name: 'combacal.dm-intervention-dm-intervention',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [DM_INTERVENTION_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfDmInterventionSelf(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return getMostRecentReport(contact.reports, 'dm').form !== DM_INTERVENTION_FORM;
  },
  actions: [
    {
      type: REPORT,
      form: DM_INTERVENTION_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'dm-intervention-event-self',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return calculateDueDateForDmInterventionSelf(mostRecentReport, contact.reports);
    }
  }]
};
