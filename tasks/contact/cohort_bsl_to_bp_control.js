const { REPORT, TASK_EXPIRY_PERIOD, FLOW_DECIDER_FORM, MAIN_COHORT_FORM, BP_CONTROL_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate, isMostRecentReport, getMostRecentReport} = require('../../nools-extras');
const {appliesIfMainCohortToBpControl} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforBpFlow} = require('../utils');

module.exports =
{
  name: 'combacal.main-cohort-bp-control',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form',
  appliesTo: 'reports',
  appliesToType: [MAIN_COHORT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'co');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      getNumberOfReportsOfType(contact.reports, BP_CONTROL_FORM) === 0 &&
      getNumberOfReportsOfType(contact.reports, FLOW_DECIDER_FORM) === 0 &&
      appliesIfMainCohortToBpControl(mostRecentReport, contact.reports, contact) &&
      checkAgeforBpFlow(contact) &&
      !contact.contact.date_of_death &&
      //checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [BP_CONTROL_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: BP_CONTROL_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact, 'co');
      }
    }
  ],
  events: [{
    id: 'bp-control-event-10',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
