// form fields
const {BP_BMI_FIELD} = require('../data/ENUM');
const {getField} = require('../nools-extras');

// contact fields
const SEX = {
  FEMALE: 'Female',
  MALE: 'Male',
  Other: 'Other',
};


function getSex(num) {
  if (num === '1') {
    return SEX.FEMALE;
  } else if (num === '2') {
    return SEX.MALE;
  } else if (num === '99') {
    return SEX.Other;
  } else {
    return '';
  }
}

/**
   * Sets preloaded variables based on if either of the provided fields are present and valid.
   * Recently updated value has precedence over preloaded one.
   * @param {*} report target report to parse the fields from
   * @param {*} updatedField field of most recently updated value
   * @param {*} preloadedField field of previous preloaded value
   * @returns the correct value to be preloaded in the coming form
   */
function setPreloadedField(updatedField, preloadedField) {
  return updatedField ? updatedField : preloadedField;
}

/*
 *  Safely access JSON properties without propagating an error
 *  Fallback value is empty string
 */
function getJsonField(fn) {
  try {
    const value = fn();
    return value ? value : '';
  } catch (e) {
    return '';
  }
}

function getPreviousReport(reports, mostRecentReport){
  console.log('reports', reports);
  console.log('mostRecentReport', mostRecentReport);
  let previousReport = reports[0];
  reports.forEach(report => {
    if(report.reported_date < mostRecentReport.reported_date && report.reported_date > previousReport.reported_date){
      previousReport = report;
    }
  });
  return previousReport;
}

/*
 *  Calculate client age based on precision options
 */
function calculateAge(contact) {
  let age;
  if (contact.precisiondob === '1') {
    age = contact.dob1;
  }
  else if (contact.precisiondob === '2') {
    age = contact.dob2;
  }
  else {
    age = contact.dob3;
  }
  return (new Date(new Date() - new Date(age)).getFullYear() - 1970);
}

/*
 *  Caculate expiry date (= difference in days between a given date and today's date)
 */
function calculateExpiryDate(expiryDate) {
  if (!expiryDate) {
    return '';
  }
  // date is saved as Unix timestamp, but we want it as date
  const today = todayDate();
  return ((new Date(today) - new Date(expiryDate)) / (1000 * 3600 * 24));
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

function todayDateAtEndOfDay() {
  return new Date(new Date().setHours(23, 59, 59, 999));
}

/*
 *  person-create task logic
 */
const checkAgeforDmFlow = (contact) => {
  const age = calculateAge(contact.contact);

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

  let bmi = 0;
  allReportsSorted.forEach(report => {
    if (report !== undefined && bmi === 0){
      bmi = getField(report, BP_BMI_FIELD);
    }
    
  });

  return (age >= 40 || (bmi > 25 && age > 18));
};

const checkAgeforBpFlow = (contact) => {
  const age = calculateAge(contact.contact);

  if (age !== undefined ) {
    return (age >= 18);
  }
  else {
    console.warn('age is not set for contact', contact);
    return false;
  }
};

/**
 * Verifies if a report is of the given type
 * @param {report} report single report object
 * @param {String} type form name
 * @returns boolean value if the report matches the given type
 */
function isReportOfType(report, type) {
  return report && report.form === type;
}

/**
 * Converts a unix timestamp to date at end of day
 * @param {timestamp} unixTimeStamp date formatted as unix timestamp
 * @returns date at end of day
 */
function dateAtEndOfDay(unixTimeStamp) {
  const dueDate = new Date(unixTimeStamp);
  dueDate.setHours(23, 59, 59, 999);
  return dueDate;
}

/**
 * Adds days to the given date, always returns the time at and of day
 * @param {date} date input date
 * @param {integer} days days to add to input date
 * @returns new date with added days
 */
function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * This is a helper funtion for the cht-test-harness. Takes an array of tasks and checks if they match the given constraints.
 * @param {Array} tasks - The tasks to validate
 * @param {String} id - The valid task's id
 * @param {String} title - The valid task's title
 * @param {String} form - The name of the form that will be used for the valid task
 * @returns {Array} - All tasks that fulfill the conditions
 */
function getValidTasks(tasks, id, title, form) {
  return tasks.filter((task) => {
    const emission = task.emission;
    return emission._id.includes(id) && emission.title === title && emission.actions[0].form === form;
  });
}

function isValidDateFormat(inputDate) {
  // Define a regular expression pattern to match the format YYYY-MM-DD
  const pattern = /^\d{4}-\d{2}-\d{2}$/;

  // Test if the input date matches the pattern
  return pattern.test(inputDate);
}

function formatDateForTwicEnrolDate(inputDate) {
  // Split the input date string into its components
  const dateComponents = inputDate.split('-');

  // Extract day, month, and year from components
  let day = dateComponents[0];
  const monthName = dateComponents[1];
  let year = dateComponents[2];

  // Create a mapping of month names to their numerical equivalents
  const monthNamesMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };

  // Get the numerical month from the map
  let month = monthNamesMap[monthName.substring(0, 3)];

  // Create a new Date object using year, month, and day
  const date = new Date(year, month, day);

  // Get the year, month, and day from the Date object
  year = date.getFullYear();
  month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  day = String(date.getDate()).padStart(2, '0');

  // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

function isValidDateFormatComplex(dateString) {
  // Regular expression to match the specific date format
  const dateFormatRegex = /^[A-Z][a-z]{2} [A-Z][a-z]{2} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \([A-Za-z ]+\)$/;
  
  // Test the date string against the regex
  return dateFormatRegex.test(dateString);
}

function formatDateComplex(inputDate) {
  // Create a new Date object from the input date string
  const date = new Date(inputDate);
  
  // Get the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad it to 2 digits if needed

  // Return the formatted date string
  return `${year}-${month}-${day}`;
}

function convertUnixTimestampToDate(unixTimestamp) {
  // Create a new Date object using the Unix timestamp (in milliseconds)
  const date = new Date(unixTimestamp * 1000);
  
  // Get the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad it to 2 digits if needed

  // Return the formatted date string
  return `${year}-${month}-${day}`;
}

function isValidUnixTimestamp(value) {
  // Check if the value is a number and is an integer
  if (typeof value === 'number' && Number.isInteger(value)) {
    // Define reasonable bounds for Unix timestamps
    // Unix timestamp for January 1, 1970 00:00:00 UTC
    const minTimestamp = 0;
    // Unix timestamp for a far future date (e.g., January 19, 2038 03:14:07 UTC for 32-bit systems)
    const maxTimestamp = 2147483647; // This is for 32-bit systems. You might use a higher value for 64-bit systems.

    // Check if the value falls within the bounds of valid Unix timestamps
    return value >= minTimestamp && value <= maxTimestamp;
  }

  // If the value is not a number or not an integer, it is not a valid Unix timestamp
  return false;
}

module.exports = {
  getSex,
  setPreloadedField,
  getJsonField,
  calculateAge,
  calculateExpiryDate,
  formatDate,
  isValidDateFormat,
  formatDateForTwicEnrolDate,
  todayDate,
  todayDateAtEndOfDay,
  checkAgeforDmFlow,
  checkAgeforBpFlow,
  isReportOfType,
  dateAtEndOfDay,
  addDays,
  getValidTasks,
  getPreviousReport,
  isValidDateFormatComplex,
  isValidUnixTimestamp,
  convertUnixTimestampToDate,
  formatDateComplex
};
