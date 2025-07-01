const {getField} = require('../nools-extras');
const {
  DM_TX_STATUS_FIELD,
  DM_TX_STATUS,
  BG_STATUS,
  AHT_TX_STATUS_FIELD,
  AHT_TX_STATUS,
  AHT_DIAGNOSTIC_STATUS_FIELD,
  AHT_DIAGNOSTIC_STATUS,
  DM_DX_STATUS,
  BP_STATUS_FIELD,
  BP_STATUS,
  DM_TWIC_ARM_STATUS,
  DM_DX_STATUS_FIELD,
  DM_BG_STATUS_FIELD,
  DM_TWIC_ELIGIBILITY_FIELD,
  CHOL_STATUS_FIELD,
  CHOLESTEROL_STATUS,
  HBA1C_STATUS_FIELD,
  HBA1C_STATUS,
  CO_DEACTIVATION_FIELD,
  FBG_STATUS_FIELD,
  FBG_STATUS,
  DM_TWIC_STATUS_FIELD,
  DM_TWIC_STATUS,
  TWIC_ARMS_FIELD,
  DM_INTERVENTION_FORM,
  DM_CONTROL_FORM,
  CORRECTION_FORM,
  CORRECTION_VARIABLE,
  CORRECTION_OUTCOME,
  BP_CONTROL_FORM,
  BP_CHOL_STATUS_FIELD,
  AHT_TWIC_STATUS_FIELD,
  BP_INTERVENTION_FORM,
  CLIN_EVENT_FIELD,
  AHT_TWIC_STATUS,
  T_AHT_TWIC_STATUS_FIELD
} = require('../data/ENUM');

/**
 * appliesIf logic for dm_intervention -> dm_intervention
 * @param {report} report Of type dm_intervention
 * @return {boolean} - if flow moves to dm_intervention or not
 */
function appliesIfDmInterventionSelf(mostRecentReport, reports) {
  let dm_txs = getField(mostRecentReport, DM_TX_STATUS_FIELD);
  let dm_dxs = getField(mostRecentReport, DM_DX_STATUS_FIELD);
  let bg_status = getField(mostRecentReport, DM_BG_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === DM_TX_STATUS_FIELD.substring(6)) {
          dm_txs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === DM_DX_STATUS_FIELD.substring(6)) {
          dm_dxs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === DM_BG_STATUS_FIELD.substring(6)) {
          bg_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if ((dm_txs === DM_TX_STATUS.FAC_CARE_REFILL || dm_txs === DM_TX_STATUS.UPDOSING || dm_txs === DM_TX_STATUS.UNAVAILABLE || dm_txs === DM_TX_STATUS.CONSIDERING || dm_txs === DM_TX_STATUS.ACTIVE_STABLE || dm_txs === DM_TX_STATUS.ACTIVE_ADJUSTED || dm_txs === DM_TX_STATUS.ZERO_DOSE || dm_txs === DM_TX_STATUS.IN_FACILITY_CARE) && dm_dxs === DM_DX_STATUS.DIAGNOSED && (bg_status === BG_STATUS.ACTIVE || bg_status === BG_STATUS.NOT_REQUIRED)) {
    return true;
  }else if (bg_status === BG_STATUS.CONSIDERING || bg_status === BG_STATUS.UNAVAILABLE || bg_status === BG_STATUS.REFUSED) {
    return true;
  }else if ((dm_dxs === DM_DX_STATUS.PREDM_DIAGNOSED || dm_dxs === DM_DX_STATUS.TYPE_1 || dm_dxs === DM_DX_STATUS.AWAITING_CONFIRM) && (bg_status === BG_STATUS.ACTIVE)) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for dm_intervention -> dm_intervention
 * @param {report} report Of type dm_intervention
 * @return {boolean} - if flow moves to dm_intervention or not
 */
function appliesIfDmControlSelf(mostRecentReport, reports) {
  let dm_dxs = getField(mostRecentReport, DM_DX_STATUS_FIELD);
  let bg_status = getField(mostRecentReport, DM_BG_STATUS_FIELD);
  let dm_twic_status = getField(mostRecentReport, DM_TWIC_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === DM_DX_STATUS_FIELD.substring(6)) {
          dm_dxs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === DM_BG_STATUS_FIELD.substring(6)) {
          bg_status = getField(report, CORRECTION_OUTCOME);
        }
        if (correction_variable === DM_TWIC_STATUS_FIELD.substring(6)) {
          dm_twic_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (bg_status === BG_STATUS.CONSIDERING || bg_status === BG_STATUS.UNAVAILABLE || bg_status === BG_STATUS.REFUSED) {
    return true;
  } else if ((bg_status === BG_STATUS.ACTIVE) && (dm_dxs === DM_DX_STATUS.PREDM_DIAGNOSED || dm_dxs === DM_DX_STATUS.TYPE_1 || dm_dxs === DM_DX_STATUS.AWAITING_CONFIRM)) {
    return true;
  } else if (bg_status === BG_STATUS.ACTIVE && (dm_twic_status !== DM_TWIC_STATUS.ELIGIBLE && dm_twic_status !== DM_TWIC_STATUS.SIX_M_COMPLETE) && dm_dxs === DM_DX_STATUS.DIAGNOSED) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for dm_intervention -> dm_intervention
 * @param {report} report Of type dm_intervention
 * @return {boolean} - if flow moves to dm_intervention or not
 */
function appliesIfDmControlSelfTwic(reports) {
  let outcome = false;
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  if (reports) {
    reports.forEach((report) => {
      if (report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
        const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
        if(dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
          oldest_report = report;
        }
      }  
    });
    const dm_twic_status2 = getField(oldest_report, DM_TWIC_STATUS_FIELD);
    if(dm_twic_status2 === DM_TWIC_STATUS.ELIGIBLE){
      outcome = true;
    }
  }
  return outcome;
}

/**
 * appliesIf logic for bp_cont self loop (twic)
 * @param {report} report Of type bp_cont
 * @return {boolean} - if flow moves to bp_cont or not
 */
function appliesIfBpControlSelfTwic(reports) {
  let outcome = false;
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  if (reports) {
    reports.forEach((report) => {
      if (report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
        const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
        if(aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE){
          oldest_report = report;
        }
      }  
    });
    const aht_twic_status2 = getField(oldest_report, AHT_TWIC_STATUS_FIELD);
    if(aht_twic_status2 === AHT_TWIC_STATUS.ELIGIBLE){
      outcome = true;
    }
  }
  return outcome;
}

/**
 * appliesIf logic for bp_cont self loop (twic)
 * @param {report} report Of type bp_cont
 * @return {boolean} - if flow moves to bp_cont or not
 */
function appliesIfBpInterventionSelfTwic(mostRecentReport, reports) {
  let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === AHT_DIAGNOSTIC_STATUS_FIELD.substring(6)) {
          aht_dxs = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  let outcome = false;
  if (aht_dxs !== AHT_DIAGNOSTIC_STATUS.DIAGNOSED && aht_dxs !== AHT_DIAGNOSTIC_STATUS.AWAITING_CONFIRM){
    if (!reports) {
      return;
    }
    let oldest_report = reports[reports.length - 1];
    if (reports) {
      reports.forEach((report) => {
        if (report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
          const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
          if(aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE){
            oldest_report = report;
          }
        }  
      });
      const aht_twic_status2 = getField(oldest_report, AHT_TWIC_STATUS_FIELD);
      if(aht_twic_status2 === AHT_TWIC_STATUS.ELIGIBLE){
        outcome = true;
      }
    }
    
  }
  return outcome;
}

/**
 * appliesIf logic for bp_cont self loop (twic)
 * @param {report} report Of type bp_cont
 * @return {boolean} - if flow moves to bp_cont or not
 */
function appliesIfDmInterventionSelfTwic(mostRecentReport, reports) {
  let dm_dxs = getField(mostRecentReport, DM_DX_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === DM_DX_STATUS_FIELD.substring(6)) {
          dm_dxs = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  let outcome = false;
  if (dm_dxs === DM_DX_STATUS.SCREENED_NORMAL || dm_dxs === DM_DX_STATUS.TYPE_1){
    if (!reports) {
      return;
    }
    let oldest_report = reports[reports.length - 1];
    if (reports) {
      reports.forEach((report) => {
        if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
          const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
          if(dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
            oldest_report = report;
          }
        }  
      });
      const dm_twic_status2 = getField(oldest_report, DM_TWIC_STATUS_FIELD);
      if(dm_twic_status2 === DM_TWIC_STATUS.ELIGIBLE){
        outcome = true;
      }
    }
  }
  return outcome;
}

/**
 * appliesIf logic for bp_intervention -> bp_intervention
 * @param {report} report Of type bp_intervention
 * @return {boolean} - if flow moves to bp_intervention or not
 */
function appliesIfBpInterventionSelf(mostRecentReport, reports) {
  let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);
  let aht_txs = getField(mostRecentReport, AHT_TX_STATUS_FIELD);
  let bp_status = getField(mostRecentReport, BP_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === AHT_DIAGNOSTIC_STATUS_FIELD.substring(6)) {
          aht_dxs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === AHT_TX_STATUS_FIELD.substring(6)) {
          aht_txs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === BP_STATUS_FIELD.substring(6)) {
          bp_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if ((aht_txs === AHT_TX_STATUS.UNAVAILABLE || aht_txs === AHT_TX_STATUS.CONSIDERING || aht_txs === AHT_TX_STATUS.ACTIVE_STABLE || aht_txs === AHT_TX_STATUS.ACTIVE_ADJUSTED || aht_txs === AHT_TX_STATUS.ZERO_DOSE || aht_txs === AHT_TX_STATUS.IN_FACILITY_CARE || aht_txs === AHT_TX_STATUS.FAC_CARE_REFILL || aht_txs === AHT_TX_STATUS.FAC_CARE_ALARM) && (aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED) && (bp_status === BP_STATUS.ACTIVE)){
    return true;
  } else if (bp_status === BP_STATUS.UNAVAILABLE || bp_status === BP_STATUS.CONSIDERING || bp_status === BP_STATUS.REFUSED) {
    return true;
  } else if ((bp_status === BP_STATUS.ACTIVE) && (aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED || aht_dxs === AHT_DIAGNOSTIC_STATUS.AWAITING_CONFIRM || aht_dxs === AHT_DIAGNOSTIC_STATUS.HIGHNORMAL || aht_dxs === AHT_DIAGNOSTIC_STATUS.NORMAL)) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for bp_control -> bp_control
 * @param {report} report Of type bp_control
 * @return {boolean} - if flow moves to bp_control or not
 */
function appliesIfBpControlSelf(mostRecentReport, reports) {
  let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);
  let bp_status = getField(mostRecentReport, BP_STATUS_FIELD);
  let aht_twic_status = getField(mostRecentReport, AHT_TWIC_STATUS_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === DM_TX_STATUS_FIELD.substring(6)) {
          aht_dxs = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === BP_STATUS_FIELD.substring(6)) {
          bp_status = getField(report, CORRECTION_OUTCOME);
        }
        if (correction_variable === AHT_TWIC_STATUS_FIELD.substring(6)) {
          aht_twic_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }
  

  if (bp_status === BP_STATUS.UNAVAILABLE || bp_status === BP_STATUS.CONSIDERING || bp_status === BP_STATUS.REFUSED) {
    return true;
  } else if ((bp_status === BP_STATUS.ACTIVE) && (aht_dxs === AHT_DIAGNOSTIC_STATUS.AWAITING_CONFIRM || aht_dxs === AHT_DIAGNOSTIC_STATUS.NORMAL || aht_dxs === AHT_DIAGNOSTIC_STATUS.HIGHNORMAL)) {
    return true;
  } else if (bp_status === BP_STATUS.ACTIVE && (aht_twic_status !== AHT_TWIC_STATUS.ELIGIBLE && aht_twic_status !== AHT_TWIC_STATUS.SIX_M_COMPLETE) && aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> dm_intervention
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to dm_intervention or not
 */
function appliesIfMainCohortToDmIntervention(mostRecentReport, reports, contact) {
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }
  
  if (twic_arm === DM_TWIC_ARM_STATUS.INTERVENTION) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for flow_decider-> bp_intervention
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to bp_intervention or not
 */
function appliesIfFlowDeciderToBpIntervention(contact, mostRecentReport, reports) {
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (twic_arm === DM_TWIC_ARM_STATUS.INTERVENTION) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for flow_decider-> bp_control
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to bp_control or not
 */
function appliesIfFlowDeciderToBpControl(mostRecentReport, reports, contact) {
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'aht_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (twic_arm === DM_TWIC_ARM_STATUS.CONTROL) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> bp_intervention
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to bp_intervention or not
 */
function appliesIfMainCohortToBpIntervention(contact, mostRecentReport, reports) {
  // let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        /*
        if (correction_variable === AHT_DIAGNOSTIC_STATUS_FIELD.substring(6)) {
          aht_dxs = getField(report, CORRECTION_OUTCOME);
        } 
        */
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }
  
  if (twic_arm === DM_TWIC_ARM_STATUS.INTERVENTION) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> bp_control
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to bp_control or not
 */
function appliesIfMainCohortToBpControl(mostRecentReport, reports, contact) {
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (twic_arm === DM_TWIC_ARM_STATUS.CONTROL) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> dm_intervention
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to dm_intervention or not
 */
function appliesIfMainCohortToFlowDecider(mostRecentReport, reports, contact) {

  // Clarification for Kevin: 
  /**
   * twic_arm from the getField if exisiting field which is empty: empty String
   * twic_arm from any contact that doesn't have the twic arm set yet: contact.contact.twic_arm --> returns 'undefined'
   * Therefore, we first check if the most recent form contains the twic_arm variable
   * If empty twic_arm, check the contact object.
   * In every case go through the correcton form as a last step
   * 
   * Cases:
   * Case 1: existing clients within the dm/bp flows --> have twic_arm variable in their cohort_bsl available
   * Case 2: new clients --> have the twic_arm variable as a attribute (contact object)
   * Case 3: clients already created but situated right after submitting the cohort_bsl form --> twic_arm not available anymore through cohort_bsl --> contact edit OR correction form required!
   * 
   */
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }
  
  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (twic_arm !== DM_TWIC_ARM_STATUS.CONTROL && twic_arm !== DM_TWIC_ARM_STATUS.INTERVENTION) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> dm_control
 * @param {report} report Of type main_cohort
 * @returns {boolean} - if flow moves to dm_control or not
 */
function appliesIfMainCohortToDmControl(mostRecentReport, reports, contact) {
  let twic_arm;
  twic_arm = getField(mostRecentReport, TWIC_ARMS_FIELD);

  if (twic_arm.length === 0){
    try{
      twic_arm = contact.contact.twic_arm;
    }
    catch{
      console.log('');
    }
  }

  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === 'twic_arm') {
          twic_arm = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (twic_arm === DM_TWIC_ARM_STATUS.CONTROL) {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> bp_screening
 * @param {report} report Of type bp_initiate
 * @returns {boolean} - if flow moves to bp_screening or not
 */
function appliesIfEConsentToMainCohort(report) {
  const consent_confirm = getField(report, 'econsent_confirm');
  if (consent_confirm === '1') {
    return true;
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> bp_screening
 * @param {report} report Of type bp_initiate
 * @returns {boolean} - if flow moves to bp_screening or not
 */
function appliesIfEConsentToEConsent(report) {
  const consent_confirm = getField(report, 'econsent_confirm');
  if (consent_confirm === '2') {
    const rs_no_consent = getField(report, 'rs_no_consent');
    if (rs_no_consent === 'refused' || rs_no_consent === 'considering' || rs_no_consent === 'witness_guardian_missing' || rs_no_consent === 'econsent_problems'){
      return true;
    }
  }
  return false;
}

/**
 * appliesIf logic for main_cohort-> dm_confirm
 * @param {report} report Of type bp_initiate
 * @returns {boolean} - if flow moves to bp_screening or not
 */
function appliesIfMainCohortToDmConfirm(report) {
  const dm_tx_status = getField(report, DM_TX_STATUS_FIELD);
  return [
    DM_TX_STATUS.IN_FACILITY_CARE,
  ].includes(dm_tx_status);
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmTwicToCholesterol(mostRecentReport, reports) {
  let chol_status = getField(mostRecentReport, CHOL_STATUS_FIELD);
  let dm_twic_eligibility = getField(mostRecentReport, DM_TWIC_ELIGIBILITY_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === CHOL_STATUS_FIELD.substring(6)) {
          chol_status = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === DM_TWIC_ELIGIBILITY_FIELD.substring(6)){
          dm_twic_eligibility = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (chol_status  === CHOLESTEROL_STATUS.NOT_OBTAINED && (dm_twic_eligibility === DM_TWIC_STATUS.SIX_M_COMPLETE || dm_twic_eligibility === DM_TWIC_STATUS.TWELVE_M_COMPLETE)) {
    return true;
  }
  
  return false;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmTwicToHba1c(mostRecentReport, reports) {
  let hba1c_status = getField(mostRecentReport, HBA1C_STATUS_FIELD);
  let dm_twic_eligibility = getField(mostRecentReport, DM_TWIC_ELIGIBILITY_FIELD);

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        // example of correction_variable: 'dm_dxs'
        // DM_DX_STATUS_FIELD: 'data._dm_dxs'
        if (correction_variable === HBA1C_STATUS_FIELD.substring(6)) {
          hba1c_status = getField(report, CORRECTION_OUTCOME);
        } 
        if (correction_variable === DM_TWIC_ELIGIBILITY_FIELD.substring(6)){
          dm_twic_eligibility = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  if (hba1c_status  === HBA1C_STATUS.NOT_OBTAINED && (dm_twic_eligibility === DM_TWIC_STATUS.SIX_M_COMPLETE || dm_twic_eligibility === DM_TWIC_STATUS.TWELVE_M_COMPLETE)) {
    return true;
  }
  
  return false;
}


/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfPersonClinEv(reports) {
  let outcome = false;
  //const mostRecentReportSupDate = getMostRecentReport(reports, 'su').reported_date;
  reports.forEach(report => {
    const clin_ev = getField(report, CLIN_EVENT_FIELD);
    //const reportDate = report.reported_date;
    if (clin_ev  === '1') {
      outcome = true;
    }
  });
  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToFbg(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToFbg6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToFbg12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToFbg(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToFbg6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToFbg12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const fbg = getField(report, FBG_STATUS_FIELD);
      if (fbg === FBG_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToHba1c(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToHba1c6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToHba1c12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToHba1c(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToHba1c6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToHba1c12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const hba1c = getField(report, HBA1C_STATUS_FIELD);
      if (hba1c === HBA1C_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToChol(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToChol6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpControlToChol6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (t_aht_twic_status  === AHT_TWIC_STATUS.ELIGIBLE && aht_twic_status  === AHT_TWIC_STATUS.SIX_M_COMPLETE && report.form === BP_CONTROL_FORM) {
      const bp_chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (bp_chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpInterventionToChol6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (t_aht_twic_status  === AHT_TWIC_STATUS.ELIGIBLE && aht_twic_status  === AHT_TWIC_STATUS.SIX_M_COMPLETE && report.form === BP_INTERVENTION_FORM) {
      const bp_chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (bp_chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToChol(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToChol6m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToSmallFormsComplete6m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if ((dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE || dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE) && report.form === DM_CONTROL_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpControlToSmallFormsComplete6m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    if ((aht_twic_status  === AHT_TWIC_STATUS.SIX_M_COMPLETE || aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE) && report.form === BP_CONTROL_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpInterventionToSmallFormsComplete6m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    if ((aht_twic_status  === AHT_TWIC_STATUS.SIX_M_COMPLETE || aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE) && report.form === BP_INTERVENTION_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToSmallFormsComplete6m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if ((dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE || dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE) && report.form === DM_INTERVENTION_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToSmallFormsComplete12m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpControlToSmallFormsComplete12m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    if (aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_CONTROL_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpInterventionToSmallFormsComplete12m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    if (aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_INTERVENTION_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToSmallFormsComplete12m(reports) {
  let outcome = true;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      outcome = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmControlToChol12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpControlToChol12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if ((t_aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE || t_aht_twic_status === AHT_TWIC_STATUS.SIX_M_COMPLETE) && aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_CONTROL_FORM) {
      const bp_chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (bp_chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpInterventionToChol12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if ((t_aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE || t_aht_twic_status === AHT_TWIC_STATUS.SIX_M_COMPLETE) && aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_INTERVENTION_FORM) {
      const bp_chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (bp_chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDmInterventionToChol12m(reports) {
  let outcome = false;
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        outcome = true;
      }
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpControlToChol(reports) {
  let outcome = false;
  let first_twic = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (!t_aht_twic_status && aht_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === BP_CONTROL_FORM) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED && first_twic) {
        outcome = true;
      }
      first_twic = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfBpInterventionToChol(reports) {
  let outcome = false;
  let first_twic = true;
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (!t_aht_twic_status && aht_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === BP_INTERVENTION_FORM) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED && first_twic) {
        outcome = true;
      }
      first_twic = false;
    }
  });

  return outcome;
}

/**
  * appliesIf logic for bp_screening-> bp_initiate
  * @param {report} report Of type bp_confirm
  * @returns {boolean} - if flow moves to bp_confirm or not
*/
function appliesIfDeathToVerbalAutopsy(report) {
  const reason_droupout = getField(report, CO_DEACTIVATION_FIELD);

  if (reason_droupout  === 'death' ) {
    return true;
  }
  
  return false;
}


module.exports = {
  appliesIfDmInterventionSelf,
  appliesIfEConsentToEConsent,
  appliesIfMainCohortToDmIntervention,
  appliesIfDeathToVerbalAutopsy,
  appliesIfDmControlToChol6m,
  appliesIfDmControlToChol12m,
  appliesIfDmInterventionToChol12m,
  appliesIfDmInterventionToChol6m,
  appliesIfDmControlToFbg6m,
  appliesIfDmControlToFbg12m,
  appliesIfDmControlToHba1c6m,
  appliesIfDmInterventionToSmallFormsComplete12m,
  appliesIfBpControlToSmallFormsComplete12m,
  appliesIfDmControlToHba1c12m,
  appliesIfBpInterventionSelf,
  appliesIfDmTwicToCholesterol,
  appliesIfDmInterventionToHba1c6m,
  appliesIfDmInterventionToHba1c12m,
  appliesIfDmControlToSmallFormsComplete6m,
  appliesIfDmTwicToHba1c,
  appliesIfBpInterventionToChol6m,
  appliesIfBpControlToChol6m,
  appliesIfFlowDeciderToBpControl,
  appliesIfDmInterventionToSmallFormsComplete6m,
  appliesIfBpControlToSmallFormsComplete6m,
  appliesIfDmControlToSmallFormsComplete12m,
  appliesIfBpControlToChol,
  appliesIfMainCohortToFlowDecider,
  appliesIfBpControlSelf,
  appliesIfBpInterventionToSmallFormsComplete12m,
  appliesIfBpControlSelfTwic,
  appliesIfDmInterventionToFbg6m,
  appliesIfDmInterventionToFbg12m,
  appliesIfMainCohortToDmConfirm,
  appliesIfBpInterventionToChol12m,
  appliesIfBpControlToChol12m,
  appliesIfMainCohortToBpIntervention,
  appliesIfMainCohortToBpControl,
  appliesIfFlowDeciderToBpIntervention,
  appliesIfDmInterventionToChol,
  appliesIfBpInterventionToSmallFormsComplete6m,
  appliesIfDmInterventionToHba1c,
  appliesIfPersonClinEv,
  appliesIfDmInterventionToFbg,
  appliesIfDmControlSelfTwic,
  appliesIfDmControlSelf,
  appliesIfEConsentToMainCohort,
  appliesIfMainCohortToDmControl,
  appliesIfDmControlToFbg,
  appliesIfDmControlToChol,
  appliesIfBpInterventionToChol,
  appliesIfDmControlToHba1c,
  appliesIfDmInterventionSelfTwic,
  appliesIfBpInterventionSelfTwic
};

