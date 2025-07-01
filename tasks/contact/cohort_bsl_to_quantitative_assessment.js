const { REPORT, TASK_EXPIRY_PERIOD, DUE_DATE_TEST_DAYS } = require('../../data/ENUM');
const { getNumberOfReportsOfType, isInReports} = require('../../nools-extras');
const { calculateDueDateForMainCohortToDCE } = require('../dueDate');

module.exports =
{
  name: 'combacal.main-cohort-quality-assessment',
  icon: 'icon-service-rating@2x',
  title: 'CHT Usability Assessment',
  appliesTo: 'contacts',
  appliesToType: ['ccw'],
  appliesIf: function(ccw) {
    
    return (
      getNumberOfReportsOfType(ccw.reports, 'usability_form') === 0 &&
      !ccw.contact.date_of_death &&
      ccw.contact.name !== undefined &&
      // village is one of the following
      ccw.contact.name !== undefined
    );
  },
  resolvedIf: function (ccw) {
    if (ccw.reports !== undefined){
      return (isInReports(ccw.reports, 'usability_form') === true);
    }else{
      return false;
    }
  },
  actions: [
    {
      type: REPORT,
      form: 'usability_form',
    }
  ],
  events: [{
    id: 'usability-event-1',
    start: DUE_DATE_TEST_DAYS,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function() {
      return calculateDueDateForMainCohortToDCE();
    }    
  }]
};
