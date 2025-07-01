function bpScreeningReport(reported_date, t_bp_diagnostic_status) {

  //Creating report bpScreening
  return {
    fields: {
      patient_name: 'test user',
      trial_arm: '1',
      t_bp_diagnostic_status: '',
      t_weight_dummy: '',
      date_t_weight_dummy: '',
      weight_expiry: '2',
      height_dummy: '160',
      age: '',
      t_metfin_dose: '1700',
      t_metfin_status: 'active',
      data: {
        _warn_symptom: '2',
        _weight: '88',
        _bmi: '25',
        _bp_diagnostic_status: t_bp_diagnostic_status,
        _reference_arm: 'left'
      }
    },
    form: 'bp_screening',
    reported_date: reported_date
  };
}

module.exports = {
  bpScreeningReport,
};
