const { CONTACTS, TASK_EXPIRY_PERIOD } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate } = require('../../nools-extras');
const { getJsonField } = require('../utils');

module.exports =
{
  name: 'combacal.household-create-to-household-enumeration',
  icon: 'medic-clinic',
  title: 'Household Form',
  appliesTo: CONTACTS,
  appliesToType: ['household'],
  appliesIf: function(contact) {
    return (
      getNumberOfReportsOfType(contact.reports, 'hh_form') === 0 &&
      getJsonField(() => contact.contact.hh_consent_group.hh_status) === 'consented'
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      ['hh_form'],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: 'report',
      form: 'hh_form',
      modifyContent: function(content) {
        content.included = 1;
      }
    }
  ],
  events: [{
    id: 'household-enumeration',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
