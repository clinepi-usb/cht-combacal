const {
  REPORTS,
  REPORT,
  TASK_EXPIRY_PERIOD,
  CLIN_EVENT_FORM,
  DM_INTERVENTION_FORM,
  MAIN_COHORT_FORM,
  DM_CONTROL_FORM,
  BP_CONTROL_FORM,
  CONTACTS,
  E_CONSENT_FORM,
  BP_INTERVENTION_FORM
} = require('../../data/ENUM');
const { getMostRecentReport, getMostRecentReportWithEvent, isMostRecentReport, hasWarningSymptoms } = require('../../nools-extras');
const { calculateDueDateForWarnings } = require('../dueDate');
const { preLoadingToAll } = require('../preloading');
const {appliesIfPersonClinEv} = require('../applies');
const {dateAtEndOfDay} = require('../utils');


const DM_INTERVENTION =
  {
    name: 'combacal.warnings.dm_intervention',
    icon: 'icon-disease-diabetes',
    title: 'Diabetes Form Follow-Up',
    appliesTo: REPORTS,
    appliesToType: [DM_INTERVENTION_FORM],
    appliesIf: function(contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        hasWarningSymptoms(mostRecentReport) &&
        !contact.contact.date_of_death &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return !hasWarningSymptoms(mostRecentReport);
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
      id: 'dm-intervention-warning-1',
      start: 7,
      end: TASK_EXPIRY_PERIOD,
      dueDate: function(event, contact) {
        const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
        return calculateDueDateForWarnings(mostRecentReport);
      }
    }]
  };

const DM_CONTROL =
{
  name: 'combacal.warnings.dm_control',
  icon: 'icon-disease-diabetes',
  title: 'Diabetes Form Follow-Up',
  appliesTo: REPORTS,
  appliesToType: [DM_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      hasWarningSymptoms(mostRecentReport) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
    return !hasWarningSymptoms(mostRecentReport);
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
    id: 'dm-control-warning-1',
    start: 7,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'dm');
      return calculateDueDateForWarnings(mostRecentReport);
    }
  }]
};

const BP_CONTROL =
{
  name: 'combacal.warnings.bp_control',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: REPORTS,
  appliesToType: [BP_CONTROL_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      hasWarningSymptoms(mostRecentReport) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return !hasWarningSymptoms(mostRecentReport);
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
    id: 'bp-control-warning-1',
    start: 7,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return calculateDueDateForWarnings(mostRecentReport);
    }
  }]
};

const BP_INTERVENTION =
{
  name: 'combacal.warnings.bp_intervention',
  icon: 'icon-healthcare-assessment',
  title: 'Hypertension Form Follow-up',
  appliesTo: REPORTS,
  appliesToType: [BP_INTERVENTION_FORM],
  appliesIf: function(contact, report) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return (
      isMostRecentReport(report, mostRecentReport) &&
      hasWarningSymptoms(mostRecentReport) &&
      !contact.contact.date_of_death &&
      contact.contact.name !== undefined
    );
  },
  resolvedIf: function(contact) {
    const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
    return !hasWarningSymptoms(mostRecentReport);
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
    id: 'bp-intervention-warning-1',
    start: 7,
    end: TASK_EXPIRY_PERIOD,
    dueDate: function(event, contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'bp');
      return calculateDueDateForWarnings(mostRecentReport);
    }
  }]
};

const MAIN_COHORT =
  {
    name: 'combacal.warnings.main-cohort',
    icon: 'icon-healthcare-diagnosis',
    title: 'Cohort Form Follow-Up',
    appliesTo: REPORTS,
    appliesToType: [MAIN_COHORT_FORM],
    appliesIf: function(contact, report) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'co');
      return (
        isMostRecentReport(report, mostRecentReport) &&
        hasWarningSymptoms(mostRecentReport) &&
        !contact.contact.date_of_death &&
        contact.contact.name !== undefined
      );
    },
    resolvedIf: function(contact) {
      const mostRecentReport = getMostRecentReport(contact.reports, 'co');
      return !hasWarningSymptoms(mostRecentReport);
    },
    actions: [
      {
        type: REPORT,
        form: MAIN_COHORT_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact, 'co');
        }
      }
    ],
    events: [{
      id: 'main-cohort-warning-1',
      start: 7,
      end: TASK_EXPIRY_PERIOD,
      days: 7
    }]
  };

const PERSON_CLIN_EVENT =
  {
    name: 'combacal.person-clin-ev',
    icon: 'icon-risk',
    title: 'Supervisor Clinical Event',
    appliesTo: CONTACTS,
    appliesToType: ['person'],
    appliesIf: function(contact) {
      //console.log('TEST 1: ', appliesIfPersonClinEv(contact.reports));
      return (
        appliesIfPersonClinEv(contact.reports) &&
        !contact.contact.date_of_death
      );
    },
    resolvedIf: function (contact) {
      try{
        const mostRecentReportDate = getMostRecentReportWithEvent(contact.reports).reported_date;
        const mostRecentReportSup = getMostRecentReport(contact.reports, 'su');
        let mostRecentReportSupDate = mostRecentReportSup.reported_date;
        if(mostRecentReportSup.form === E_CONSENT_FORM){
          mostRecentReportSupDate = 693402612070;
        }
        //console.log('TEST 2: ', mostRecentReportSupDate > mostRecentReportDate);
        return mostRecentReportSupDate > mostRecentReportDate;
      }catch{
        return false;
      }
    },
    actions: [
      {
        type: REPORT,
        form: CLIN_EVENT_FORM,
        modifyContent: function (content, contact) {
          preLoadingToAll(content, contact, 'bp', 1);
        }
      }
    ],
    events: [{
      id: 'person-clin-event',
      start: 0,
      end: TASK_EXPIRY_PERIOD,
      dueDate: function(event, contact) {
        const mostRecentReport = getMostRecentReportWithEvent(contact.reports);
        const dueDate =  dateAtEndOfDay(mostRecentReport.reported_date);
        return dueDate;
      }
    }]
  };


module.exports = {
  MAIN_COHORT,
  DM_INTERVENTION,
  DM_CONTROL,
  PERSON_CLIN_EVENT,
  BP_CONTROL,
  BP_INTERVENTION
};
