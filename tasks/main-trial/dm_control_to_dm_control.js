const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, DM_CONTROL_FORM } = require('../../data/ENUM');
const { isMostRecentReport, checkDmDeactivation } = require('../../nools-extras');
const {appliesIfDmControlSelf} = require('../applies');
const {getMostRecentReport } = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForDmControlSelf } = require('../dueDate');

module.exports =
{
  name: 'combacal.dm-control-dm-control',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [DM_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfDmControlSelf(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return getMostRecentReport(contact.reports, 'dm').form !== DM_CONTROL_FORM;
  },
  actions: [
    {
      type: REPORT,
      form: DM_CONTROL_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'dm-control-event-self',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return calculateDueDateForDmControlSelf(mostRecentReport, contact.reports);
    }
  }]
};
