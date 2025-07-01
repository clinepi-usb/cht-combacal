const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;

const {
  setPreloadedField,
  getJsonField,
} = require('../tasks/utils.js');


const {getMostRecentReportAll, getMostRecentReportClientOverview, getField} = require('../nools-extras.js');

const {
  METFIN_STATUS,
  ATORVA_STATUS,
  DM_CONFIRM_FORM,
  DM_SCREENING_FORM,
  MAIN_COHORT_SMOKING_STATUS,
  CORRECTION_FORM
} = require('../data/ENUM.js');


const SEX = {
  FEMALE: 'Female',
  MALE: 'Male',
  Other: 'Other',
};
const mostRecentReport = getMostRecentReportAll(allReports);
//const mostRecentReportNotNewAction = getMostRecentReportNotNewAction(allReports);
const mostRecentReportClientOverview = getMostRecentReportClientOverview(allReports);
//const mostRecentReportDm = getMostRecentReport(allReports, 'dm');


function getSex(num) {
  if (num === '1' || num === 'female') {
    return SEX.FEMALE;
  } else if (num === '2' || num === 'male') {
    return SEX.MALE;
  } else if (num === '99') {
    return SEX.Other;
  } else {
    return '';
  }
}

function getMedicId(contact) {
  return contact.patient_id;
}

function getMetfinStatusUntranslated(contact, mostRecentReport) {
  let metfin_status = '';
  if (!mostRecentReport) {
    metfin_status = getJsonField(() => contact.metfin_status);
  } else if (mostRecentReport.form === DM_SCREENING_FORM) {
    metfin_status = setPreloadedField(
      getJsonField(() => mostRecentReport.fields.t_metfin_status),
      getJsonField(() => contact.metfin_status));
  } else if (mostRecentReport.form === DM_CONFIRM_FORM) {
    metfin_status = getJsonField(() => contact.metfin_status);
  }
  return metfin_status;
}

function getAtorvaStatusUntranslated(contact, mostRecentReport) {
  let atorva_status = '';
  if (!mostRecentReport) {
    atorva_status = getJsonField(() => contact.atorva_status);
  } else if (mostRecentReport.form === DM_SCREENING_FORM) {
    atorva_status = setPreloadedField(
      getJsonField(() => mostRecentReport.fields.t_atorva_status),
      getJsonField(() => contact.atorva_status));
  } else if (mostRecentReport.form === DM_CONFIRM_FORM) {
    atorva_status = getJsonField(() => contact.atorva_status);
  }
  
  return atorva_status;
}

function getWeight(mostRecentReport, mostRecentReportNotNewAction) {
  if (mostRecentReport) {
    const weight = getField(mostRecentReport, 'data._weight');
    if (!weight){
      const t_weight = getField(mostRecentReport, 't_weight');
      if (!t_weight){
        const weightNotNewAction = getField(mostRecentReportNotNewAction, 'data._weight');
        if (!weightNotNewAction){
          const t_weightNotNewAction = getField(mostRecentReportNotNewAction, 't_weight');
          if (!t_weightNotNewAction){
            return 'No Weight found';
          }else{
            return t_weightNotNewAction;
          }
        } else{
          return weightNotNewAction;
        }
      }else{
        return t_weight;
      }
    } else{
      return weight;
    }
  }
  else {
    return 'No weight';
  }
}

function getBMI(mostRecentReport, mostRecentReportNotNewAction) {
  const height = parseFloat(getHeight(mostRecentReport, mostRecentReportNotNewAction));
  const weight = parseFloat(getWeight(mostRecentReport, mostRecentReportNotNewAction));
  console.log('H&W', height, weight);
  const bmi = height && weight && (weight / (Math.pow((height/100), 2))).toFixed(2) || 'Missing data for BMI';
  return bmi;
}

function getHeight(mostRecentReport, mostRecentReportNotNewAction) {
  if (mostRecentReport) {
    if(mostRecentReport.form === CORRECTION_FORM){
      if(getField(mostRecentReport, 'data._variable') === 'height'){
        return getField(mostRecentReport, 'new_nr');
      }
    }
    const height = getField(mostRecentReport, 'data._height');
    if (!height){
      const t_height = getField(mostRecentReport, 't_height');
      if (!t_height){
        const heightNotNewAction = getField(mostRecentReportNotNewAction, 'data._height');
        if (!heightNotNewAction){
          const t_heightNotNewAction = getField(mostRecentReportNotNewAction, 't_height');
          if (!t_heightNotNewAction){
            return 'No Height found';
          }else{
            return t_heightNotNewAction;
          }
        } else{
          return heightNotNewAction;
        }
      }else{
        return t_height;
      }
    } else{
      return height;
    }
  }
  else {
    return 'No height';
  }
}

function getSmokingQuantity(mostRecentReport) {
  let smok_stat = getField(mostRecentReport, MAIN_COHORT_SMOKING_STATUS);
  if (!smok_stat){
    smok_stat = getField(mostRecentReport, 't_smok_stat');
  }
  if (smok_stat === '1') {
    return 'Current Smoker';
  }
  else if (smok_stat === '2') {
    return 'Never Smoker';
  }
  else if (smok_stat === '3') {
    return 'Ex-smoker quit smoking less than 5 years ago';
  }
  else if (smok_stat === '4') {
    return 'Ex-smoker quit smoking 5 years ago or longer ';
  }
  else if (smok_stat === '97') {
    return 'Refused to say';
  }
  else {
    return 'Information not available';
  }
}

function getAge(contact) {
  if (contact.precisiondob === '1') {
    return contact.dob1;
  } else if (contact.precisiondob === '2') {
    return contact.dob2;
  } else if (contact.precisiondob === '3') {
    return contact.dob3;
  }
  return contact.date_of_birth;
}

function getPhoneNumber(contact) {
  if (contact.cell_c === '1') {
    return '+266' + contact.cell_lesotho;
  } else if (contact.cell_c === '2') {
    return '+27' + contact.cell_sa;
  } else {
    return 'No phone number';
  }
}

function getPersonFields() {
  //Creating medhis_fields
  const personFields = [
    {appliesToType: 'person', label: 'Medic ID', value: getMedicId(thisContact), width: 4},
    {appliesToType: 'person', label: 'contact.age', value: getAge(thisContact), width: 4, filter: 'age'},
    {appliesToType: 'person', label: 'contact.sex', value: getSex(thisContact.sex), width: 4},
    {appliesToType: 'person', label: 'Weight', value: getWeight(mostRecentReport, mostRecentReportClientOverview), width: 4},
    {appliesToType: 'person', label: 'Height', value: getHeight(mostRecentReport, mostRecentReportClientOverview), width: 4},
    {appliesToType: 'person', label: 'BMI', value: getBMI(mostRecentReport, mostRecentReportClientOverview), width: 4},
    {appliesToType: 'person', label: 'person.field.phone', value: getPhoneNumber(thisContact), width: 4},
    // Belongs to
    {appliesToType: 'person', label: 'contact.parent', value: thisLineage, filter: 'lineage'},
    {appliesToType: 'person', label: 'Smoking', value: getSmokingQuantity(mostRecentReportClientOverview), width: 4},
  ];

  
  if (getMetfinStatusUntranslated(thisContact, mostRecentReport) === METFIN_STATUS.UPDOSING || getMetfinStatusUntranslated(thisContact, mostRecentReport) === METFIN_STATUS.STARTED || getMetfinStatusUntranslated(thisContact, mostRecentReport) === METFIN_STATUS.ACTIVE) {
    personFields.push({appliesToType: 'person', label: 'Current medication', value: 'Metformin', width: 4});
  }
  if (getAtorvaStatusUntranslated(thisContact, mostRecentReport) === ATORVA_STATUS.UPDOSING || getAtorvaStatusUntranslated(thisContact, mostRecentReport) === ATORVA_STATUS.STARTED || getAtorvaStatusUntranslated(thisContact, mostRecentReport) === ATORVA_STATUS.ACTIVE) {
    personFields.push({appliesToType: 'person', label: 'Current medication', value: 'Atorvastatin', width: 4});
  }

  if (thisContact.short_name) {
    personFields.unshift({
      appliesToType: 'person',
      label: 'contact.short_name',
      value: thisContact.short_name,
      width: 4
    });
  }
  
  //returning created fields
  return personFields;
}

module.exports = {
  getPersonFields,
};
