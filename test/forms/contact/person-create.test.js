const {expect} = require('chai');
const Harness = require('cht-conf-test-harness');
const harness = new Harness({verbose: false, appSettingsPath: './app_settings.json', args: ['--no-sandbox', '--disable-setuid-sandbox']});
const {CONTACT_SEX_FIELD} = require('../../../data/ENUM');
const {getContactField} = require('../../../nools-extras');

const CONTACT_TYPE_PERSON = 'person';
const personCreateInputs = [
  ['2022-02-02'],           // consent date
  [1],                      // consent obtained
  [1],                      // consent obtained twice?
  ['Sergej'],               // first name
  ['Fährlich'],             // last name
  [1],                      // date of birth format
  ['1999-12-31'],           // date of birth
  [2],                      // male
  [2]                       // cellphone number not available
];

describe('person-create form tests', function() {
  this.timeout(5000);
  before(async function() {
    return harness.start();
  });
  after(async function() {
    return await harness.stop();
  });
  beforeEach(async function() {
    return await harness.clear();
  });
  afterEach(function() {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('form can be loaded', async function() {
    await harness.fillContactForm(CONTACT_TYPE_PERSON);
    expect(harness.state.pageContent).to.include(CONTACT_TYPE_PERSON);
  });
  describe('evaluating coupled fields', function() {
    it('sex field', async function() {
      const result = await harness.fillContactForm(CONTACT_TYPE_PERSON, personCreateInputs);
      const contact = result.contacts[0];
      expect(getContactField(contact, CONTACT_SEX_FIELD)).to.not.be.undefined;
    });
  });
});
