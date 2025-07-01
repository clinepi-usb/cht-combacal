// Import all tasks here
const household_create_no_consent = require('./tasks/contact/household_create_no_consent');
const cohort_bsl_to_dm_intervention = require('./tasks/contact/cohort_bsl_to_dm_intervention');
const dm_intervention_to_dm_intervention = require('./tasks/main-trial/dm_intervention_to_dm_intervention');
const person_create_to_e_consent = require('./tasks/contact/person_create_to_e_consent');
const e_consent_to_cohort_bsl = require('./tasks/contact/e_consent_to_cohort_bsl');
const e_consent_to_e_consent = require('./tasks/contact/e_consent_to_e_consent');
const cohort_bsl_to_dm_control = require('./tasks/contact/cohort_bsl_to_dm_control');
const dm_control_to_dm_control = require('./tasks/main-trial/dm_control_to_dm_control');
const dm_intervention_to_cholesterol = require('./tasks/main-trial/dm_intervention_to_cholesterol');
const dm_intervention_to_hba1c = require('./tasks/main-trial/dm_intervention_to_hba1c');
const dm_intervention_to_fbg = require('./tasks/main-trial/dm_intervention_to_fbg');
const dm_control_to_cholesterol = require('./tasks/main-trial/dm_control_to_cholesterol');
const dm_control_to_fbg = require('./tasks/main-trial/dm_control_to_fbg');
const dm_control_to_hba1c = require('./tasks/main-trial/dm_control_to_hba1c');
const bp_intervention_to_bp_intervention = require('./tasks/main-trial/bp_intervention_to_bp_intervention');
const bp_control_to_bp_control = require('./tasks/main-trial/bp_control_to_bp_control');
// const cohort_bsl_to_flow_decider = require('./tasks/contact/cohort_bsl_to_flow_decider');
const flow_decider_to_dm_intervention = require('./tasks/contact/flow_decider_to_dm_intervention');
const flow_decider_to_dm_control = require('./tasks/contact/flow_decider_to_dm_control');
const cohort_bsl_to_bp_intervention = require('./tasks/contact/cohort_bsl_to_bp_intervention');
const cohort_bsl_to_bp_control = require('./tasks/contact/cohort_bsl_to_bp_control');
const flow_decider_to_bp_intervention = require('./tasks/contact/flow_decider_to_bp_intervention');
const flow_decider_to_bp_control = require('./tasks/contact/flow_decider_to_bp_control');

const dm_intervention_to_hba1c_12m = require('./tasks/main-trial/dm_intervention_to_hba1c_12m');
const dm_intervention_to_hba1c_6m = require('./tasks/main-trial/dm_intervention_to_hba1c_6m');
const dm_intervention_to_fbg_12m = require('./tasks/main-trial/dm_intervention_to_fbg_12m');
const dm_intervention_to_fbg_6m = require('./tasks/main-trial/dm_intervention_to_fbg_6m');
const dm_intervention_to_cholesterol_6m = require('./tasks/main-trial/dm_intervention_to_cholesterol_6m');
const dm_intervention_to_cholesterol_12m = require('./tasks/main-trial/dm_intervention_to_cholesterol_12m');
const dm_intervention_to_dm_intervention_twic = require('./tasks/main-trial/dm_intervention_to_dm_intervention_twic');
const dm_intervention_to_dm_intervention_twic2 = require('./tasks/main-trial/dm_intervention_to_dm_intervention_twic2');


const bp_intervention_to_cholesterol_6m = require('./tasks/main-trial/bp_intervention_to_cholesterol_6m');
const bp_control_to_cholesterol_6m = require('./tasks/main-trial/bp_control_to_cholesterol_6m');
const bp_control_to_cholesterol_12m = require('./tasks/main-trial/bp_control_to_cholesterol_12m');
const bp_intervention_to_cholesterol_12m = require('./tasks/main-trial/bp_intervention_to_cholesterol_12m');
const bp_intervention_to_bp_intervention_twic2 = require('./tasks/main-trial/bp_intervention_to_bp_intervention_twic2');
const bp_intervention_to_bp_intervention_twic = require('./tasks/main-trial/bp_intervention_to_bp_intervention_twic');
const dm_control_to_dm_control_twic2 = require('./tasks/main-trial/dm_control_to_dm_control_twic2');


const dm_control_to_fbg_12m = require('./tasks/main-trial/dm_control_to_fbg_12m');
const dm_control_to_fbg_6m = require('./tasks/main-trial/dm_control_to_fbg_6m');
const dm_control_to_hba1c_6m = require('./tasks/main-trial/dm_control_to_hba1c_6m');
const dm_control_to_hba1c_12m = require('./tasks/main-trial/dm_control_to_hba1c_12m');
const bp_control_to_bp_control_twic = require('./tasks/main-trial/bp_control_to_bp_control_twic');
const bp_control_to_bp_control_twic2 = require('./tasks/main-trial/bp_control_to_bp_control_twic2');

const dm_control_to_cholesterol_6m = require('./tasks/main-trial/dm_control_to_cholesterol_6m');
const dm_control_to_cholesterol_12m = require('./tasks/main-trial/dm_control_to_cholesterol_12m');

const bp_intervention_to_cholesterol = require('./tasks/main-trial/bp_intervention_to_cholesterol');
const bp_control_to_cholesterol = require('./tasks/main-trial/bp_control_to_cholesterol');
const dm_control_to_dm_control_twic = require('./tasks/main-trial/dm_control_to_dm_control_twic');

const death_report_to_verbal_autopsy = require('./tasks/main-trial/death_report_to_verbal_autopsy');

const household_create_to_household_enumeration = require('./tasks/contact/household_create_to_household_enumeration');

const warnings = require('./tasks/warnings/warnings');
const cohort_bsl_to_quantitative_assessment = require('./tasks/contact/cohort_bsl_to_quantitative_assessment');


module.exports = [
  // Contacts
  household_create_no_consent,
  person_create_to_e_consent,
  e_consent_to_cohort_bsl,
  e_consent_to_e_consent,
  household_create_to_household_enumeration,
  death_report_to_verbal_autopsy,

  // Main Cohort
  cohort_bsl_to_dm_control,
  cohort_bsl_to_dm_intervention,
  cohort_bsl_to_bp_intervention,
  cohort_bsl_to_bp_control,
  // cohort_bsl_to_flow_decider,

  // Flow Decider
  flow_decider_to_dm_intervention,
  flow_decider_to_dm_control,
  flow_decider_to_bp_intervention,
  flow_decider_to_bp_control,

  // DM Flow
  dm_intervention_to_dm_intervention,
  dm_control_to_dm_control_twic,
  dm_intervention_to_dm_intervention_twic,
  dm_intervention_to_dm_intervention_twic2,
  dm_control_to_dm_control_twic2,

  // Clin Events
  warnings.DM_INTERVENTION,
  warnings.MAIN_COHORT,
  warnings.DM_CONTROL,
  warnings.BP_CONTROL,
  warnings.PERSON_CLIN_EVENT,
  warnings.BP_INTERVENTION,

  // BP Flow
  bp_intervention_to_bp_intervention,
  bp_control_to_bp_control,
  bp_control_to_bp_control_twic,
  bp_control_to_bp_control_twic2,
  bp_intervention_to_bp_intervention_twic2,
  bp_intervention_to_bp_intervention_twic,

  // "Small" Forms
  dm_control_to_dm_control,
  dm_control_to_cholesterol,
  dm_control_to_cholesterol_6m,
  dm_control_to_cholesterol_12m,
  dm_control_to_fbg,
  dm_control_to_fbg_12m,
  dm_control_to_fbg_6m,
  dm_control_to_hba1c,
  dm_control_to_hba1c_6m,
  dm_control_to_hba1c_12m,
  bp_intervention_to_cholesterol,
  bp_control_to_cholesterol,
  bp_intervention_to_cholesterol_6m,
  bp_control_to_cholesterol_6m,
  bp_intervention_to_cholesterol_12m,
  bp_control_to_cholesterol_12m,
  dm_intervention_to_hba1c_12m,
  dm_intervention_to_hba1c_6m,
  dm_intervention_to_fbg_12m,
  dm_intervention_to_fbg_6m,
  dm_intervention_to_cholesterol_12m,
  dm_intervention_to_cholesterol_6m,
  dm_intervention_to_cholesterol,
  dm_intervention_to_hba1c,
  dm_intervention_to_fbg,

  cohort_bsl_to_quantitative_assessment
];
