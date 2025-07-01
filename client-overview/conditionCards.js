

const { DM_DX_STATUS } = require('../data/ENUM.js');
const {setPreloadedField, getJsonField } = require('../tasks/utils.js');

function getStati() {
  // Reverse the reports array to process from newest to oldest
  const sortedReports = [...reports].sort((a, b) => b.reported_date - a.reported_date);

  // Initialize stati with empty values
  const stati = {
    sex: '',
    twic_arm: '',
    aht_txs: '',
    aht_dxs: '',
    aht_tx: '',
    aht_drugs: '',
    bp_status: '',
    amlohct_dose: '',
    bg_status: '',
    dm_txs: '',
    dm_dxs: '',
    dm_tx: '',
    dm_drugs: '',
    metfin_dose: '',
    hiv_stat: '',
    other_drugs: '',
    aht_twic_status: '',
    dm_twic_status: '',
  };

  const statusDates = {
    bp_status_date: '',
    hiv_stat_date: '',
    bg_status_date: '',
  };

  console.log('sortedReports:', sortedReports);


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
          if (key === 'bp_status' || key === 'hiv_stat' || key === 'bg_status') {
            statusDates[`${key}_date`] = new Date(report.reported_date).toISOString().split('T')[0];

          }
          stati[key] = newValue;
          break; // Stop further processing for this key
        }
      } catch (error) {
        console.error(`Error processing key '${key}' in report:`, error);
      }
    }
  });

  console.log('Final stati:', stati);
  console.log('Final statusDates:', statusDates);

  return {stati, statusDates};
}




function getConditionCards() {
  const cards = [];
  
  const {stati, statusDates} = getStati();

  // If DM diagnostic status is not empty- Card

  if (stati.dm_dxs !== '') {
    cards.push({
      label: 'Diabetes',
      appliesToType: 'person',
      appliesIf: function() {
        return (
          true
        );
      },
      fields: function () {
        const fields = [];

        // Labels for the different diagnostic statuses
        const labels = {
          [DM_DX_STATUS.PRIOR_DIAGNOSED]: 'Prior diabetes diagnosis',
          [DM_DX_STATUS.PREDM_DIAGNOSED]: 'Prediabetes',
          [DM_DX_STATUS.DIAGNOSED]: 'Type 2 Diabetes diagnosed',
          [DM_DX_STATUS.AWAITING_CONFIRM]: 'Awaiting confirmation',
          [DM_DX_STATUS.SCREENED_NORMAL]: 'Screened normal',
          ['awaiting_screening']: 'Awaiting screening',
          [DM_DX_STATUS.TYPE_1]: 'Type 1 Diabetes'
        };

        fields.push({
          label: 'Diabetes Diagnostic status',
          value: stati.dm_dxs ? labels[stati.dm_dxs] : 'Not applicable',
          width: 6,
          icon: 'icon-disease-diabetes',
          translate: stati.dm_dxs
        });

        // labels for the different drugs
        /*const drugLabels = {
          ['Metformin']: 'Metformin',
          ['Gliclazide']: 'Gliclazide',
          ['Glibenclamide']: 'Glibenclamide',
          ['Insulin']: 'Insulin',
          ['other']: 'Other'
        };*/

        // divide stati.aht_drugs by the words in drugLabels
        const drugs = stati.dm_drugs.split(' ');
        //create a new string with , between the words
        const drugsString = drugs.join(', ');

        
        if (stati.dm_drugs !== '') {
          fields.push({
            label: 'Diabetes medication',
            value: stati.dm_drugs ? drugsString : 'Not applicable', 
            width: 6,
            icon: 'icon-healthcare-medicine'
          });
        }

        // labels for the different treatment statuses
        const treatmentLabels = {
          ['fac_care']: 'Facility-based care',
          ['updosing']: 'Updosing',
          ['active_stable']: 'Active stable',
          ['active_adjusted']: 'Active adjusted',
          ['considering']: 'Considering',
          ['unavailable']: 'Metformin unavailable',
          ['zero_dose']: 'Zero dose',
          ['requiring_measurement']: 'Requiring measurement',
          ['fac_care_refill']: 'Facility-based care refill',
          ['na']: 'Not applicable'
        };
        

        if (stati.dm_txs !== '') {
          fields.push({
            label: 'Diabetes treatment status',
            value: stati.dm_txs ? treatmentLabels[stati.dm_txs] : 'Not applicable',
            width: 6,
            icon: 'icon-disease-diabetes'
          });
        }

        // Labels for the different BG statuses
        const BGlabels = {
          ['active']: 'Active',
          ['refused']: 'Refused',
          ['considering']: 'Considering',
          ['unavailable']: 'Unavailable',
          ['not_required']: 'Not required'
        };

        fields.push({
          label: 'Blood Sugar measurement',
          value: stati.bg_status ? BGlabels[stati.bg_status]+', '+String(statusDates.bg_status_date) : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-assessment',
          translate: stati.bg_status
        });
        
        return fields;
      }
    });
  
    
  }





  

  // If HIV status is not empty
  if (stati.hiv_stat !== '') {
    cards.push({
      label: 'HIV Status',
      appliesToType: 'person',
      appliesIf: function() {
        return (
          true
        );
      },
      fields: function () {
        const fields = [];

        // Labels for the different HIV statuses
        const labels = {
          ['1']: 'Known HIV positive',
          ['2']: 'Documented HIV negative in the last 12 months',
          ['3']: 'Documented HIV negative more than 12 months ago',
          ['97']: 'Refused to say',
          ['98']: 'Unknown HIV status'
        };

        fields.push({
          label: 'HIV Status',
          value: stati.hiv_stat ? labels[stati.hiv_stat]+', '+String(statusDates.hiv_stat_date) : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-assessment',
          translate: stati.hiv_stat
        });

        return fields;
      }
    });
  }

  // AHt diagnostic status Card
  if (stati.aht_dxs !== '') {
    cards.push({
      label: 'Hypertension',
      appliesToType: 'person',
      appliesIf: function() {
        return (
          true
        );
      },
      fields: function () {
        const fields = [];
  
        // Labels for the different diagnostic statuses
        const diagnosticLabels = {
          ['normal']: 'Normal',
          ['highnormal']: 'High normal',
          ['awaiting_confirm']: 'Awaiting confirmation',
          ['diagnosed']: 'Diagnosed',
          ['awaiting_screening']: 'Awaiting screening'
        };

        console.log('stati.aht_dxs before setting the value of the field:', stati.aht_dxs);
        console.log('diagnosticLabels[stati.aht_dxs]', diagnosticLabels[stati.aht_dxs]);
  
        fields.push({
          label: 'Hypertension Diagnostic Status',
          value: stati.aht_dxs ? diagnosticLabels[stati.aht_dxs] : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-assessment',
          translate: stati.aht_dxs
        });
  
        // Labels for the different treatment statuses
        const treatmentLabels = {
          ['fac_care']: 'Facility-based care',
          ['fac_care_refill']: 'Facility-based care refill',
          ['considering']: 'Considering',
          ['unavailable']: 'Unavailable',
          ['active_stable']: 'Active stable',
          ['active_adjusted']: 'Active adjusted',
          ['fac_care_alarm']: 'Facility-based care alarm',
          ['zero_dose']: 'Zero dose'
        };
  
        fields.push({
          label: 'Hypertension Treatment Status',
          value: stati.aht_txs ? treatmentLabels[stati.aht_txs] : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-assessment',
          translate: stati.aht_txs
        });
  
        // Labels for the different drugs
        /*const drugLabels = {
          ['Amlodipin_$HCTz']: 'Amlodipin/HCTz Combination Pill',
          ['Amlodipin']: 'Amlodipin',
          ['HCTz']: 'HCTz',
          ['Atenolol']: 'Atenolol',
          ['Captopril']: 'Captopril',
          ['Enalapril']: 'Enalapril',
          ['Lisinopril']: 'Lisinopril',
          ['Losartan']: 'Losartan',
          ['Telmisartan']: 'Telmisartan',
          ['Nifedipine']: 'Nifedipine',
          ['Aldactone']: 'Aldactone or Spironolactone',
          ['Lasix']: 'Lasix or Furosemide',
          ['Methyldopa']: 'Methyldopa',
          ['Carvedilol']: 'Carvedilol',
          ['other']: 'Other'
        };*/

        // divide stati.aht_drugs by the words in drugLabels
        const drugs = stati.aht_drugs.split(' ');
        //create a new string with , between the words
        const drugsString = drugs.join(', ');
  
        fields.push({
          label: 'Hypertension Medication',
          value: stati.aht_drugs ? drugsString : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-medicine'
        });

        // Labels for the different BP statuses
        const BPlabels = {
          ['active']: 'Active',
          ['refused']: 'Refused',
          ['considering']: 'Considering',
          ['unavailable']: 'Unavailable'
        };

        fields.push({
          label: 'Blood Pressure measurment',
          value: stati.bp_status ? BPlabels[stati.bp_status]+', '+String(statusDates.bp_status_date) : 'Not applicable',
          width: 6,
          icon: 'icon-healthcare-assessment',
          translate: stati.bp_status
        });
  
        return fields;
      }
    });
  }

  return cards;
}
  

 
module.exports = {
  getConditionCards,
};
