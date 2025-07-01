const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, BP_CONTROL_FORM, AHT_TWIC_STATUS_FIELD, AHT_TWIC_STATUS} = require('../../data/ENUM');
const { getField, getMostRecentReport, isMostRecentReport } = require('../../nools-extras');
const {appliesIfBpControlSelfTwic} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForBpControlSelfTwic2 } = require('../dueDate');
const { todayDateAtEndOfDay, dateAtEndOfDay } = require('../utils');

module.exports =
{
  name: 'combacal.bp-control-bp-control-twic2',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [BP_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfBpControlSelfTwic(contact.reports) &&
      !contact.contact.date_of_death &&
      //checkBpDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    let result = false;
    if (contact.reports) {
      contact.reports.forEach((report) => {
        if (report.form === BP_CONTROL_FORM) {
          const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
          if(aht_twic_status === AHT_TWIC_STATUS.SIX_M_COMPLETE){
            result = true;
          }
        }  
      });
      let oldest_report = contact.reports[contact.reports.length - 1];
      contact.reports.forEach((report) => {
        if (report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
          const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
          if(aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE){
            oldest_report = report;
          }
        }  
      });
      if (((todayDateAtEndOfDay().getTime() - dateAtEndOfDay(oldest_report.reported_date).getTime())/ (1000 * 3600 * 24)) >= 300){
        result = true;
      }
    }
    return result;
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
    id: 'bp-control-event-self-twic2',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      //console.error('Due Date: ', calculateDueDateForDmControlSelfTwic(contact.reports));
      return calculateDueDateForBpControlSelfTwic2(contact.reports);
    }
  }]
};
