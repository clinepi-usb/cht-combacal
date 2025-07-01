function dmInitiateReport(reported_date, t_dm_diagnostic_status) {

  //Creating report dmScreening
  const report = {
    fields: {
      trial_arm: '1',
      t_dm_diagnostic_status: '',
      t_metfin_status: '',
      t_atorva_status: '',
      t_metfin_dose: '',
      age: '82',
      sex: '2',
      t_dbs_date: '',
      dbs_expiry: '',
      smoking_status: '',
      t_weight_dummy: '88',
      height_dummy: '160',
      date_t_weight_dummy: '',
      weight_expiry: '2',
      t_bmi: '35.6',
      dm_initiate:{
        weight_measure:{
          weight: '88',
          bmi: '35.0',
        },
        dm_lifestyle:{
          lifestyle_status: 'started'
        },
        preg:{
          pregnancy: ''
        },
        metformin:{
          info_readiness_metfin:{
            metfin_dose: '1700'
          }

        },
        gr_metfin_status: {
          metfin_status: 'started'
        },
        gr_atorva_status:{
          atorva_status: 'started',
        },
        dbs: {
          dbs_obtained: '1',
        },
        gr_dm_diagnostic_status: {
          dm_diagnostic_status: 'dm_diagnosed',
          note_dm_diagnostic_status: '',
        }
      },
      patient_name: 'test user',
    },
    form: 'dm_initiate',
    reported_date: 0
  };

  //add most recent t_dm_diagnostic status
  report.fields.dm_initiate.gr_dm_diagnostic_status.dm_diagnostic_status = t_dm_diagnostic_status;

  //add reported_date (UNIX)
  report.reported_date = reported_date;


  //returning created report dmScreening
  return report;
}

module.exports = {
  dmInitiateReport,
};
