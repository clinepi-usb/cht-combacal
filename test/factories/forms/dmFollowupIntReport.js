function dmFollowupInt(reported_date, t_dm_diagnostic_status) {
  const report = {
    fields: {
      trial_arm: '1',
      t_dm_diagnostic_status: '',
      t_metfin_status: '',
      t_atorva_status: '',
      t_metfin_dose: '',
      t_lifestyle_status:'',
      t_bg_status: '',
      age: '82',
      sex: '2',
      smoking_status: '2',
      t_weight_dummy: '',
      height_dummy: '160',
      date_t_weight_dummy: '',
      weight_expiry: '',
      t_bmi: '',
      t_fbg: '',
      t_fbg_date: '',
      fbg_expiry: '',
      t_dbs_date: '',
      dbs_expiry: '',
      dm_followup: {
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
        bg: {
          bg_measurement: {
            fbg: '7',
            fasting: ''
          }
        },
        bg_status: 'started',
        metformin: {
          metfin_cont: {
            metfin_dose: '1700'
          }
        },
        metfin_status: 'started',
        atorva_status: 'started',
        dbs: {
          dbs_status: 'started',
          dbs_obtained: '1',
        },
      },
      dm_diagnostic_status: '',
        
    },
    form: 'dm_followup_int',
    reported_date: 0,
  };
    //add most recent t_dm_diagnostic status
  report.fields.dm_diagnostic_status = t_dm_diagnostic_status;

  //add reported_date (UNIX)
  report.reported_date = reported_date;


  //returning created report dmScreening
  return report;

}
  
module.exports = {
  dmFollowupInt
};
