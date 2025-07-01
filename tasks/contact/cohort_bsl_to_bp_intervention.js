const { REPORT, TASK_EXPIRY_PERIOD, MAIN_COHORT_FORM, FLOW_DECIDER_FORM, BP_INTERVENTION_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate, checkBpDeactivation, getMostRecentReport, isMostRecentReport} = require('../../nools-extras');
const {appliesIfMainCohortToBpIntervention} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforBpFlow} = require('../utils');

module.exports =
{
  name: 'combacal.main-cohort-bp-intervention',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form',
  appliesTo: 'reports',
  appliesToType: [MAIN_COHORT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'co');
    return (
      getNumberOfReportsOfType(contact.reports, BP_INTERVENTION_FORM) === 0 &&
      getNumberOfReportsOfType(contact.reports, FLOW_DECIDER_FORM) === 0 &&
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfMainCohortToBpIntervention(contact, mostRecentReport, contact.reports) &&
      checkAgeforBpFlow(contact) &&
      !contact.contact.date_of_death &&
      checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [BP_INTERVENTION_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: BP_INTERVENTION_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact, 'co');
      }
    }
  ],
  events: [{
    id: 'bp-intervention-event-10',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
