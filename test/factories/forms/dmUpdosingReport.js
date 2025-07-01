function dmUpdosingReport(reported_date, t_dm_diagnostic_status) {
  const report = {
    fields: {
      trial_arm: '1',
      t_dm_diagnostic_status: '',
      t_metfin_status: '',
      t_atorva_status: '',
      t_metfin_dose: '',
      age: '82',
      sex: '2',
      smoking_status: '2',
      t_weight_dummy: '',
      height_dummy: '160',
      date_t_weight_dummy: '',
      weight_expiry: '',
      t_bmi: '',
      dm_updosing: {
        weight_measure: {
          weight: '88',
          bmi: '35.0',
        },
        dm_lifestyle: {
          lifestyle_status: 'started',
        },
        preg: {
          pregnancy: '',
          pregnancy_still: ''
        },
        metformin: {
          metfin_dose: '1700'
        },
        gr_metfin_status: {
          metfin_status: 'started',
        },
        gr_atorva_status: {
          atorva_status: 'started',
        },
      },
      gr_dm_diagnostic_status: {
        dm_diagnostic_status: ''
      }
    },
    form: 'dm_updosing',
    reported_date: 0,
  };
    //add most recent t_dm_diagnostic status
  report.fields.gr_dm_diagnostic_status.dm_diagnostic_status = t_dm_diagnostic_status;

  //add reported_date (UNIX)
  report.reported_date = reported_date;


  //returning created report dmScreening
  return report;

}

module.exports = {
  dmUpdosingReport
};
