function dmConfirmReport(reported_date, t_dm_diagnostic_status) {

  //Creating report dmScreening
  const report = {
    fields: {
      patient_name: 'test user',
      trial_arm: '1',
      t_dm_diagnostic_status: '',
      t_weight_dummy: '',
      date_t_weight_dummy: '',
      weight_expiry: '2',
      height_dummy: '160',
      age: '',
      t_dbs_date: '',
      dbs_expiry: '',
      dm_confirmation:{
        weight_bmi: {
          weight: '88',
          bmi: '35.0',
        },
        blood_sugar_measurement: {
          fasting: '',
          rbg: '',
          fbg: '',
        },
        gr_dm_diagnostic_status: {
          dm_diagnostic_status: 'dm_awaiting_confirm'
        },
        dbs: {
          dbs_obtained: '1',
          dbs_status: ''
        },
      },
    },
    form: 'dm_confirm',
    reported_date: 0
  };

  //add most recent t_dm_diagnostic status
  report.fields.dm_confirmation.gr_dm_diagnostic_status.dm_diagnostic_status = t_dm_diagnostic_status;

  //add reported_date (UNIX)
  report.reported_date = reported_date;


  //returning created report dmScreening
  return report;
}

module.exports = {
  dmConfirmReport,
};
