const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS, DM_CONTROL_FORM, DM_TWIC_STATUS, DM_TWIC_STATUS_FIELD} = require('../../data/ENUM');
const { checkDmDeactivation, getField, getMostRecentReport, isMostRecentReport } = require('../../nools-extras');
const {appliesIfDmControlSelfTwic} = require('../applies');
const {preLoadingToAll} = require('../preloading');
const { calculateDueDateForDmControlSelfTwic } = require('../dueDate');

module.exports =
{
  name: 'combacal.dm-control-dm-control-twic',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form Follow-up',
  appliesTo: 'reports',
  appliesToType: [DM_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      appliesIfDmControlSelfTwic(contact.reports) &&
      !contact.contact.date_of_death &&
      checkDmDeactivation() &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    let result = false;
    if (contact.reports) {
      contact.reports.forEach((report) => {
        if (report.form === DM_CONTROL_FORM) {
          const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
          if(dm_twic_status === DM_TWIC_STATUS.TWELVE_M_COMPLETE){
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
      form: DM_CONTROL_FORM,
      modifyContent: function (content, contact) {
        preLoadingToAll(content, contact);
      }
    }
  ],
  events: [{
    id: 'dm-control-event-self-twic',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      //console.error('Due Date: ', calculateDueDateForDmControlSelfTwic(contact.reports));
      return calculateDueDateForDmControlSelfTwic(contact.reports);
    }
  }]
};
