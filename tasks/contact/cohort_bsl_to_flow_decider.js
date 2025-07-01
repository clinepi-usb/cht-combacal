const { MAIN_COHORT_FORM, REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, FLOW_DECIDER_FORM, BP_CONTROL_FORM, BP_INTERVENTION_FORM, DM_CONTROL_FORM, DM_INTERVENTION_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormSubmitted, getMostRecentReport } = require('../../nools-extras');
const {appliesIfMainCohortToFlowDecider} = require('../applies');
const {checkAgeforBpFlow} = require('../utils');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForFlowDecider } = require('../dueDate');

module.exports =
{
  name: 'combacal.main-cohort-flow-decider',
  icon: 'icon-service-rating@2x',
  title: 'Flow Decider Form',
  appliesTo: 'reports',
  appliesToType: [MAIN_COHORT_FORM],
  appliesIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'co');
    
    return (
      getNumberOfReportsOfType(contact.reports, FLOW_DECIDER_FORM) === 0 &&
      appliesIfMainCohortToFlowDecider(mostRecentReport, contact.reports, contact) &&
      checkAgeforBpFlow(contact) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return (
      (getNumberOfReportsOfType(contact.reports, BP_CONTROL_FORM) >= 1 ||  
      getNumberOfReportsOfType(contact.reports, BP_INTERVENTION_FORM) >= 1 ||
      getNumberOfReportsOfType(contact.reports, DM_CONTROL_FORM) >= 1 || 
      getNumberOfReportsOfType(contact.reports, DM_INTERVENTION_FORM) >= 1)|| 
      isFormSubmitted(contact.reports, [FLOW_DECIDER_FORM])
    );
  }, 
  actions: [
    {
      type: REPORT,
      form: FLOW_DECIDER_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact, 'co');
      }
    }
  ],
  events: [{
    id: 'flow-decider-event',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact, report) {
      return calculateDueDateForFlowDecider(report, contact);
    }
  }]
};
