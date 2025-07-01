function bpConfirmReport(reported_date, t_bp_diagnostic_status) {

  //Creating report bpConfirm
  return {
    fields: {
      patient_name: 'test user',
      trial_arm: '1',
      reference_arm: 'left',
      t_bp_diagnostic_status: '',
      t_weight_dummy: '88',
      date_t_weight_dummy: '',
      weight_expiry: '2',
      height_dummy: '160',
      age: '',
      data: {
        _bp_diagnostic_status: t_bp_diagnostic_status
      }
    },
    form: 'bp_confirm',
    reported_date: reported_date
  };
}

module.exports = {
  bpConfirmReport,
};
