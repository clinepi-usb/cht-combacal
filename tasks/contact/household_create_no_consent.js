const { CONTACTS, TASK_EXPIRY_PERIOD } = require('../../data/ENUM');
const { getJsonField } = require('../utils');

module.exports =
{
  name: 'combacal.household-create-no-consent',
  icon: 'medic-clinic',
  title: 'Household No Consent Follow-Up',
  appliesTo: CONTACTS,
  appliesToType: ['household'],
  appliesIf: function(contact) {
    return getJsonField(() => contact.contact.hh_consent_group.hh_status) === 'hhh_absent';
  },
  resolvedIf: function(contact) {
    return getJsonField(() => contact.contact.hh_consent_group.hh_status) === 'consented';
  },
  actions: [
    {
      type: 'report',
      form: 'household_reminder',
      modifyContent: function(content, contact) {
        content.household_name = contact.contact.name;
      }
    }
  ],
  events: [{
    id: 'household-no-consent-event-1',
    start: 1,
    end: TASK_EXPIRY_PERIOD,
    days: 1,
  }]
};
