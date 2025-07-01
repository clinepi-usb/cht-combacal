const { MAIN_COHORT_FORM } = require('./data/ENUM');
const { getField } = require('./nools-extras');
const { setPreloadedField, getJsonField } = require('./tasks/utils');

module.exports = {
  isFormType(c, r) {
    return r.form === 'econsent';
  },

  formHasOutcome(c, r, outcome) {
    return r.fields.econsent_confirm === outcome;
  },

  householdWithGPS(c) {
    if(c.contact.geolocation_widget){
      return c.contact.geolocation_widget.length >= 1;
    }else{
      return false;
    }
  },

  takesBpMedis(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      aht_tx: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });
    return stati.aht_tx === 'yes';
  },

  takesDmMedis(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      dm_tx: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    }
    );
    return stati.dm_tx === 'yes';
  },

  hasAlarmSymptoms(c, r) {
    //const mostRecentReport = getMostRecentReport(c.reports, 'co');
    const warn_symp = getField(r, 'sym.warn_symp');
    return warn_symp === '1';
  },

  hypertensionPatientInCommunityCare(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      aht_txs: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });
    return stati.aht_txs === 'active_stable' || stati.aht_txs === 'active_adjusted'|| stati.aht_txs === 'zero_dose' || stati.aht_txs === 'updosing' || stati.aht_txs === 'unavailable' || stati.aht_txs === 'considering';
  },

  hypertensionPatientInFacilityCare(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      aht_txs: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    }
    );

    console.log('here');
    console.log('contact', contact);
    console.log('stati', stati);

    return stati.aht_txs === 'fac_care' || stati.aht_txs === 'fac_care_refill' || stati.aht_txs === 'fac_care_alarm';
  },

  diabetesPatientInCommunityCare(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      dm_txs: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });

    return stati.dm_txs === 'active_stable' || stati.dm_txs === 'active_adjusted'|| stati.dm_txs === 'zero_dose' || stati.aht_txs === 'updosing' || stati.aht_txs === 'unavailable' || stati.aht_txs === 'considering';
  },

  diabetesPatientInFacilityCare(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      dm_txs: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });

    return stati.dm_txs === 'fac_care' || stati.dm_txs === 'fac_care_refill';
  },
  
  hasGivenConsent(contact) {
    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

    const stati = {
      econsent_confirm: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = key;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });

    return stati.econsent_confirm === '1';
  },

  hasDiabetes(contact) {

    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);


    const stati = {
      dm_dxs: ''
    };

    // Loop through each key in stati
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });


    if (stati.dm_dxs === 'diagnosed' || stati.dm_dxs === 'type_1'){
      return true;
    }else{
      return false;
    }
  },




  hasHypertension(contact) {

    const sortedReports = [...contact.reports].sort((a, b) => b.reported_date - a.reported_date);

  
    const stati = { aht_dxs: '' };
  
    Object.keys(stati).forEach(key => {
      // Process reports from newest to oldest
      for (const report of sortedReports) {
        try {
          // Construct the field name by prepending '_' to the key
          const field = `_${key}`;

          // Attempt to get the value for this key from the report
          const newValue = setPreloadedField(
            getJsonField(() => report.fields.data[field]),  // Primary field value
            getJsonField(() => report.fields[`t${field}`]) // Secondary field value
          );

          // If a valid value is found, set stati[key] and stop processing for this key
          if (newValue) {
            stati[key] = newValue;
            break; // Stop further processing for this key
          }
        } catch (error) {
          console.error(`Error processing key '${key}' in report:`, error);
        }
      }
    });
    
    return stati.aht_dxs === 'diagnosed';
  },

  numberOfCohortBslForms(c, r) {
    return r.form === MAIN_COHORT_FORM;
  },


  countReportsSubmittedInWindow(reports, form, start, end) {
    let reportsFound = 0;
    reports.forEach(function(r) {
      if (form.indexOf(r.form) >= 0) {
        if (r.reported_date >= start && r.reported_date <= end) {
          reportsFound++;
        }
      }
    });
    return reportsFound;
  },

  getNumberOfReportsOfType(reports, form) {
    let count = 0;
    reports.forEach(function (report) {
      if (form.includes(report.form) && !report.deleted) {
        count += 1;
      }
    });
    return count;
  }
};
