const { REPORT, TASK_EXPIRY_PERIOD, FLOW_DECIDER_FORM, BP_CONTROL_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate } = require('../../nools-extras');
const {appliesIfFlowDeciderToBpControl} = require('../applies');
const {getMostRecentReport} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const {checkAgeforBpFlow} = require('../utils');

module.exports =
{
  name: 'combacal.flow-decider-bp-control',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form',
  appliesTo: 'reports',
  appliesToType: [FLOW_DECIDER_FORM],
  appliesIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'fl');

    return (
      getNumberOfReportsOfType(contact.reports, BP_CONTROL_FORM) === 0 &&
      appliesIfFlowDeciderToBpControl(mostRecentReport, contact.reports, contact) &&
      !contact.contact.date_of_death &&
      checkAgeforBpFlow(contact) &&
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
        preLoadingToAll(content, contact, 'fl');
      }
    }
  ],
  events: [{
    id: 'bp-control-event-1',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
