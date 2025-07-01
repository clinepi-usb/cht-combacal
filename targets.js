const { takesBpMedis, takesDmMedis, hasDiabetes, hasHypertension, hypertensionPatientInCommunityCare, hypertensionPatientInFacilityCare, diabetesPatientInCommunityCare, diabetesPatientInFacilityCare, hasGivenConsent } = require('./targets-extras');

module.exports = [
  {
    id: 'patients-with-diabetes',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Patients with diabetes',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: hasDiabetes,
    date: 'now',
    aggregate: true
  },
  {
    id: 'diabetes-patient-in-community-care',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Diabetes patients in community care',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: diabetesPatientInCommunityCare,
    date: 'now',
    aggregate: true
  },
  {
    id: 'diabetes-patient-in-facility-care',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Diabetes patients in facility care',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: diabetesPatientInFacilityCare,
    date: 'now',
    aggregate: true
  },
  {
    id: 'patients-with-hypertension',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Patients with hypertension',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: hasHypertension,
    date: 'now',
    aggregate: true
  },
  {
    id: 'hypertension-patient-in-community-care',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Hypertension patients in community care',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: hypertensionPatientInCommunityCare,
    date: 'now',
    aggregate: true
  },
  {
    id: 'hypertension-patient-in-facility-care',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Hypertension patients in facility care',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: hypertensionPatientInFacilityCare,
    date: 'now',
    aggregate: true
  },
  /*{
    id: 'clin_ev-this-month',
    type: 'count',
    icon: 'icon-risk',
    goal: -1,
    translation_key: 'Supervisor Clinical Event Form',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['supvis_clin_ev'],
    date: 'reported',
    aggregate: true
  },*/
  // Diabetes Flow - monthly
  /*
  {
    id: 'dm_screening-this-month',
    type: 'count',
    icon: 'icon-disease-diabetes',
    goal: -1,
    translation_key: 'targets.dm_screening.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['dm_int'],
    date: 'reported',
    aggregate: true
  },
  // Blood Pressure Flow - monthly
  {
    id: 'bp_screening-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_screening.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_screening'],
    date: 'reported',
    aggregate: true,
    groupBy: contact => contact.contact.parent._id,
    passesIfGroupCount: { gte: 2 },
  },
  {
    id: 'bp_confirm-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_confirm.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_confirm'],
    date: 'reported',
    aggregate: true
  },
  {
    id: 'bp_initiate-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_initiate.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_initiate'],
    date: 'reported',
    aggregate: true
  },
  {
    id: 'bp_followup_int-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_followup_int.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_followup_int'],
    date: 'reported',
    aggregate: true
  },
  */
  // total
  {
    id: 'household-all-time',
    type: 'count',
    icon: 'icon-household',
    goal: -1,
    translation_key: 'targets.household.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['household'],
    date: 'now',
    aggregate: true
  },
  {
    id: 'person-all-time',
    type: 'count',
    icon: 'icon-person',
    goal: -1,
    translation_key: 'targets.person.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    date: 'now',
    aggregate: true
  },
  {
    id: 'econsent-all-time',
    type: 'count',
    icon: 'icon-healthcare-diagnosis',
    goal: -1,
    translation_key: 'Patients who have given consent',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: hasGivenConsent,
    date: 'now',
    aggregate: true
  },
  {
    id: 'bp-medis-all-time',
    type: 'count',
    icon: 'icon-healthcare-medicine',
    goal: -1,
    translation_key: 'Patients taking medication for Hypertension',
    subtitle_translation_key: 'targets.all_time.subtitle',

    appliesTo: 'reports',
    appliesIf: takesBpMedis,
    date: 'now',
    aggregate: true
  },
  {
    id: 'dm-medis-all-time',
    type: 'count',
    icon: 'icon-healthcare-medicine',
    goal: -1,
    translation_key: 'Patients taking medication for Diabetes',
    subtitle_translation_key: 'targets.all_time.subtitle',

    appliesTo: 'reports',
    appliesIf: takesDmMedis,
    date: 'now',
    aggregate: true
  },
  // Diabetes Flow - total
  /*
  {
    id: 'dm_screening-all-time',
    type: 'count',
    icon: 'icon-disease-diabetes',
    goal: -1,
    translation_key: 'targets.dm_screening.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['dm_int'],
    date: 'now',
    aggregate: true
  },
  // Blood Pressure Flow - total
  {
    id: 'bp_screening-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_screening.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_screening'],
    date: 'now',
    aggregate: true
  },
  {
    id: 'bp_confirm-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_confirm.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_confirm'],
    date: 'now',
    aggregate: true
  },
  {
    id: 'bp_initiate-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_initiate.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_initiate'],
    date: 'now',
    aggregate: true
  },
  {
    id: 'bp_followup_int-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.bp_followup_int.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['bp_followup_int'],
    date: 'now',
    aggregate: true
  }
  */
];
