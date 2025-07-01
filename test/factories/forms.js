function dmInitiateReport(reported_date, dm_status, metfin_status, atorva_status) {
  return {
    form: 'dm_initiate',
    reported_date: reported_date,
    fields: {
      dm_initiate: {
        gr_metfin_status: {
          metfin_status: metfin_status
        },
        gr_atorva_status: {
          atorva_status: atorva_status
        },
        gr_dm_diagnostic_status: {
          dm_diagnostic_status: dm_status
        },
      },
    },
  };
}

function dmUpdosingReport(reported_date, metfin_status, atorva_status) {
  return {
    form: 'dm_updosing',
    reported_date: reported_date,
    fields: {
      dm_updosing: {
        gr_metfin_status: {
          metfin_status: metfin_status,
        },
        gr_atorva_status: {
          atorva_status: atorva_status,
        },
      },
    },
  };
}

function dmScreeningReport(reported_date, dm_status) {
  return {
    form: 'dm_screening',
    reported_date: reported_date,
    fields: {
      dm_screening: {
        gr_dm_diagnostic_status: {
          dm_diagnostic_status: dm_status,
        },
      },
    }
  };
}

function dmConfirmReport(reported_date, dm_status) {
  return {
    form: 'dm_confirm',
    reported_date: reported_date,
    fields: {
      dm_confirmation: {
        gr_dm_diagnostic_status: {
          dm_diagnostic_status: dm_status,
        },
      },
    }
  };
}

function dmFollowupContReport(reported_date, dm_status, bg_status, t_dbs_date='', dbs_expiry='', dbs_status) {
  return {
    form: 'dm_followup_cont',
    reported_date: reported_date,
    fields: {
      t_dbs_date: t_dbs_date,
      dbs_expiry: dbs_expiry,
      gr_dm_diagnostic_status: {
        dm_diagnostic_status: dm_status,
      },
      dm_followup: {
        bg: {
          bg_status: bg_status
        },
        dbs: {
          dbs_status: dbs_status
        }
      }
    }
  };
}

function dmFollowupIntReport(reported_date, dm_status, metfin_status, atorva_status, bg_status) {
  return {
    form: 'dm_followup_int',
    reported_date: reported_date,
    fields: {
      dm_followup: {
        metfin_status: metfin_status,
        atorva_status: atorva_status,
        bg_status: bg_status
      },
      dm_diagnostic_status: dm_status
    }
  };
}

function bpScreeningReport(reported_date, bp_status, aht_dx_status) {
  return {
    form: 'bp_screening',
    reported_date: reported_date,
    fields: {
      data: {
        _aht_dx_status: aht_dx_status,
        _bp_status: bp_status
      },
    }
  };
}

function bpConfirmReport(reported_date, bp_status) {
  return {
    form: 'bp_confirm',
    reported_date: reported_date,
    fields: {
      data: {
        _bp_diagnostic_status: bp_status
      },
    }
  };
}

function bpInitiateReport(reported_date, aht_tx_status) {
  return {
    form: 'bp_initiate',
    reported_date: reported_date,
    fields: {
      data: {
        _aht_tx_status: aht_tx_status
      },
    }
  };
}


module.exports = {
  dmInitiateReport,
  dmUpdosingReport,
  dmScreeningReport,
  dmConfirmReport,
  dmFollowupContReport,
  dmFollowupIntReport,
  bpConfirmReport,
  bpScreeningReport,
  bpInitiateReport
};
