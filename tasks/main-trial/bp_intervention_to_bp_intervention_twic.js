const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, AHT_TWIC_STATUS_FIELD, AHT_TWIC_STATUS, BP_INTERVENTION_FORM} = require('../../data/ENUM');
const { getField, getMostRecentReport, isMostRecentReport } = require('../../nools-extras');
const {appliesIfBpInterventionSelfTwic} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForBpInterventionSelfTwic } = require('../dueDate');

module.exports =
{
  name: 'combacal.bp-intervention-bp-intervention-twic',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [BP_INTERVENTION_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfBpInterventionSelfTwic(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      //checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    let result = false;
    if (contact.reports) {
      contact.reports.forEach((report) => {
        if (report.form === BP_INTERVENTION_FORM) {
          const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
          if(aht_twic_status === AHT_TWIC_STATUS.TWELVE_M_COMPLETE){
            result = true;
          }
        }  
      });
    }
    return result;
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
    id: 'bp-intervention-event-self-twic',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      //console.error('Due Date: ', calculateDueDateForDmControlSelfTwic(contact.reports));
      return calculateDueDateForBpInterventionSelfTwic(contact.reports);
    }
  }]
};
