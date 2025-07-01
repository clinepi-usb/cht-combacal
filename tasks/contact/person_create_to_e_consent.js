const { CONTACTS, REPORT, TASK_EXPIRY_PERIOD, E_CONSENT_FORM } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isFormArraySubmittedInWindow, addDate } = require('../../nools-extras');
const { calculateAge } = require('../utils');

module.exports =
{
  name: 'combacal.client-create-e-consent',
  icon: 'icon-healthcare-diagnosis',
  title: 'Consent Form',
  appliesTo: CONTACTS,
  appliesToType: ['person'],
  appliesIf: function(contact) {
    return (
      getNumberOfReportsOfType(contact.reports, E_CONSENT_FORM) === 0 &&
      !contact.contact.date_of_death
    );
  },
  resolvedIf: function(contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(
      contact.reports,
      [E_CONSENT_FORM],
      addDate(dueDate, -event.start).getTime(),
      addDate(dueDate, event.end + 1).getTime()
    );
  },
  actions: [
    {
      type: REPORT,
      form: E_CONSENT_FORM,
      modifyContent: function (content, contact) {
        // pre-loading from person object
        content.sex = contact.contact.sex;
        content.age = calculateAge(contact.contact);
      }
    }
  ],
  events: [{
    id: 'e-consent-event',
    start: 0,
    end: TASK_EXPIRY_PERIOD,
    days: 0,
  }]
};
