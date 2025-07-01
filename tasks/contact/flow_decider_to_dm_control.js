const { REPORT, TASK_EXPIRY_PERIOD, DM_CONTROL_FORM, FLOW_DECIDER_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate, checkDmDeactivation } = require('../../nools-extras');
const {appliesIfMainCohortToDmControl} = require('../applies');
const {getMostRecentReport} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforDmFlow} = require('../utils');

module.exports =
{
  name: 'combacal.flow-decider-dm-control',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form',
  appliesTo: 'reports',
  appliesToType: [FLOW_DECIDER_FORM],
  appliesIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'fl');    
    return (
      getNumberOfReportsOfType(contact.reports, DM_CONTROL_FORM) === 0 &&
      appliesIfMainCohortToDmControl(mostRecentReport, contact.reports, contact) &&
      !contact.contact.date_of_death &&
      checkAgeforDmFlow(contact) &&
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
        preLoadingToAll(content, contact, 'fl');
      }
    }
  ],
  events: [{
    id: 'dm-control-event-10',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
