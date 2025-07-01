function dmScreeningReport(reported_date, t_dm_diagnostic_status) {

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
      t_metfin_dose: '1700',
      t_metfin_status: 'active',
      dm_screening: {
        dm_already_in_care: {
          blood_sugar_measurement_ic: {
            fbg_ic: '7',
            rbg_ic: '',
          }
        },
        weight_bmi: {
          weight: '88',
          bmi: '35.0',
        },
        blood_sugar_measurement: {
          rbg: '',
          fbg: '7',
          confirm_rbg: '',
          confirm_fbg: '',
        },
        gr_dm_diagnostic_status: {
          dm_diagnosed: '',
          dm_diagnostic_status: 'dm_screen_normal',
        },
        dbs:{
          dbs_obtained: '1',

        }
      },
    },
    form: 'dm_screening',
    reported_date: 0
  };

  //add most recent t_dm_diagnostic status
  report.fields.dm_screening.gr_dm_diagnostic_status.dm_diagnostic_status = t_dm_diagnostic_status;

  //add reported_date (UNIX)
  report.reported_date = reported_date;


  //returning created report dmScreening
  return report;
}

module.exports = {
  dmScreeningReport,
};
