const chai = require('chai');
const utils = require('../tasks/utils');

const expect = chai.expect;

// test objects (relevant field: trial_arm)
const testInterventionReport = {
  'form': 'dm_screening',
  'type': 'data_record',
  'content_type': 'xml',
  'reported_date': 1647879657441,
  'contact': {
    '_id': '4e8b4bb3-70f4-4b25-885e-907fc3ed2e2d',
    'parent': {
      '_id': '5835d368-c750-47aa-ad07-0d313de68e56',
      'parent': {
        '_id': 'd1e15222-18d9-4806-b2d3-3232faf66c48',
        'parent': {
          '_id': 'cb8b6210-1a7b-4a5e-a397-e89e9ea45dfe'
        }
      }
    }
  },
  'from': '',
  'hidden_fields': [
    'meta'
  ],
  '_attachments': {
    'content': {
      'content_type': 'application/xml',
      'digest': 'md5-rOMbTcuvQ6dVSTM3wcnrLQ==',
      'length': 3740,
      'revpos': 1,
      'stub': true
    }
  },
  'fields': {
    'inputs': {
      'source': 'task',
      'source_id': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
      'task_id': '',
      'contact': {
        '_id': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
        'patient_id': '71535',
        'name': 'Guy Bom',
        'parent': {
          '_id': '3d3a039d-08fe-4407-8595-511febed595f',
          'name': "Udu's Household",
          'address': '',
          'parent': {
            '_id': '5835d368-c750-47aa-ad07-0d313de68e56',
            'name': 'Macheseng/Ha Lechesa',
            'contact_type': 'village',
            'address': '',
            'cluster_trial_arm': '1'
          }
        }
      }
    },
    'patient_uuid': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
    'patient_id': '71535',
    'patient_name': 'Guy Bom',
    'trial_arm': '1',
    'meta': {
      'instanceID': 'uuid:1ec404e5-9ee7-4be3-b1dd-31fc8d9b50d5'
    }
  },
  '_id': '73af4945-66b1-4424-841d-8d8a3eafe1f9',
  '_rev': '1-8e6fe18c02c582514b780a91f5db930e'
};
const testControlReport = {
  'form': 'dm_screening',
  'type': 'data_record',
  'content_type': 'xml',
  'reported_date': 1647879657441,
  'contact': {
    '_id': '4e8b4bb3-70f4-4b25-885e-907fc3ed2e2d',
    'parent': {
      '_id': '5835d368-c750-47aa-ad07-0d313de68e56',
      'parent': {
        '_id': 'd1e15222-18d9-4806-b2d3-3232faf66c48',
        'parent': {
          '_id': 'cb8b6210-1a7b-4a5e-a397-e89e9ea45dfe'
        }
      }
    }
  },
  'from': '',
  'hidden_fields': [
    'meta'
  ],
  '_attachments': {
    'content': {
      'content_type': 'application/xml',
      'digest': 'md5-rOMbTcuvQ6dVSTM3wcnrLQ==',
      'length': 3740,
      'revpos': 1,
      'stub': true
    }
  },
  'fields': {
    'inputs': {
      'source': 'task',
      'source_id': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
      'task_id': '',
      'contact': {
        '_id': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
        'patient_id': '71535',
        'name': 'Guy Bom',
        'parent': {
          '_id': '3d3a039d-08fe-4407-8595-511febed595f',
          'name': "Udu's Household",
          'address': '',
          'parent': {
            '_id': '5835d368-c750-47aa-ad07-0d313de68e56',
            'name': 'Macheseng/Ha Lechesa',
            'contact_type': 'village',
            'address': '',
            'trial_arm': '2'
          }
        }
      }
    },
    'patient_uuid': 'edc8f3bd-023b-43e0-9a4d-4a55a32a8ffa',
    'patient_id': '71535',
    'patient_name': 'Guy Bom',
    'trial_arm': '2',
    'meta': {
      'instanceID': 'uuid:1ec404e5-9ee7-4be3-b1dd-31fc8d9b50d5'
    }
  },
  '_id': '73af4945-66b1-4424-841d-8d8a3eafe1f9',
  '_rev': '1-8e6fe18c02c582514b780a91f5db930e'
};
