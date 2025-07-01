// general
const REPORT = 'report';
const REPORTS = 'reports';
const CONTACTS = 'contacts';

// Cohort form
const MAIN_COHORT_FORM = 'cohort_bsl';
const E_CONSENT_FORM = 'econsent';
const CLIN_EVENT_FORM = 'supvis_clin_ev';
const CLIN_EVENT_FORM_NEW_ACTION = 'supvis_clin_ev_new_action';
const VHW_CLIN_EVENT_FORM = 'vhw_clin_ev';
const DEATH_REPORT_FORM = 'deactivation';
const VERBAL_AUTOPSY_FORM = 'supvis_death';
const FLOW_DECIDER_FORM = 'flow_decider';
const FORM_CORRECTION = 'form_correction';

// Correction form
const CORRECTION_FORM = 'form_correction';

// Cholesterol form
const CHOLESTEROL_FORM = 'cholesterol';
const CHOLESTEROL_SIX_MONTHS_FORM = 'cholesterol_6m';
const CHOLESTEROL_TWELVE_MONTHS_FORM = 'cholesterol_12m';
const CHOLESTEROL_BP_FORM = 'hypertension_cholesterol';
const CHOLESTEROL_SIX_MONTHS_BP_FORM = 'hypertension_cholesterol_6m';
const CHOLESTEROL_TWELVE_MONTHS_BP_FORM = 'hypertension_cholesterol_12m';

// Hba1c form
const HBA1C_FORM = 'hba1c';
const HBA1C_SIX_MONTHS_FORM = 'hba1c_6m';
const HBA1C_TWELVE_MONTHS_FORM = 'hba1c_12m';

// FBG FORM
const FBG_FORM = 'fbg_form';
const FBG_SIX_MONTHS_FORM = 'fbg_form_6m';
const FBG_TWELVE_MONTHS_FORM = 'fbg_form_12m';

// DM forms
const DM_INTERVENTION_FORM = 'dm_int';
const DM_CONTROL_FORM = 'dm_cont';

// BP forms
const BP_CONTROL_FORM = 'bp_cont';
const BP_INTERVENTION_FORM = 'bp_int';

// HIV questionnaire
const HIV_QUESTIONNAIRE_FORM = 'hiv_questionnaire';

// Subflow Deactivations
const BP_DEACTIVATE = false;
const DM_DEACTIVATE = false;
const CLIN_EVENT_FORM_DEACTIVATE = true;
const DM_TWIC_DEACTIVATE = true;

// DUE DATE TEST LIMIT TO 10 DAYS
const DUE_DATE_TEST_DAYS = 10;

// fields
const CORRECTION_VARIABLE = 'data._variable';
const CORRECTION_OUTCOME = 'data._outcome';
const CHOL_STATUS_FIELD = 'data._chol_status';
const BP_CHOL_STATUS_FIELD = 'data._bp_chol_status';
const CO_DEACTIVATION_FIELD = 'data.__reason_dropout';
const HBA1C_STATUS_FIELD = 'data._hba1c_status';
const FBG_STATUS_FIELD = 'data._fbg_twic';
const AHT_DIAGNOSTIC_STATUS_FIELD = 'data._aht_dxs';
const AHT_TX_STATUS_FIELD = 'data._aht_txs';
const AHT_TWIC_STATUS_FIELD = 'data._aht_twic_status';
const T_AHT_TWIC_STATUS_FIELD = 't_aht_twic_status';
const BP_STATUS_FIELD = 'data._bp_status';
const BP_WARNING_SYMPTOM_FIELD = 'data._warn_symptom';
const BP_BMI_FIELD = 'data._bmi';
const DM_BG_STATUS_FIELD = 'data._bg_status';
const CLIN_EVENT_FIELD = 'data._clin_ev';
const DM_DX_STATUS_FIELD = 'data._dm_dxs';
const DM_TX_STATUS_FIELD = 'data._dm_txs';
const DM_TX_YES_NO_FIELD = 'data._dm_tx';
const DM_DRUGS = 'data._dm_drugs';
const DM_TWIC_ELIGIBILITY_FIELD = 'data._dm_twic_eligibility';
const DM_TWIC_STATUS_FIELD = 'data._dm_twic_status';
const T_DM_TWIC_STATUS_FIELD = 't_dm_twic_status';
const TWIC_ARM_FIELD = 'data._twic_arm';
const TWIC_ARMS_FIELD = 'data._twic_arms';
const MAIN_COHORT_SMOKING_STATUS = 'data._smok_stat';
const MAIN_COHORT_HIV_STATUS = 'data._hiv_stat';
const MAIN_COHORT_ART_STATUS = 'hiv.art';

// contact fields
const CONTACT_SEX_FIELD = 'sex';

// trial arm
const TRIAL_ARM = 'trial_arm';

const BP_STATUS = {
  NORMAL: 'normal',
  DIAGNOSED: 'diagnosed',
  AWAITING_CONFIRM: 'awaiting_confirm',
  HIGHNORMAL: 'highnormal',
  ACTIVE: 'active',
  UNAVAILABLE: 'unavailable',
  REFUSED: 'refused',
  CONSIDERING: 'considering'
};

const DM_DX_STATUS = {
  AWAITING_SCREENING: 'awaiting_screening',
  AWAITING_CONFIRM: 'awaiting_confirm',
  SCREENED_NORMAL: 'screen_normal',
  DIAGNOSED: 'diagnosed',
  PREDM_DIAGNOSED: 'predm',
  TYPE_1: 'type_1',
};

const DM_TX_STATUS = {
  IN_FACILITY_CARE: 'fac_care',
  AWAITING_INITIATE: 'awaiting_initiate',
  CONSIDERING: 'considering',
  UNAVAILABLE: 'unavailable',
  UPDOSING: 'updosing',
  STARTED: 'started',
  ACTIVE_STABLE: 'active_stable',
  ACTIVE_ADJUSTED: 'active_adjusted',
  PREGNANT: 'pregnant',
  REFUSED: 'refused',
  PAUSED: 'paused',
  ZERO_DOSE: 'zero_dose',
  FAC_CARE_REFILL: 'fac_care_refill'
};

const AHT_TX_STATUS = {
  IN_FACILITY_CARE: 'fac_care',
  AWAITING_INITIATE: 'awaiting_initiate',
  CONSIDERING: 'considering',
  UNAVAILABLE: 'unavailable',
  STARTED: 'started',
  REFUSED: 'refused',
  PREGNANT: 'pregnant',
  PAUSED: 'paused',
  ACTIVE_ADJUSTED: 'active_adjusted',
  ACTIVE_STABLE: 'active_stable',
  ACTIVE: 'active',
  ZERO_DOSE: 'zero_dose',
  REFERRED: 'referred',
  FAC_CARE_REFILL: 'fac_care_refill',
  FAC_CARE_ALARM: 'fac_care_alarm'
};

const DM_TWIC_ARM_STATUS = {
  INTERVENTION: 'int',
  CONTROL: 'cont',
  EMPTY: 'empty'
};

const CHOLESTEROL_STATUS = {
  NOT_OBTAINED: 'not_obtained',
  OBTAINED: 'obtained'
};

const HBA1C_STATUS = {
  NOT_OBTAINED: 'not_obtained',
  OBTAINED: 'obtained'
};

const FBG_STATUS = {
  NOT_OBTAINED: 'not_obtained',
  OBTAINED: 'obtained'
};

const AHT_TWIC_STATUS = {
  ELIGIBLE: 'eligible',
  SIX_M_COMPLETE: '6m_complete',
  TWELVE_M_COMPLETE: '12m_complete'
};

const DM_TWIC_STATUS = {
  ELIGIBLE: 'eligible',
  SIX_M_COMPLETE: '6m_complete',
  TWELVE_M_COMPLETE: '12m_complete'
};

const AHT_DIAGNOSTIC_STATUS = {
  NORMAL: 'screen_normal',
  DIAGNOSED: 'diagnosed',
  REFUSED: 'refused',
  AWAITING_CONFIRM: 'awaiting_confirm',
  AWAITING_SCREENING: 'awaiting_screening',
  HIGHNORMAL: 'highnormal'
};

const METFIN_STATUS = {
  UNAVAILABLE: 'unavailable',
  ELIGIBLE: 'eligible',
  INTOLERANT: 'intolerant',
  REFUSED: 'refused',
  UPDOSING: 'updosing',
  STARTED: 'started',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CONSIDERING: 'considering',
  PREGNANT: 'pregnant',
  AWAITING_INITIATE: 'awaiting_initiate'
};

const ATORVA_STATUS = {
  UNAVAILABLE: 'unavailable',
  INTOLERANT: 'intolerant',
  REFUSED: 'refused',
  STARTED: 'started',
  ACTIVE: 'active',
  CONSIDERING: 'considering',
  PREGNANT: 'pregnant',
  PAUSED: 'paused'
};

const BG_STATUS = {
  UNAVAILABLE: 'unavailable',
  CONSIDERING: 'considering',
  REFUSED: 'refused',
  ACTIVE: 'active',
  NOT_FASTING: 'not_fasting',
  NOT_REQUIRED: 'not_required'
};

const TASK_MAX_PERIOD = 1095;
const TASK_EXPIRY_PERIOD = 7305;

module.exports = {
  REPORT,
  REPORTS,
  CONTACTS,
  MAIN_COHORT_FORM,
  FORM_CORRECTION,
  CONTACT_SEX_FIELD,
  DM_INTERVENTION_FORM,
  BP_WARNING_SYMPTOM_FIELD,
  DM_TX_YES_NO_FIELD,
  DM_TX_STATUS_FIELD,
  DM_TX_STATUS,
  CORRECTION_FORM,
  DM_DX_STATUS,
  METFIN_STATUS,
  ATORVA_STATUS,
  BG_STATUS,
  TASK_MAX_PERIOD,
  TASK_EXPIRY_PERIOD,
  TRIAL_ARM,
  HIV_QUESTIONNAIRE_FORM,
  VHW_CLIN_EVENT_FORM,
  FLOW_DECIDER_FORM,
  AHT_TWIC_STATUS_FIELD,
  BP_CHOL_STATUS_FIELD,
  CHOLESTEROL_BP_FORM,
  CHOLESTEROL_SIX_MONTHS_FORM,
  CHOLESTEROL_TWELVE_MONTHS_FORM,
  HBA1C_SIX_MONTHS_FORM,
  HBA1C_TWELVE_MONTHS_FORM,
  FBG_SIX_MONTHS_FORM,
  FBG_TWELVE_MONTHS_FORM,
  BP_BMI_FIELD,
  CORRECTION_VARIABLE,
  CORRECTION_OUTCOME,
  AHT_DIAGNOSTIC_STATUS_FIELD,
  AHT_TX_STATUS_FIELD,
  AHT_TX_STATUS,
  AHT_DIAGNOSTIC_STATUS,
  BP_STATUS,
  BP_STATUS_FIELD,
  BP_DEACTIVATE,
  DM_DEACTIVATE,
  CHOLESTEROL_TWELVE_MONTHS_BP_FORM,
  CHOLESTEROL_SIX_MONTHS_BP_FORM,
  AHT_TWIC_STATUS,
  DM_TWIC_ARM_STATUS,
  DM_TWIC_DEACTIVATE,
  DM_BG_STATUS_FIELD,
  DM_DX_STATUS_FIELD,
  DM_TWIC_ELIGIBILITY_FIELD,
  T_DM_TWIC_STATUS_FIELD,
  DM_TWIC_STATUS_FIELD,
  DM_TWIC_STATUS,
  DM_DRUGS,
  E_CONSENT_FORM,
  CLIN_EVENT_FIELD,
  TWIC_ARM_FIELD,
  DUE_DATE_TEST_DAYS,
  CLIN_EVENT_FORM,
  CLIN_EVENT_FORM_NEW_ACTION,
  CHOLESTEROL_FORM,
  HBA1C_FORM,
  CHOLESTEROL_STATUS,
  HBA1C_STATUS,
  DM_CONTROL_FORM,
  TWIC_ARMS_FIELD,
  CHOL_STATUS_FIELD,
  HBA1C_STATUS_FIELD,
  DEATH_REPORT_FORM,
  VERBAL_AUTOPSY_FORM,
  CO_DEACTIVATION_FIELD,
  FBG_STATUS,
  FBG_FORM,
  CLIN_EVENT_FORM_DEACTIVATE,
  FBG_STATUS_FIELD,
  T_AHT_TWIC_STATUS_FIELD,
  MAIN_COHORT_SMOKING_STATUS,
  MAIN_COHORT_HIV_STATUS,
  MAIN_COHORT_ART_STATUS,
  BP_CONTROL_FORM,
  BP_INTERVENTION_FORM
};
