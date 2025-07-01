const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, DM_INTERVENTION_FORM, DM_TWIC_STATUS, DM_TWIC_STATUS_FIELD} = require('../../data/ENUM');
const { getField, getMostRecentReport, isMostRecentReport } = require('../../nools-extras');
const {appliesIfDmInterventionSelfTwic} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForDmInterventionSelfTwic2 } = require('../dueDate');
const { todayDateAtEndOfDay, dateAtEndOfDay } = require('../utils');

module.exports =
{
  name: 'combacal.dm-intervention-dm-intervention-twic2',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [DM_INTERVENTION_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfDmInterventionSelfTwic(mostRecentReport, contact.reports) &&
      !contact.contact.date_of_death &&
      //checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    let result = false;
    if (contact.reports) {
      contact.reports.forEach((report) => {
        if (report.form === DM_INTERVENTION_FORM) {
          const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
          if(dm_twic_status === DM_TWIC_STATUS.SIX_M_COMPLETE){
            result = true;
          }
        }  
      });
      let oldest_report = contact.reports[contact.reports.length - 1];
      contact.reports.forEach((report) => {
        if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
          const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
          if(dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
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
      form: DM_INTERVENTION_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'dm-intervention-twic2-event-self-twic2',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      //console.error('Due Date: ', calculateDueDateForDmControlSelfTwic(contact.reports));
      return calculateDueDateForDmInterventionSelfTwic2(contact.reports);
    }
  }]
};
