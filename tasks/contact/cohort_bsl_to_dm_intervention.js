const { DM_INTERVENTION_FORM, REPORT, FLOW_DECIDER_FORM, TASK_EXPIRY_PERIOD, MAIN_COHORT_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate, checkDmDeactivation, getMostRecentReport, isMostRecentReport} = require('../../nools-extras');
const {appliesIfMainCohortToDmIntervention} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforDmFlow} = require('../utils');

module.exports =
{
  name: 'combacal.main-cohort-dm-intervention',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form',
  appliesTo: 'reports',
  appliesToType: [MAIN_COHORT_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'co');
    return (
      getNumberOfReportsOfType(contact.reports, DM_INTERVENTION_FORM) === 0 &&
      getNumberOfReportsOfType(contact.reports, FLOW_DECIDER_FORM) === 0 &&
      //getNumberOfReportsOfType(contact.reports, CORRECTION_FORM) === 0 &&
      appliesIfMainCohortToDmIntervention(mostRecentReport, contact.reports, contact) &&
      checkAgeforDmFlow(contact) &&
      !contact.contact.date_of_death &&
      isMostRecentReport(report, mostRecentReport) &&
      checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [DM_INTERVENTION_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: DM_INTERVENTION_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact, 'co');
      }
    }
  ],
  events: [{
    id: 'dm-intervention-event-10',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
