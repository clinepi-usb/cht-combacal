const { REPORT, TASK_EXPIRY_PERIOD, FLOW_DECIDER_FORM, DM_CONTROL_FORM, MAIN_COHORT_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, isMostRecentReport, addDate, checkDmDeactivation, getMostRecentReport} = require('../../nools-extras');
const {appliesIfMainCohortToDmControl} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforDmFlow} = require('../utils');

module.exports =
{
  name: 'combacal.main-cohort-dm-control',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form',
  appliesTo: 'reports',
  appliesToType: [MAIN_COHORT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'co');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      getNumberOfReportsOfType(contact.reports, DM_CONTROL_FORM) === 0 &&
      getNumberOfReportsOfType(contact.reports, FLOW_DECIDER_FORM) === 0 &&
      appliesIfMainCohortToDmControl(mostRecentReport, contact.reports, contact) &&
      checkAgeforDmFlow(contact) &&
      !contact.contact.date_of_death &&
      checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [DM_CONTROL_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: DM_CONTROL_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact, 'co');
      }
    }
  ],
  events: [{
    id: 'dm-control-event-1',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
