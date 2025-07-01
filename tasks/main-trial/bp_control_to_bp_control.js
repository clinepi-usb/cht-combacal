const { REPORT, DUE_DATE_TEST_DAYS, TASK_EXPIRY_PERIOD, BP_CONTROL_FORM } = require('../../data/ENUM');
const { isMostRecentReport } = require('../../nools-extras');
const {appliesIfBpControlSelf} = require('../applies');
const {getMostRecentReport, hasWarningSymptoms} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForBpControlSelf } = require('../dueDate');

module.exports =
{
  name: 'combacal.bp-control-bp-control',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [BP_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    /*console.log('bp_control_to_bp_control', (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfBpControlSelf(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      !hasWarningSymptoms(mostRecentReport) &&
      //checkBpDeactivation() &&
      contact.contact.name !== undefined
    ));*/
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfBpControlSelf(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      !hasWarningSymptoms(mostRecentReport) &&
      //checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return getMostRecentReport(contact.reports, 'bp').form !== BP_CONTROL_FORM;
  },
  actions: [
    {
      type: REPORT,
      form: BP_CONTROL_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'bp-control-event-self',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return calculateDueDateForBpControlSelf(mostRecentReport, contact.reports);
    }
  }]
};
