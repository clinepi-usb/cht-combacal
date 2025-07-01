const { WITHDRAWAL_FORM, TRANSFER_OUT_FORM, DM_TWIC_DEACTIVATE, BP_DEACTIVATE, DM_DEACTIVATE, CLIN_EVENT_FORM_DEACTIVATE, CLIN_EVENT_FIELD } = require('./data/ENUM');

const today = getDateMS(Date.now());
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MAX_DAYS_IN_PREGNANCY = 42 * 7;  // 42 weeks = 294 days
const pregnancyForms = ['pregnancy'];
const deliveryForms = ['delivery'];
const antenatalForms = ['pregnancy_home_visit'];
const allANCForms = ['pregnancy', 'pregnancy_home_visit', 'pregnancy_facility_visit_reminder',
  'pregnancy_danger_sign', 'pregnancy_danger_sign_follow_up', 'delivery'];

function isAlive(contact) {
  return contact && contact.contact && !contact.contact.date_of_death;
}

function reportHasType(report, type) {
  return report.form === type;
}

function reportHasTrialArm(report, trialArm) {
  return report.fields.trial_arm === trialArm;
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @param flowType indicates the flow the report belongs to
 * @returns latest report of any type
 */
function getMostRecentReport(reports, flowType = 'bp') { //TODO maybe rename method to getMostRecentReportByFlowType
  if (!reports) {
    return;
  }
  
  //if there is only e_consent and main_cohort in reprots return main_cohort
  if (reports.length === 2 && reports[0].form === 'e_consent' && reports[1].form === 'cohort_bsl') {
    return reports[1];
  }

  // if there are other reports in reports, return the one with the latest reported_date and a substring of flowType
  let mostRecentReport = reports[0];
  reports.forEach(report => {
    if (report.form.substring(0, 2) === flowType) {
      if (mostRecentReport.form.substring(0, 2) !== flowType) {
        mostRecentReport = report;
      }
      if (report.reported_date >= mostRecentReport.reported_date) {
        mostRecentReport = report;
      }
    }
  });
  return mostRecentReport;
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @param flowType indicates the flow the report belongs to
 * @returns latest report of any type
 */
function getMostRecentReportPreloading(reports) { //TODO maybe rename method to getMostRecentReportByFlowType
  if (!reports) {
    return;
  }
  
  //if there is only e_consent and main_cohort in reprots return main_cohort
  if (reports.length === 2 && reports[0].form === 'e_consent' && reports[1].form === 'cohort_bsl') {
    return reports[1];
  }

  // if there are other reports in reports, return the one with the latest reported_date and a substring of flowType
  let mostRecentReport = reports[0];
  reports.forEach(report => {
    if (report.form.substring(0, 2) === 'bp' || report.form.substring(0, 2) === 'dm' || report.form.substring(0, 2) === 'co' || report.form.substring(0, 2) === 'dt'|| report.form.substring(0, 2) === 'su' || report.form.substring(0, 2) === 'fl') {
      if (report.form.substring(0, 2) !== 'bp' || report.form.substring(0, 2) !== 'dm' || report.form.substring(0, 2) !== 'co' || report.form.substring(0, 2) !== 'dt'|| report.form.substring(0, 2) !== 'su' || report.form.substring(0, 2) !== 'fl') {
        mostRecentReport = report;
      }
      if (report.reported_date >= mostRecentReport.reported_date) {
        mostRecentReport = report;
      }
    }
  });
  return mostRecentReport;
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @param flowType indicates the flow the report belongs to
 * @returns latest report of any type
 */
function getMostRecentReportClientOverview(reports) { //TODO maybe rename method to getMostRecentReportByFlowType
  if (!reports) {
    return;
  }
  
  //if there is only e_consent and main_cohort in reprots return main_cohort
  if (reports.length === 2 && reports[0].form === 'e_consent' && reports[1].form === 'cohort_bsl') {
    return reports[1];
  }
  const allReportsSorted = [];
  for(let i = reports.length - 1; i >= 0; i--) {
    const valueAtIndex = reports[i];
    allReportsSorted.push(valueAtIndex);
  }
  // if there are other reports in reports, return the one with the latest reported_date and a substring of flowType
  let mostRecentReport = allReportsSorted[0];
  allReportsSorted.forEach(report => {
    if (report.form.substring(0, 2) === 'bp' || report.form.substring(0, 2) === 'dm' || report.form.substring(0, 2) === 'co' || report.form.substring(0, 2) === 'fl') {
      if (report.reported_date >= mostRecentReport.reported_date) {
        mostRecentReport = report;
      }
    }
  });
  return mostRecentReport;
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @param flowType indicates the flow the report belongs to
 * @returns latest report of any type
 */
function getMostRecentReportNotNewAction(reports) { //TODO maybe rename method to getMostRecentReportByFlowType
  if (!reports) {
    return;
  }
  
  //if there is only e_consent and main_cohort in reprots return main_cohort
  if (reports.length === 2 && reports[0].form === 'e_consent' && reports[1].form === 'cohort_bsl') {
    return reports[1];
  }

  // if there are other reports in reports, return the one with the latest reported_date and a substring of flowType
  let mostRecentReport = reports[0];
  reports.forEach(report => {
    if (report.form.substring(0, 2) === 'bp' || report.form.substring(0, 2) === 'dm' || report.form.substring(0, 2) === 'co' || report.form.substring(0, 2) === 'fb'|| report.form.substring(0, 2) === 'su' || report.form.substring(0, 2) === 'fl' || report.form.substring(0, 2) === 'ch' || report.form.substring(0, 2) === 'hb' || report.form.substring(0, 2) === 'hy') {
      if (report.form.substring(0, 2) !== 'bp' || report.form.substring(0, 2) !== 'dm' || report.form.substring(0, 2) !== 'co' || report.form.substring(0, 2) !== 'fb'|| report.form.substring(0, 2) !== 'su' || report.form.substring(0, 2) !== 'fl' || report.form.substring(0, 2) !== 'ch' || report.form.substring(0, 2) !== 'hb' || report.form.substring(0, 2) !== 'hy') {
        mostRecentReport = report;
      }
      if (report.reported_date >= mostRecentReport.reported_date) {
        mostRecentReport = report;
      }
    }
  });
  return mostRecentReport;
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @param flowType indicates the flow the report belongs to
 * @returns latest report of any type
 */
function getMostRecentReportWithEvent(reports) { //TODO maybe rename method to getMostRecentReportByFlowType
  if (!reports) {
    return;
  }

  // if there are other reports in reports, return the one with the latest reported_date and a substring of flowType
  let mostRecentReport = reports[0];
  let found = false;
  reports.forEach(report => {
    const clin_ev = getField(report, CLIN_EVENT_FIELD);
    if (!clin_ev){
      return;
    }
    if (clin_ev  === '1') {
      if (report.reported_date >= mostRecentReport.reported_date) {
        mostRecentReport = report;
        found = true;
      }
    }
  });
  if(found){
    return mostRecentReport;
  }else{
    return;
  }
}

/**
 * Looks up the submitted reports for the latest one
 * @param {contact.reports} reports all reports of a given contact
 * @returns latest report of any type
 */
function getMostRecentReportAll(reports) {
  if (!reports) {
    return;
  }
  let latestReport = reports[0];
  reports.forEach(report => {
    if (report.reported_date > latestReport.reported_date) {
      latestReport = report;
    }
  });
  return latestReport;
}


function isInReports(reports, form){
  if (!reports) {
    return false;
  }
  for (let i = 0; i < reports.length; i++ ){
    if (reports[i].form === form){
      return true;
    }
  }
  return false;
}

/**
 * Looks up the submitted reports for the latest one and returns only its type
 * @param {contact.reports} reports all reports of a given contact
 * @returns type of latest report
 */
function getMostRecentReportType(reports, flowType = 'bp') {
  if (!reports) {
    return;
  }
  const latestReport = getMostRecentReport(reports, flowType);
  return latestReport.form;
}

/**
 * Checks if BP Flow is deactivated
 * @returns true if not deactivated
 */
function checkBpDeactivation() {
  return !BP_DEACTIVATE;
}

/**
 * Checks if DM Flow is deactivated
 * @returns true if not deactivated
 */
function checkDmDeactivation() {
  return !DM_DEACTIVATE;
}

/**
 * Checks if DM Flow is deactivated
 * @returns true if not deactivated
 */
function checkDmTwicDeactivation() {
  return !DM_TWIC_DEACTIVATE;
}

/**
 * Checks if DM Flow is deactivated
 * @returns true if not deactivated
 */
function checkClinEvFormDeactivation() {
  return !CLIN_EVENT_FORM_DEACTIVATE;
}

/**
 * Looks up the submitted reports for the latest one and returns if it is not a free floating form
 * @param {contact.reports} reports all reports of a given contact
 * @returns true if not free floating form
 */
function checkForFreeFloatingForms(reports) {
  if (!reports) {
    return;
  }
  let latestReport = reports[0];
  reports.forEach(report => {
    if (report.reported_date > latestReport.reported_date) {
      latestReport = report;
    }
  });
  return latestReport.form !== WITHDRAWAL_FORM && latestReport.form !== TRANSFER_OUT_FORM;
}

function isMostRecentReport(report, mostRecentReport) {
  return report.reported_date === mostRecentReport.reported_date;
}

function getNewestReportType(reports) {
  if (!reports) {
    console.error('contact has no reports');
  }
  return reports.sort((r1, r2) => (r1.reported_date < r2.reported_date) ? 1 : -1)[0].form;
}

function getNumberOfReportsOfType(reports, form) {
  let count = 0;
  reports.forEach(function (report) {
    if (form.includes(report.form) && !report.deleted) {
      count += 1;
    }
  });
  return count;
}

function getNumberOfReportsOfTypeExact(reports, form) {
  let count = 0;
  reports.forEach(function (report) {
    if (form === report.form && !report.deleted) {
      count += 1;
    }
  });
  return count;
}

function countNumberOfOpenEvents(reports) {
  let count = 0;
  reports.forEach(report => {
    const clin_ev = getField(report, CLIN_EVENT_FIELD);
    if (clin_ev  === '1') {
      count = count + 1;
    }
  });
  return count;
}

function appliesToFieldOfReport(report, expectedForm, field, expectedValue) {
  if (report.form && report.form  === expectedForm) {
    const targetValue =  getField(report, field);
    //console.error('TARGET VALUE: ', targetValue);
    return targetValue !== undefined && targetValue === expectedValue;
  }
  return false;
}

function resolvedByFieldOfReport(report, expectedForm, field, expectedValue) {
  if (report.form && report.form  === expectedForm) {
    const targetValue =  getField(report, field);
    return targetValue !== undefined && targetValue !== expectedValue;
  }
  return false;
}

function resolvedByFieldOfMostRecentReport(reports, expectedForm, field, expectedValue) {
  const form = getMostRecentReport(reports, expectedForm);
  if (form !== undefined) {
    const targetValue =  getField(form, field);
    return targetValue !== undefined && targetValue !== expectedValue;
  }
  return false;
}

function getField(report, fieldPath) {
  try {
    return parseField(report, fieldPath);
  } catch (error) {
    console.warn('error when trying to parse field: ', fieldPath);
  }
}
const parseField = (report, fieldPath) => ['fields', ...(fieldPath || '').split('.')]
  .reduce((prev, fieldName) => {
    if (prev === undefined) { return undefined; }
    return prev[fieldName];
  }, report);

function getContactField(report, fieldPath) {
  try {
    return parseContactField(report, fieldPath);
  } catch (error) {
    console.warn('error when trying to parse field: ', fieldPath);
  }
}

const parseContactField = (report, fieldPath) => [...(fieldPath || '').split('.')]
  .reduce((prev, fieldName) => {
    if (prev === undefined) { return undefined; }
    return prev[fieldName];
  }, report);

function isFormArraySubmittedInWindow(reports, formArray, start, end, count) {
  let found = false;
  let reportCount = 0;
  reports.forEach(function (report) {
    if (formArray.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        found = true;
        if (count) {
          reportCount++;
        }
      }
    }
  });

  if (count) { return reportCount >= count; }
  return found;
}

function isFormSubmitted(reports, formArray) {
  let found = false;
  reports.forEach(function (report) {
    if (formArray.includes(report.form)) {
      found = true;
    }
  });
  return found;
}


function isFormArraySubmittedInWindowExcludingThisReport(reports, formArray, start, end, exReport, count) {
  let found = false;
  let reportCount = 0;
  reports.forEach(function (report) {
    if (formArray.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end && report._id !== exReport._id) {
        found = true;
        if (count) {
          reportCount++;
        }
      }
    }
  });
  if (count) { return reportCount >= count; }
  else { return found; }
}


function getMostRecentReportOfType(reports, form) {
  let result;
  reports.forEach(function (report) {
    if (form === report.form &&
      !report.deleted &&
      (!result || report.reported_date > result.reported_date)) {
      result = report;
    }
  });
  return result;
}

function getNewestPregnancyTimestamp(contact) {
  if (!contact.contact) { return; }
  const newestPregnancy = getMostRecentReport(contact.reports, 'pregnancy');
  return newestPregnancy ? newestPregnancy.reported_date : 0;
}

function getNewestDeliveryTimestamp(contact) {
  if (!contact.contact) { return; }
  const newestDelivery = getMostRecentReport(contact.reports, 'delivery');
  return newestDelivery ? newestDelivery.reported_date : 0;
}

function isFacilityDelivery(contact, report) {
  if (!contact) {
    return false;
  }
  if (arguments.length === 1) { report = contact; }
  return getField(report, 'facility_delivery') === 'yes';
}

function countReportsSubmittedInWindow(reports, form, start, end, condition) {
  let reportsFound = 0;
  reports.forEach(function (report) {
    if (form.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        if (!condition || condition(report)) {
          reportsFound++;
        }
      }
    }
  });
  return reportsFound;
}

function getReportsSubmittedInWindow(reports, form, start, end, condition) {
  const reportsFound = [];
  reports.forEach(function (report) {
    if (form.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        if (!condition || condition(report)) {
          reportsFound.push(report);
        }
      }
    }
  });
  return reportsFound;
}


function getDateISOLocal(s) {
  if (!s) { return new Date(); }
  const b = s.split(/\D/);
  const d = new Date(b[0], b[1] - 1, b[2]);
  if (isValidDate(d)) { return d; }
  return new Date();
}

function getTimeForMidnight(d) {
  const date = new Date(d);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function getDateMS(d) {
  if (typeof d === 'string') {
    if (d === '') { return null; }
    d = getDateISOLocal(d);
  }
  return getTimeForMidnight(d).getTime();
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function addDays(date, days) {
  const result = getTimeForMidnight(new Date(date));
  result.setDate(result.getDate() + days);
  return result;
}

function addDate(date, days) {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isPregnancyForm(report) {
  return pregnancyForms.includes(report.form);
}

function isPregnancyFollowUpForm(report) {
  return antenatalForms.includes(report.form);
}

function isDeliveryForm(report) {
  return deliveryForms.includes(report.form);
}

const getNewestReport = function (reports, forms) {
  let result;
  reports.forEach(function (report) {
    if (!forms.includes(report.form)) { return; }
    if (!result || report.reported_date > result.reported_date) {
      result = report;
    }
  });
  return result;
};

const getLMPDateFromPregnancy = function (report) {
  return isPregnancyForm(report) &&
    getDateMS(getField(report, 'lmp_date_8601'));
};

const getLMPDateFromPregnancyFollowUp = function (report) {
  return isPregnancyFollowUpForm(report) &&
    getDateMS(getField(report, 'lmp_date_8601'));
};



function getSubsequentPregnancies(contact, refReport) {
  return contact.reports.filter(function (report) {
    return isPregnancyForm(report) && report.reported_date > refReport.reported_date;
  });
}

function getSubsequentPregnancyFollowUps(contact, report) {
  const subsequentVisits = contact.reports.filter(function (visit) {
    let lmpDate = getLMPDateFromPregnancy(report);
    if (!lmpDate) { //LMP Date is not available, use reported date
      lmpDate = report.reported_date;
    }

    return isPregnancyFollowUpForm(visit) &&
      visit.reported_date > report.reported_date &&
      visit.reported_date < addDays(lmpDate, MAX_DAYS_IN_PREGNANCY);
  });
  return subsequentVisits;
}

function getSubsequentDeliveries(contact, refReport, withinLastXDays) {
  return contact.reports.filter(function (deliveryReport) {
    return (deliveryReport.form === 'delivery') &&
      deliveryReport.reported_date > refReport.reported_date &&
      (!withinLastXDays || refReport.reported_date >= (today - withinLastXDays * MS_IN_DAY));
  });
}

function getMostRecentLMPDateForPregnancy(contact, report) {
  let mostRecentLMP = getLMPDateFromPregnancy(report);
  let mostRecentReportDate = report.reported_date;
  getSubsequentPregnancyFollowUps(contact, report).forEach(function (v) {
    const lmpFromPregnancyFollowUp = getLMPDateFromPregnancyFollowUp(v);
    if (v.reported_date > mostRecentReportDate && lmpFromPregnancyFollowUp !== '' && lmpFromPregnancyFollowUp !== mostRecentLMP) {
      mostRecentReportDate = v.reported_date;
      mostRecentLMP = lmpFromPregnancyFollowUp;
    }
  });
  return mostRecentLMP;
}


function isPregnancyTerminatedByAbortion(contact, report) {
  const followUps = getSubsequentPregnancyFollowUps(contact, report);
  const latestFollowup = getNewestReport(followUps, antenatalForms);
  return latestFollowup && getField(latestFollowup, 'pregnancy_summary.visit_option') === 'abortion';
}

function isPregnancyTerminatedByMiscarriage(contact, report) {
  const followUps = getSubsequentPregnancyFollowUps(contact, report);
  const latestFollowup = getNewestReport(followUps, antenatalForms);
  return latestFollowup && getField(latestFollowup, 'pregnancy_summary.visit_option') === 'miscarriage';
}

function isActivePregnancy(contact, report) {
  if (!isPregnancyForm(report)) { return false; }
  const lmpDate = getMostRecentLMPDateForPregnancy(contact, report) || report.reported_date;
  const isPregnancyRegisteredWithin9Months = lmpDate > today - MAX_DAYS_IN_PREGNANCY * MS_IN_DAY;
  const isPregnancyTerminatedByDeliveryInLast6Weeks = getSubsequentDeliveries(contact, report, 6 * 7).length > 0;
  const isPregnancyTerminatedByAnotherPregnancyReport = getSubsequentPregnancies(contact, report).length > 0;
  return isPregnancyRegisteredWithin9Months &&
    !isPregnancyTerminatedByDeliveryInLast6Weeks &&
    !isPregnancyTerminatedByAnotherPregnancyReport &&
    !isPregnancyTerminatedByAbortion(contact, report) &&
    !isPregnancyTerminatedByMiscarriage(contact, report);
}

function countANCFacilityVisits(contact, pregnancyReport) {
  let ancHFVisits = 0;
  const pregnancyFollowUps = getSubsequentPregnancyFollowUps(contact, pregnancyReport);
  if (getField(pregnancyReport, 'anc_visits_hf.anc_visits_hf_past') && !isNaN(getField(pregnancyReport, 'anc_visits_hf.anc_visits_hf_past.visited_hf_count'))) {
    ancHFVisits += parseInt(getField(pregnancyReport, 'anc_visits_hf.anc_visits_hf_past.visited_hf_count'));
  }
  ancHFVisits += pregnancyFollowUps.reduce(function (sum, report) {
    const pastANCHFVisits = getField(report, 'anc_visits_hf.anc_visits_hf_past');
    if (!pastANCHFVisits) { return 0; }
    sum += pastANCHFVisits.last_visit_attended === 'yes' && 1;
    if (isNaN(pastANCHFVisits.visited_hf_count)) { return sum; }
    return sum += pastANCHFVisits.report_other_visits === 'yes' && parseInt(pastANCHFVisits.visited_hf_count);
  },
  0);
  return ancHFVisits;
}

function getRecentANCVisitWithEvent(contact, report, event) {
  //event should be one among miscarriage, abortion, refused, migrated
  const followUps = getSubsequentPregnancyFollowUps(contact, report);
  const latestFollowup = getNewestReport(followUps, antenatalForms);
  if (latestFollowup && getField(latestFollowup, 'pregnancy_summary.visit_option') === event) {
    return latestFollowup;
  }
}

function isPregnancyTaskMuted(contact) {
  const latestVisit = getNewestReport(contact.reports, allANCForms);
  return latestVisit && isPregnancyFollowUpForm(latestVisit) &&
    getField(latestVisit, 'pregnancy_ended.clear_option') === 'clear_all';
}

/**
 * Verifies if a patient has warning symptoms, by checking the warn_symptom field.
 * @param report Single report
 * @return {boolean} True if the patient has symptoms, false otherwise
 */
function hasWarningSymptoms(report) {
  const clinical_assessment = getField(report, 'data');
  // handle old forms that do not have this exact field
  if (!clinical_assessment) {
    return false;
  }
  return clinical_assessment._warn_symp === '1';
}

/**
 * Verifies if a patient has warning symptoms, by checking the warn_symptom field.
 * @param report Single report
 * @return {boolean} True if the patient has symptoms, false otherwise
 */
function clinEventHappend(report) {
  const clin_ev = getField(report, CLIN_EVENT_FIELD);
  // handle old forms that do not have this exact field
  if (!clin_ev) {
    return false;
  }
  return clin_ev === '1';
}

module.exports = {
  today,
  MS_IN_DAY,
  clinEventHappend,
  getMostRecentReportWithEvent,
  MAX_DAYS_IN_PREGNANCY,
  addDays,
  addDate,
  isAlive,
  getTimeForMidnight,
  isFormArraySubmittedInWindow,
  isFormArraySubmittedInWindowExcludingThisReport,
  isMostRecentReport,
  getDateMS,
  getDateISOLocal,
  isDeliveryForm,
  getMostRecentReport,
  getMostRecentReportType,
  checkClinEvFormDeactivation,
  getMostRecentReportOfType,
  getNewestPregnancyTimestamp,
  getNewestDeliveryTimestamp,
  getReportsSubmittedInWindow,
  getMostRecentReportNotNewAction,
  countReportsSubmittedInWindow,
  countANCFacilityVisits,
  isFacilityDelivery,
  checkDmTwicDeactivation,
  getMostRecentReportPreloading,
  getMostRecentLMPDateForPregnancy,
  getNewestReport,
  getSubsequentPregnancyFollowUps,
  isActivePregnancy,
  getRecentANCVisitWithEvent,
  isPregnancyTaskMuted,
  getField,
  appliesToFieldOfReport,
  resolvedByFieldOfReport,
  resolvedByFieldOfMostRecentReport,
  hasWarningSymptoms,
  getNumberOfReportsOfType,
  isFormSubmitted,
  getNewestReportType,
  reportHasType,
  getNumberOfReportsOfTypeExact,
  reportHasTrialArm,
  getContactField,
  isInReports,
  getMostRecentReportAll,
  countNumberOfOpenEvents,
  checkForFreeFloatingForms,
  checkBpDeactivation,
  getMostRecentReportClientOverview,
  checkDmDeactivation
};
