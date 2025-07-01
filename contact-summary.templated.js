const extras = require('./contact-summary-extras');
const { getPersonFields } = require('./client-overview/clientOverview');
const { getConditionCards } = require('./client-overview/conditionCards');
const { getJsonField, setPreloadedField } = require('./tasks/utils');
const { DM_DX_STATUS } = require('./data/ENUM');

const { isAlive, isReadyForNewPregnancy, isReadyForDelivery } = extras;




//contact, reports, lineage are globally available for contact-summary
const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;


const context = {
  alive: isAlive(thisContact),
  muted: false,
  show_pregnancy_form: isReadyForNewPregnancy(thisContact, allReports),
  show_delivery_form: isReadyForDelivery(thisContact, allReports),
};


/**
 * Takes a village contact object as input an maps it's cluster_trial_arm value according to the TRIAL_ARM constant.
 * @param village The contact object
 * @return {string} - The mapped trial arm or an error message
 */

/*
function getClusterTrialArm(village) {
  if (!village.cluster_trial_arm) {
    return 'No trial arm found on village';
  }


  const trial_arm = TRIAL_ARM[village.cluster_trial_arm];
  if (trial_arm) {
    return trial_arm;
  }
  return `Invalid trial arm: ${village.cluster_trial_arm}`;
}
*/



function getActiveAdults() {
  // Reverse the allReports array to process from newest to oldest
  const sortedReports = [...allReports].sort((a, b) => b.reported_date - a.reported_date);

  // Map to store unique active adults with their statuses
  const activeAdults = new Map();

  // Process each report and collect data
  for (const report of sortedReports) {
    try {
      // Get the contact UUID and ensure it's valid
      const uuid = report.fields.patient_uuid;
      if (!uuid) {
        continue;
      }

      // Initialize or update the adult's status
      if (!activeAdults.has(uuid)) {
        activeAdults.set(uuid, {
          uuid: uuid,
          sex: null,
          hypertensionStatus: 'Not applicable',
          hypertensionTreatmentStatus: 'Not applicable',
          diabetesStatus: 'Not applicable',
          diabetesTreatmentStatus: 'Not applicable',
          gaveConset: false,
          bg_status: 'Not applicable',
          hiv_stat: 'Not applicable',
          date_deactivation: null,
          smok_stat: 'Not applicable',
          age: null,
          bp_status: 'Not applicable',
          date_reactivation: null,
          baseline: false,
        });
      }

      const adult = activeAdults.get(uuid);

      // Update baseline status
      if (report.form === 'cohort_bsl') {
        adult.baseline = true;
      }

      // Update hypertension status if available
      let field = '_aht_dxs';
      const aht_dxs = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );

      if (aht_dxs && adult.hypertensionStatus === 'Not applicable') {
        adult.hypertensionStatus = aht_dxs;
      }

      // Update diabetes status if available
      field = '_dm_dxs';
      const dmStatus = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (dmStatus && adult.diabetesStatus === 'Not applicable') {
        adult.diabetesStatus = dmStatus;
      }

      // Update consent status if available
      const consentStatus = getJsonField(() => report.fields.econsent_confirm);
      if (consentStatus && !adult.gaveConset) {
        adult.gaveConset = consentStatus;
      }

      // Update bg_status status if available
      field = '_bg_status';
      const bgStatus = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (bgStatus && adult.bg_status === 'Not applicable') {
        adult.bg_status = bgStatus;
      }

      // Update hiv_stat status if available
      field = '_hiv_stat';
      const hivStat = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (hivStat && adult.hiv_stat === 'Not applicable') {
        adult.hiv_stat = hivStat;
      }

      // Update sex
      const sex = getJsonField(() => report.fields.sex);
      if (sex && !adult.sex) {
        adult.sex = sex;
      }

      // Update aht_txs status if available
      field = '_aht_txs';
      const ahtTxs = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (ahtTxs && adult.hypertensionTreatmentStatus === 'Not applicable') {
        adult.hypertensionTreatmentStatus = ahtTxs;
      }

      // Update dm_txs status if available
      field = '_dm_txs';
      const dmTxs = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (dmTxs && adult.diabetesTreatmentStatus === 'Not applicable') {
        adult.diabetesTreatmentStatus = dmTxs;
      }

      // Update age
      const age = getJsonField(() => report.fields.age);
      if (age && !adult.age) {
        adult.age = age;
      }

      // Update smok_stat
      field = '_smok_stat';
      const smokStat = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (smokStat && adult.smok_stat === 'Not applicable') {
        adult.smok_stat = smokStat;
      }

      // Update bp_status
      field = '_bp_status';
      const bpStatus = setPreloadedField(
        getJsonField(() => report.fields.data[field]),  // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );
      if (bpStatus && adult.bp_status === 'Not applicable') {
        adult.bp_status = bpStatus;
      }

      // Check if reactivated
      field = '__confirm_undo';
      let confirmUndo = getJsonField(() => report.fields.data[field]);
      if (confirmUndo === 'yes') {
        const dateReactivation = new Date(report.reported_date);
        if (!isNaN(dateReactivation.getTime())) { // Ensure it's a valid date
          adult.date_reactivation = dateReactivation.toISOString(); // Store full ISO string including time
          confirmUndo = 'no';
        }
      }

      // Update date_deactivation
      field = '__date_deactivation';
      let dateDeactivation = setPreloadedField(
        getJsonField(() => report.fields.data[field]), // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );

      field = '__reason_dropout';
      const reasonDropout = setPreloadedField(
        getJsonField(() => report.fields.data[field]), // Primary field value
        getJsonField(() => report.fields[`t${field}`]) // Secondary field value
      );

      // Validate inputs
      const isValidDate = (date) => date && !isNaN(new Date(date).getTime());
      const isValidString = (str) => str && str.trim() !== '';

      // Debug logs
      /*
      console.log('dateDeactivation:', dateDeactivation);
      console.log('reasonDropout:', reasonDropout);
      */

      if (!isValidDate(dateDeactivation) && isValidString(reasonDropout)) {
        // Assign new deactivation date based on reported_date
        dateDeactivation = new Date(report.reported_date);

        if (!isNaN(dateDeactivation.getTime())) {
          adult.date_deactivation = dateDeactivation.toISOString();
        } else {
          console.warn(`Invalid reported_date in report:`, report);
        }
      } else if (isValidDate(dateDeactivation)) {
        // Assign valid existing deactivation date
        adult.date_deactivation = new Date(dateDeactivation).toISOString();
      } else {
        console.warn(`No valid dateDeactivation or reasonDropout found in report:`, report);
      }

    } catch (error) {
      console.error('Error processing report for adult:', error);
    }
  }

  // Convert the map to an array of active adults
  const activeAdultsList = Array.from(activeAdults.values());
  return activeAdultsList;
}

const activeAdults = getActiveAdults();

console.log('Active adults:', activeAdults);
/*
console.log('allReports:', allReports);
console.log('thisContact:', thisContact);
*/

const numberCohortBslPending = activeAdults.filter(adult =>
  adult.baseline === false &&
    (
      adult.date_deactivation === null ||
      new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
    )
).length;

// Count adults with age >= 18 and gave consent
const numberOfActiveAdults = activeAdults.filter(adult =>
  adult.age >= 18 &&
  adult.gaveConset === '1' &&
  (
    adult.date_deactivation === null ||
    new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
  )
).length;

// Count minors with age < 18 and gave consent
const numberOfActiveMinors = activeAdults.filter(adult =>
  adult.age < 18 &&
  adult.gaveConset === '1' &&
  (
    adult.date_deactivation === null ||
    new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
  )
).length;

// Count people with diabetes
const numberOfDiabetes = activeAdults.filter(adult =>
  adult.diabetesStatus === DM_DX_STATUS.DIAGNOSED &&
  (
    adult.date_deactivation === null ||
    new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
  )
).length;

// Count people with hypertension
const numberOfHypertension = activeAdults.filter(adult =>
  adult.hypertensionStatus === 'diagnosed' &&
  (
    adult.date_deactivation === null ||
    new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
  )
).length;

// Count people with HIV positive status
const numberOfHivStat = activeAdults.filter(adult =>
  adult.hiv_stat === '1' &&
  (
    adult.date_deactivation === null ||
    new Date(adult.date_deactivation).getTime() < new Date(adult.date_reactivation).getTime()
  )
).length;

// Count deactivated people
const numberOfDeactivated = activeAdults.filter(adult =>
  adult.date_deactivation !== null &&
  new Date(adult.date_deactivation).getTime() > new Date(adult.date_reactivation).getTime()
).length;






const notPersonFields = [
  //{ appliesToType: '!person', label: 'contact.parent', value: thisLineage, filter: 'lineage' },
  //{ appliesToType: 'person', label: 'contact.relocation', value: thisContact.date_of_relocation, filter: 'lineage' },
  //{ appliesToType: '!person' && '!household', label: 'contact', value: thisContact.contact && thisContact.contact.name, width: 4 },
  //{ appliesToType: '!person', label: 'contact.phone', value: thisContact.contact && thisContact.contact.phone, width: 4 },
  //{ appliesToType: 'village', label: 'contact.type.village.trial_arm', value: thisContact.twic_arm, width: 4},

 
  //Belongs To (village)
  { appliesToType: '!person', appliesIf: function () { return thisContact.parent && thisLineage[0]; }, label: 'contact.parent', value: thisLineage, filter: 'lineage' },

  { appliesToType: 'village', label: 'contact.type.village.trial_arm', value: thisContact.twic_arm, width: 4 },

  // "Number of Active Adults" (participants with consent, active, and aged 18 or older)
  { appliesToType: 'household', appliesIf: function () { return numberOfActiveAdults !== 0; }, label: 'Active Adults (18 or older)', value: numberOfActiveAdults, width: 6 },

  // "Number of Active Minors" (participants with consent, active, and aged 17 or younger)
  { appliesToType: 'household', appliesIf: function () { return numberOfActiveMinors !== 0; }, label: 'Active Minors (17 or younger)', value: numberOfActiveMinors, width: 6 },

  // "Number of Cohort BSL Pending" (participants without a baseline form)
  { appliesToType: 'household', appliesIf: function () { return numberCohortBslPending !== 0; }, label: 'People with Cohort BSL Pending', value: numberCohortBslPending, width: 6 },

  // "Number of People with Diabetes" (participants with dm_dxs=diagnosed in last submitted dm_int or dm_cont form)
  { appliesToType: 'household', appliesIf: function () { return numberOfDiabetes !== 0; }, label: 'People with Diabetes', value: numberOfDiabetes, width: 6 },

  // "Number of People with Hypertension" (participants with aht_dxs=diagnosed in last submitted bp_int or bp_cont form)
  { appliesToType: 'household', appliesIf: function () { return numberOfHypertension !== 0; }, label: 'People with Hypertension', value: numberOfHypertension, width: 6 },

  // "Number of People with HIV Positive" (participants with hiv_stat=1 in last submitted hiv_int or hiv_cont form)
  { appliesToType: 'household', appliesIf: function () { return numberOfHivStat !== 0; }, label: 'People with HIV', value: numberOfHivStat, width: 6 },

  // "Number of Deactivated People" (participants with date_deactivation in last submitted form)
  { appliesToType: 'household', appliesIf: function () { return numberOfDeactivated !== 0; }, label: 'Deactivated People', value: numberOfDeactivated, width: 6 },
];


module.exports = {
  context: context,
  cards: getConditionCards(),
  fields: getPersonFields().concat(notPersonFields)
};


