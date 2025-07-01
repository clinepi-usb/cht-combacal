/*const { isInReports } = require('../../nools-extras');


module.exports =
    {
      name: 'combacal.trial-arm.intervention.combacal.hiv',
      icon: 'icon-service-rating@2x',
      title: 'HIV Questionnaire',
      appliesTo: 'contacts',
      appliesToType: ['ccw'],
      appliesIf: function (ccw) {
        if (ccw.reports !== undefined){
          return (isInReports(ccw.reports, 'hiv_questionnaire') === false);
        }else{
          return true;
        }
      },  
      resolvedIf: function (ccw) {
        if (ccw.reports !== undefined){
          return (isInReports(ccw.reports, 'hiv_questionnaire') === true);
        }else{
          return false;
        }
      },
      actions: [
        {
          type: 'report',
          form: 'hiv_questionnaire',
        }
      ],
      events: [{
        id: 'hiv_questionnaire',
        start: 0,
        end: 365,
        days: 0,
      }]
    };*/
