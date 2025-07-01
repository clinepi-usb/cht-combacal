const dmConfirmInputs = [
  [2], // medical complaint (no)
  [1], // equipment ready
  [1], // participant ready
  [2], // no food or drinks
  [14],// blood sugar value = diabetes
  ['OK'], // OK
  [1], // higher urine volumes (yes)
  [1], // excessive thirst (yes)
  [1], // lost weight (yes)
  [1], // urine dip sticks (yes)
  [1], // urine sample obtained (yes)
  [5], // ketone level (large)
  [1], // DBS equipment (yes)
  [1], // DBS obtained (yes)
  [2], // patient agrees to health center (no)
  [1]  // no money
];

const dmFollowupIntForm = [
  [2],    // Does the participant currently have any medical complaint?
  [0],    // days per week
  [0],    // days per week
  ['OK'], // confirm
  [2],    // no metformin available
  [1],    // yes, dbs equipment ready
  [1]     // dbs was obtained
];
const dmScreeningInputs = [
  [2], // medical complaint (no)
  [1], // equipment ready
  [1], // participant ready
  [2], // no food or drinks
  [14],// blood sugar value = diabetes
  ['OK'], // OK
  [1], // higher urine volumes (yes)
  [1], // excessive thirst (yes)
  [1], // lost weight (yes)
  [1], // urine dip sticks (yes)
  [1], // urine sample obtained (yes)
  [5], // ketone level (large)
  [1], // DBS equipment (yes)
  [1], // DBS obtained (yes)
  [2], // patient agrees to health center (no)
  [1]  // no money
];

const dmUpdosingInput = [
  [2],      // no warning symptoms
  ['OK'],   // confirm lifestyle explained
  //[2],      // not pregnant
  [1],      // metformin is available
  //[4],      // no contraindication_metfin
  //[8],      // no metfine sideeffects
  //[2],      //Since the last visit: Have you ever forgotten to take the Metformin tablets?
  //[2],      //Since the last visit: Have you ever had problems remembering to take the Metformin tablets?
  //[2],      //Since the last visit: When you feel better, do you sometimes stop taking the Meformin tablets?
  //[2],      //Since the last visit: Sometimes, if you feel worse when you take the Metformin tablets, do you stop taking them?
  //[1],      //Is the participant ready to start or continue with Metformin?
  //['850mg once daily'], //Select the current dose of Metformin that you give to your participant today
  [1],      // atorvastatin is available
  //['OK'],      // Confirm that you have told the participant all relevant informatio
  //[1]       // Is the participant ready to start or continue Atorvastatin
];

module.exports = {
  dmConfirmInputs,
  dmFollowupIntForm,
  dmScreeningInputs,
  dmUpdosingInput,
};
