const {
  DM_DX_STATUS,
  BG_STATUS, 
  AHT_DIAGNOSTIC_STATUS, 
  AHT_DIAGNOSTIC_STATUS_FIELD, 
  AHT_TX_STATUS_FIELD, 
  AHT_TX_STATUS,
  BP_STATUS_FIELD,
  BP_STATUS,
  AHT_TWIC_STATUS_FIELD,
  DM_TX_STATUS_FIELD,
  DM_TX_STATUS,
  DM_DX_STATUS_FIELD,
  DM_BG_STATUS_FIELD,
  DM_INTERVENTION_FORM,
  DM_TWIC_STATUS,
  DM_TWIC_STATUS_FIELD,
  DM_CONTROL_FORM,
  CORRECTION_OUTCOME,
  CORRECTION_VARIABLE,
  CORRECTION_FORM,
  BP_CONTROL_FORM,
  BP_INTERVENTION_FORM,
  AHT_TWIC_STATUS,
  BP_CHOL_STATUS_FIELD,
  T_AHT_TWIC_STATUS_FIELD,
  CHOLESTEROL_STATUS,
  CHOL_STATUS_FIELD,
  FBG_STATUS_FIELD,
  FBG_STATUS,
  HBA1C_STATUS_FIELD,
  HBA1C_STATUS
} = require('../data/ENUM');

const { getField } = require('../nools-extras');
const { dateAtEndOfDay} = require('./utils');


/**
 * Calculates dueDate for main cohort to dce
 * @returns dueDate
 */
function calculateDueDateForMainCohortToDCE() {
  const targetDate = new Date('2024-11-15T00:00:00Z');
  const unixTimeStamp = targetDate.getTime();
  return dateAtEndOfDay(unixTimeStamp);
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmControlSelfTwic(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      if(dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 312);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmControlSelfTwic2(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      if(dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 162);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpControlSelfTwic(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      if((aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 312);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpInterventionSelfTwic(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      if((aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 310);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventionSelfTwic(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      if((dm_twic_status === DM_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 310);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoHba1c(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoHba1c6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoHba1c12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoHba1c(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoHba1c6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoHba1c12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, HBA1C_STATUS_FIELD);
      if (chol === HBA1C_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoFbg(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoFbg6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoFbg12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoFbg(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoFbg6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoFbg12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, FBG_STATUS_FIELD);
      if (chol === FBG_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoCholesterol(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoCholesterol6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmControltoCholesterol12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoCholesterol(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoCholesterol6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventiontoCholesterol12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
    if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpControltoCholesterol(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (!t_aht_twic_status && aht_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpControltoCholesterol6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (t_aht_twic_status === DM_TWIC_STATUS.ELIGIBLE && aht_twic_status === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpControltoCholesterol12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if ((t_aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE || t_aht_twic_status === AHT_TWIC_STATUS.SIX_M_COMPLETE) && aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpInterventiontoCholesterol(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (!t_aht_twic_status && aht_twic_status  === DM_TWIC_STATUS.ELIGIBLE && report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpInterventiontoCholesterol6m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if (t_aht_twic_status === DM_TWIC_STATUS.ELIGIBLE && aht_twic_status === DM_TWIC_STATUS.SIX_M_COMPLETE && report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpInterventiontoCholesterol12m(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
    const t_aht_twic_status = getField(report, T_AHT_TWIC_STATUS_FIELD);
    if ((t_aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE || t_aht_twic_status === AHT_TWIC_STATUS.SIX_M_COMPLETE) && aht_twic_status  === AHT_TWIC_STATUS.TWELVE_M_COMPLETE && report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const chol = getField(report, BP_CHOL_STATUS_FIELD);
      if (chol === CHOLESTEROL_STATUS.NOT_OBTAINED) {
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpControlSelfTwic2(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      if((aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 162);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForBpInterventionSelfTwic2(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const aht_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      if((aht_twic_status === AHT_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 160);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_cont form self-loop (twic)
 * @param {report} report of type bp_cont
 * @returns dueDate
 */
function calculateDueDateForDmInterventionSelfTwic2(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      if((dm_twic_status === DM_TWIC_STATUS.ELIGIBLE)){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 160);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_control form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmControlSelf(mostRecentReport, reports) {
  let dm_dxs = getField(mostRecentReport, DM_DX_STATUS_FIELD);
  let bg_status = getField(mostRecentReport, DM_BG_STATUS_FIELD);

  // preconditions: early return
  if (!dm_dxs && !bg_status) {
    return;
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === DM_DX_STATUS_FIELD.substring(6)) {
          dm_dxs = getField(report, CORRECTION_OUTCOME);
        }
        if (correction_variable === DM_BG_STATUS_FIELD.substring(6)) {
          bg_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  // dueDate: reported date at end of day is starting point
  const dueDate = dateAtEndOfDay(mostRecentReport.reported_date);

  if (bg_status === BG_STATUS.CONSIDERING || bg_status === BG_STATUS.UNAVAILABLE){
    dueDate.setDate(dueDate.getDate() + 7);
  }
  else if(bg_status === BG_STATUS.REFUSED){
    dueDate.setDate(dueDate.getDate() + 90);
  }
  else if( dm_dxs === DM_DX_STATUS.AWAITING_CONFIRM && bg_status === BG_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1);
  }
  else if( dm_dxs === DM_DX_STATUS.PREDM_DIAGNOSED && bg_status === BG_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 60);
  }
  else if( dm_dxs === DM_DX_STATUS.TYPE_1 && bg_status === BG_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 90);
  }
  else if( dm_dxs === DM_DX_STATUS.DIAGNOSED && bg_status === BG_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 180);
  }
  else if( dm_dxs === DM_DX_STATUS.SCREENED_NORMAL && bg_status === BG_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1095);
  }
  else {
    return;
  }

  return dueDate;
}

/**
 * Calculates dueDate for a dm_control form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForBpInterventionSelf(mostRecentReport, reports) {
  let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);
  let aht_txs = getField(mostRecentReport, AHT_TX_STATUS_FIELD);
  let bp_status = getField(mostRecentReport, BP_STATUS_FIELD);

  // preconditions: early return
  if (!aht_dxs && !bp_status && !aht_txs) {
    return;
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
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

  // dueDate: reported date at end of day is starting point
  const dueDate = dateAtEndOfDay(mostRecentReport.reported_date);

  if (bp_status === BP_STATUS.CONSIDERING || bp_status === BP_STATUS.UNAVAILABLE){
    dueDate.setDate(dueDate.getDate() + 7);
  }
  else if(bp_status === BP_STATUS.REFUSED){
    dueDate.setDate(dueDate.getDate() + 90);
  }
  else if(aht_dxs === AHT_DIAGNOSTIC_STATUS.AWAITING_CONFIRM && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1);
  }
  else if((aht_txs === AHT_TX_STATUS.UNAVAILABLE || aht_txs === AHT_TX_STATUS.CONSIDERING || aht_txs === AHT_TX_STATUS.FAC_CARE_ALARM) && aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 7);
  }
  else if((aht_txs === AHT_TX_STATUS.ACTIVE_ADJUSTED || aht_txs === AHT_TX_STATUS.FAC_CARE_REFILL || aht_txs === AHT_TX_STATUS.ZERO_DOSE) && aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 30);
  }
  else if((aht_txs === AHT_TX_STATUS.ACTIVE_STABLE || aht_txs === AHT_TX_STATUS.IN_FACILITY_CARE) && aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 60);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.HIGHNORMAL && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 180);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 500);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.NORMAL && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1095);
  }
  else {
    return;
  }

  return dueDate;
}

/**
 * Calculates dueDate for a bp_control form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForEConsentSelf(report) {
  const rs_no_consent = getField(report, 'rs_no_consent');

  // preconditions: early return
  if (!rs_no_consent) {
    return;
  }

  // dueDate: reported date at end of day is starting point
  const dueDate = dateAtEndOfDay(report.reported_date);

  if (rs_no_consent === 'considering' || rs_no_consent === 'witness_guardian_missing' || rs_no_consent === 'econsent_problems'){
    dueDate.setDate(dueDate.getDate() + 14);
  }
  else if(rs_no_consent === 'refused'){
    dueDate.setDate(dueDate.getDate() + 180);
  }
  else {
    return;
  }

  return dueDate;
}

/**
 * Calculates dueDate for a bp_control form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForBpControlSelf(mostRecentReport, reports) {
  let aht_dxs = getField(mostRecentReport, AHT_DIAGNOSTIC_STATUS_FIELD);
  let bp_status = getField(mostRecentReport, BP_STATUS_FIELD);

  // preconditions: early return
  if (!aht_dxs && !bp_status) {
    return;
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
        if (correction_variable === AHT_DIAGNOSTIC_STATUS_FIELD.substring(6)) {
          aht_dxs = getField(report, CORRECTION_OUTCOME);
        }
        if (correction_variable === BP_STATUS_FIELD.substring(6)) {
          bp_status = getField(report, CORRECTION_OUTCOME);
        }
      }
    });
  }

  // dueDate: reported date at end of day is starting point
  const dueDate = dateAtEndOfDay(mostRecentReport.reported_date);

  if (bp_status === BP_STATUS.CONSIDERING || bp_status === BP_STATUS.UNAVAILABLE){
    dueDate.setDate(dueDate.getDate() + 7);
  }
  else if(bp_status === BP_STATUS.REFUSED){
    dueDate.setDate(dueDate.getDate() + 60);
  }
  else if(aht_dxs === AHT_DIAGNOSTIC_STATUS.AWAITING_CONFIRM && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.HIGHNORMAL && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 180);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.DIAGNOSED && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 180);
  }
  else if( aht_dxs === AHT_DIAGNOSTIC_STATUS.NORMAL && bp_status === BP_STATUS.ACTIVE){
    dueDate.setDate(dueDate.getDate() + 1095);
  }
  else {
    return;
  }

  return dueDate;
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmInterventionToFbgForm(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      
      if (dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_control form self-loop
 * @param {report} report of type dm_control
 * @returns dueDate
 */
function calculateDueDateForDmControlToFbgForm(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      
      if (dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmInterventionToSmallForms(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === DM_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      
      if (dm_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmControlToSmallForms(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  let twelve = false;
  let six = false;
  reports.forEach(report => {
    if (report.form === DM_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const dm_twic_status = getField(report, DM_TWIC_STATUS_FIELD);
      
      if (dm_twic_status  === DM_TWIC_STATUS.TWELVE_M_COMPLETE){
        oldest_report = report;
        twelve = true;
      }else if(dm_twic_status  === DM_TWIC_STATUS.SIX_M_COMPLETE && !twelve){
        oldest_report = report;
        six = true;
      }else if (dm_twic_status  === DM_TWIC_STATUS.ELIGIBLE && !twelve && !six){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForBpControlToSmallForms(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_CONTROL_FORM && report.reported_date < oldest_report.reported_date) {
      const bp_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      
      if (bp_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a bp_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForBpInterventionToSmallForms(reports) {
  if (!reports) {
    return;
  }
  let oldest_report = reports[reports.length - 1];
  reports.forEach(report => {
    if (report.form === BP_INTERVENTION_FORM && report.reported_date < oldest_report.reported_date) {
      const bp_twic_status = getField(report, AHT_TWIC_STATUS_FIELD);
      
      if (bp_twic_status === DM_TWIC_STATUS.ELIGIBLE){
        oldest_report = report;
      }
    }
  });
  const dueDate = dateAtEndOfDay(oldest_report.reported_date);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}

/**
 * Calculates dueDate for a dm_intervention form self-loop
 * @param {report} report of type dm_intervention
 * @returns dueDate
 */
function calculateDueDateForDmInterventionSelf(mostRecentReport, reports) {
  let dm_txs = getField(mostRecentReport, DM_TX_STATUS_FIELD);
  let dm_dxs = getField(mostRecentReport, DM_DX_STATUS_FIELD);
  let bg_status = getField(mostRecentReport, DM_BG_STATUS_FIELD);

  // preconditions: early return
  if (!dm_txs && !dm_dxs && !bg_status) {
    return;
  }

  //check if correction form was submitted after report was submitted
  if (reports) {
    reports.forEach((report) => {
      if (report.form === CORRECTION_FORM && report.reported_date > mostRecentReport.reported_date) {
        const correction_variable = getField(report, CORRECTION_VARIABLE);
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

  // dueDate: reported date at end of day is starting point
  const dueDate = dateAtEndOfDay(mostRecentReport.reported_date);

  if (bg_status === BG_STATUS.CONSIDERING || bg_status === BG_STATUS.UNAVAILABLE) {
    dueDate.setDate(dueDate.getDate() + 7);
  }else if (bg_status === BG_STATUS.REFUSED) {
    dueDate.setDate(dueDate.getDate() + 90);
  }else if ((dm_dxs === DM_DX_STATUS.AWAITING_CONFIRM) && bg_status === BG_STATUS.ACTIVE) {
    dueDate.setDate(dueDate.getDate() + 1);
  }else if (dm_dxs === DM_DX_STATUS.DIAGNOSED && (dm_txs === DM_TX_STATUS.UPDOSING || dm_txs === DM_TX_STATUS.UNAVAILABLE || dm_txs === DM_TX_STATUS.CONSIDERING)) {
    dueDate.setDate(dueDate.getDate() + 7);
  }else if ((dm_txs === DM_TX_STATUS.ACTIVE_ADJUSTED || dm_txs === DM_TX_STATUS.FAC_CARE_REFILL) && dm_dxs === DM_DX_STATUS.DIAGNOSED) {
    dueDate.setDate(dueDate.getDate() + 30);
  }else if (dm_dxs === DM_DX_STATUS.DIAGNOSED && (dm_txs === DM_TX_STATUS.ACTIVE_STABLE || dm_txs === DM_TX_STATUS.ZERO_DOSE || dm_txs === DM_TX_STATUS.IN_FACILITY_CARE)) {
    dueDate.setDate(dueDate.getDate() + 60);
  }else if (dm_dxs === DM_DX_STATUS.PREDM_DIAGNOSED && bg_status === BG_STATUS.ACTIVE) {
    dueDate.setDate(dueDate.getDate() + 60);
  }else if (dm_dxs === DM_DX_STATUS.TYPE_1 && bg_status === BG_STATUS.ACTIVE) {
    dueDate.setDate(dueDate.getDate() + 90);
  }else if (dm_dxs === DM_DX_STATUS.SCREENED_NORMAL && bg_status === BG_STATUS.ACTIVE) {
    dueDate.setDate(dueDate.getDate() + 1095);
  } else {
    return;
  }

  return dueDate;
}

/**
 * Calculates dueDate for warning symptoms (7 days from reported_date, at end of day)
 * @param {report} report
 * @returns dueDate one week from the reported_date
 */
function calculateDueDateForWarnings(report) {
  const dueDate = dateAtEndOfDay(report.reported_date);
  dueDate.setDate(dueDate.getDate() + 7);
  return dueDate;
}


/**
 * Calculates dueDate for dm_downref -> dm_followup
 * @param {report} report of type dm_downref
 * @returns dueDate
 */
function calculateDueDateForFlowDecider(report) {
  const dueDate = dateAtEndOfDay(report.reported_date);

  dueDate.setFullYear(2023); // Set the year (e.g., 2023)
  dueDate.setMonth(7); // Set the month (0-11, where 0 is January and 11 is December)
  dueDate.setDate(31); // Set the day of the month (1-31)
  dueDate.setHours(0); // Set the hours (0-23)
  dueDate.setMinutes(0); // Set the minutes (0-59)
  dueDate.setSeconds(0); // Set the seconds (0-59)
  dueDate.setMilliseconds(0); // Set the milliseconds (0-999)
  
  return dueDate;
}

module.exports = {
  calculateDueDateForDmInterventionSelf,
  calculateDueDateForDmControlSelfTwic,
  calculateDueDateForWarnings,
  calculateDueDateForDmInterventionToFbgForm,
  calculateDueDateForDmControlToFbgForm,
  calculateDueDateForBpControlSelfTwic2,
  calculateDueDateForBpControlToSmallForms,
  calculateDueDateForBpInterventionSelf,
  calculateDueDateForBpInterventionToSmallForms,
  calculateDueDateForDmControlToSmallForms,
  calculateDueDateForBpControlSelf,
  calculateDueDateForFlowDecider,
  calculateDueDateForDmControlSelf,
  calculateDueDateForBpControltoCholesterol,
  calculateDueDateForBpInterventiontoCholesterol,
  calculateDueDateForBpControltoCholesterol6m,
  calculateDueDateForBpInterventiontoCholesterol6m,
  calculateDueDateForBpControltoCholesterol12m,
  calculateDueDateForBpInterventiontoCholesterol12m,
  calculateDueDateForDmInterventiontoCholesterol,
  calculateDueDateForDmControltoCholesterol,
  calculateDueDateForDmInterventiontoCholesterol6m,
  calculateDueDateForDmControltoCholesterol6m,
  calculateDueDateForDmInterventiontoCholesterol12m,
  calculateDueDateForDmControltoCholesterol12m,
  calculateDueDateForDmControltoFbg,
  calculateDueDateForDmInterventiontoFbg,
  calculateDueDateForDmControltoFbg6m,
  calculateDueDateForDmInterventiontoFbg6m,
  calculateDueDateForDmControltoFbg12m,
  calculateDueDateForDmInterventiontoFbg12m,
  calculateDueDateForDmInterventiontoHba1c,
  calculateDueDateForDmControltoHba1c,
  calculateDueDateForDmInterventiontoHba1c6m,
  calculateDueDateForDmControltoHba1c6m,
  calculateDueDateForDmInterventiontoHba1c12m,
  calculateDueDateForDmControltoHba1c12m,
  calculateDueDateForEConsentSelf,
  calculateDueDateForBpControlSelfTwic,
  calculateDueDateForDmInterventionToSmallForms,
  calculateDueDateForDmInterventionSelfTwic,
  calculateDueDateForDmInterventionSelfTwic2,
  calculateDueDateForBpInterventionSelfTwic,
  calculateDueDateForBpInterventionSelfTwic2,
  calculateDueDateForDmControlSelfTwic2,
  calculateDueDateForMainCohortToDCE
};
