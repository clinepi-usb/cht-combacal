const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, BP_INTERVENTION_FORM } = require('../../data/ENUM');
const { isMostRecentReport, checkBpDeactivation, hasWarningSymptoms } = require('../../nools-extras');
const {appliesIfBpInterventionSelf} = require('../applies');
const {getMostRecentReport} = require('../../nools-extras');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForBpInterventionSelf } = require('../dueDate');

module.exports =
{
  name: 'combacal.bp-intervention-bp-intervention',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [BP_INTERVENTION_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');

    /*console.log('appliesIfBPIntervention to bp intervention', (isMostRecentReport(report, mostRecentReport) &&
    appliesIfBpInterventionSelf(mostRecentReport, contact.reports) &&
    !contact.contact.date_of_death &&
    checkBpDeactivation() &&
    contact.contact.name !== undefined));
    */
    return (
      isMostRecentReport(report, mostRecentReport) &&
      !hasWarningSymptoms(mostRecentReport) &&
      appliesIfBpInterventionSelf(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    return getMostRecentReport(contact.reports, 'bp').form !== BP_INTERVENTION_FORM;
  },
  actions: [
    {
      type: REPORT,
      form: BP_INTERVENTION_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'bp-intervention-event-self',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return calculateDueDateForBpInterventionSelf(mostRecentReport, contact.reports);
    }
  }]
};
