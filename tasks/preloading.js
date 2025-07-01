const {
  setPreloadedField,
  getJsonField,
  calculateAge,
  isValidDateFormat,
  formatDateForTwicEnrolDate,
  formatDateComplex,
  convertUnixTimestampToDate
} = require('./utils');

const {
  CORRECTION_VARIABLE,
  CORRECTION_OUTCOME,
  CORRECTION_FORM
} = require('../data/ENUM');

const {
  getMostRecentReportPreloading, getField
} = require('../nools-extras');



//preloading to dm_intervention
function preLoadingToAll(content, contact, from = 'bp', small_event = 0) {
  const mostRecentReport = getMostRecentReportPreloading(contact.reports);
  if(small_event === 1){
    console.log('small_event');
  }

  // Prepare a sorted list of all reports from newest to oldest
  const allReports = [];
  //find all submition dates of the reports where dm_twic_status is not empty
  contact.reports.forEach(report => {
    allReports.push(report);
  });

  const allReportsSorted = [];
  for(let i = allReports.length - 1; i >= 0; i--) {
    const valueAtIndex = allReports[i];
    allReportsSorted.push(valueAtIndex);
  }

  //age
  content.age = calculateAge(contact.contact);

  //sex
  content.sex = contact.contact.sex;

  if (mostRecentReport) {
    //twic_arm
    if (from === 'co' || from === 'fl'){
      content.twic_arm = getJsonField(() => mostRecentReport.fields.twic_arms);
    }else{
      content.twic_arm = getJsonField(() => mostRecentReport.fields.twic_arm);
    }
    allReportsSorted.every(report => {
      if (report.form === CORRECTION_FORM) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === 'twic_arm'){
          content.twic_arm = getField(report, CORRECTION_OUTCOME);
          return false;
        }
        if (correction_variable === 'sex'){
          content.sex = getField(report, CORRECTION_OUTCOME);
          return false;
        }
      }
      return true;  // Continue iterating
    });
  }

  // set all content fields to empty
  content.t_hhhead = '';
  content.t_hhrel = '';
  content.t_educ = '';
  content.t_employ = '';
  content.t_marstat = '';
  content.t_weight = '';
  content.t_height = '';
  content.t_bmi = '';
  content.t_aht_txs = '';
  content.t_aht_dxs = '';
  content.t_aht_tx = '';
  content.t_aht_drugs = '';
  content.t_bp_status = '';
  content.t_ref_arm = '';
  content.t_sys_avg = '';
  content.t_dia_avg = '';
  content.t_aht_fc_rsn = '';
  content.t_amlohct_dose = '';
  content.t_aht_diag_cat = '';
  content.t_bg_status = '';
  content.t_dm_txs = '';
  content.t_dm_dxs = '';
  content.t_dm_tx = '';
  content.t_dm_drugs = '';
  content.t_bg_cat = '';
  content.t_rbg = '';
  content.t_fbg = '';
  content.t_dm_fc_rsn = '';
  content.t_metfin_dose = '';
  content.t_clin_ev = '';
  content.t_clin_ev_type = '';
  content.t_date_clin_ev_rep = '';
  content.t_date_clin_ev = '';
  content.t_clin_ev_details = '';
  content.t_sce_type = '';
  content.t_cesi_type = '';
  content.t_warn_symp = '';
  content.t_mi_stat = '';
  content.t_stroke_stat = '';
  content.t_heart_failure = '';
  content.t_date_heart_failure = '';
  content.t_ckd = '';
  content.t_date_ckd = '';
  content.t_blindness = '';
  content.t_date_blindness = '';
  content.t_peripheral_arterial_disease = '';
  content.t_date_peripheral_arterial_disease = '';
  content.t_neuropathy = '';
  content.t_date_neuropathy = '';
  content.t_lung_disease = '';
  content.t_date_lung_disease = '';
  content.t_diabetic_foot = '';
  content.t_date_diabetic_foot = '';
  content.t_nr_clin_vis = '';
  content.t_nr_clin_vis_aht = '';
  content.t_nr_clin_vis_dm = '';
  content.t_hiv_stat = '';
  content.t_art = '';
  content.t_atorva_stat = '';
  content.t_cvd_risk = '';
  content.t_other_tx = '';
  content.t_other_dx = '';
  content.t_other_drugs = '';
  content.t_ass_stat = '';
  content.t_date_last_vis = '';
  content.t_date_weight = '';
  // content.t_date_aht_twic_enrol = '';
  // content.t_date_dm_twic_enrol = '';
  content.t_date_cohort_bsl = '';
  content.t_aht_twic_status = '';
  content.t_dm_twic_status = '';
  content.t_smok_stat = '';
  content.t_date_stroke = '';
  content.t_date_mi = '';
  content.t_aht_tx_cat = '';
  content.t_drug_reaction = '';
  content.t_date_drug_reaction = '';
  content.t_pregnant = '';

  // Loop through all forms chronologically for each variable until a value is found
  Object.keys(content).forEach(key => {
    //console.log(content[key], key);
    allReportsSorted.every(report => {
      if (content[key]){
        return false;
      }
      //console.log(report);
      if ((!content[key]) && report !== undefined){
        if (report.form === CORRECTION_FORM) {
          const correction_variable = getField(report, CORRECTION_VARIABLE);
          if (correction_variable === key.substring(2)){
            content[key]= getField(report, CORRECTION_OUTCOME);
            if (!content[key]){
              content[key] = report.fields.new_nr;
            }
            if (!content[key]){
              content[key] = report.fields.new_date;
            }
          }
        } 
        else{
          try{
            //take away the first character 't' from the key
            const field = key.slice(1);
            content[key] = setPreloadedField(
              getJsonField(() => report.fields.data[field]),
              getJsonField(() => report.fields['t'+field])
            );
          } catch{
            //console.log('In preloading from CLIN_EVENT_FORM no matching variable found for', key);
          }
        }
      }
      return true;
    });
  });

  // If twic_arm still empty, take it from the person object
  if(content.twic_arm.length === 0){
    try{
      content.twic_arm = contact.contact.twic_arm;
    }catch{
      console.log('');
    }
  }

  //console.log('FINAL PRE Content: ', content.t_date_dm_twic_enrol);
  content.t_date_dm_twic_enrol = '';
  allReportsSorted.every(report => {
    if (report !== undefined){
      if (report.form === CORRECTION_FORM) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === 'date_dm_twic_enrol'){
          content.t_date_dm_twic_enrol = report.fields.new_date;
          return false;
        }
      }
    }
    return true;
  });

  if(!content.t_date_dm_twic_enrol){
    const dates_dm = [];
    //find all submition dates of the reports where dm_twic_status is not empty
    contact.reports.forEach(report => {
      if (getField(report, 'data._dm_twic_status') === 'eligible'){
        dates_dm.push(report.reported_date);
      }
    });
    //console.log('DATES: ', dates);
    if(dates_dm.length >= 1){
      //from all the dates find the one longest ago
      const t_date_dm_twic_enrol = (dates_dm.sort()[0]);
      //make readable date format
      content.t_date_dm_twic_enrol = t_date_dm_twic_enrol;
      //console.warn('CONTENT: ', content);
    }
  }

  if(!isValidDateFormat(content.t_date_dm_twic_enrol) && content.t_date_dm_twic_enrol){
    try{
      content.t_date_dm_twic_enrol = formatDateForTwicEnrolDate(content.t_date_dm_twic_enrol);
    }catch {
      try{
        if (!isValidDateFormat(content.t_date_dm_twic_enrol)){
          content.t_date_dm_twic_enrol = formatDateComplex(content.t_date_dm_twic_enrol);
        }
      }
      catch{
        try{
          if (!isValidDateFormat(content.t_date_dm_twic_enrol)){
            content.t_date_dm_twic_enrol = convertUnixTimestampToDate(content.t_date_dm_twic_enrol);
          }
        }
        catch{
          console.log('conversion attempts terminated');
        }
      }
    }
  }

  content.t_date_aht_twic_enrol = '';
  allReportsSorted.every(report => {
    if (report !== undefined){
      if (report.form === CORRECTION_FORM) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === 'date_aht_twic_enrol'){
          content.t_date_aht_twic_enrol = report.fields.new_date;
          return false;
        }
      }
    }
    return true;
  });

  if(!content.t_date_aht_twic_enrol){
    const dates_aht = [];
    //find all submition dates of the reports where dm_twic_status is not empty
    contact.reports.forEach(report => {
      if (getField(report, 'data._aht_twic_status') === 'eligible'){
        dates_aht.push(report.reported_date);
      }
    });
    //console.log('DATES: ', dates);
    if(dates_aht.length >= 1){
      //from all the dates find the one longest ago
      const t_date_aht_twic_enrol = (dates_aht.sort()[0]);
      //make readable date format
      content.t_date_aht_twic_enrol = t_date_aht_twic_enrol;
      //console.warn('CONTENT: ', content);
    }
  }

  if(!isValidDateFormat(content.t_date_aht_twic_enrol) && content.t_date_aht_twic_enrol){
    try{
      content.t_date_aht_twic_enrol = formatDateForTwicEnrolDate(content.t_date_aht_twic_enrol);
    }catch {
      try{
        if (!isValidDateFormat(content.t_date_aht_twic_enrol)){
          content.t_date_aht_twic_enrol = formatDateComplex(content.t_date_aht_twic_enrol);
        }
      }
      catch{
        try{
          if (!isValidDateFormat(content.t_date_aht_twic_enrol)){
            content.t_date_aht_twic_enrol = convertUnixTimestampToDate(content.t_date_aht_twic_enrol);
          }
        }
        catch{
          console.log('conversion attempts terminated');
        }
      }
    }
  }
}

module.exports = {
  preLoadingToAll
};
