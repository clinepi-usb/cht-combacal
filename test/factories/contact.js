function contact(listOfReports) {

  const contact = {
    contact: {
      age: '82',
      amlo_status: '',
      atorva_status:'active',
      dob3: '1940-01-01',
      first_name: 'test',
      last_name: 'user',
      medhis: {
        bmi: '35.6',
        height: '150',
        smoking_status: '2',
        weight: '80',
        dm_med: {
          dose_metfin: '1700'
        }
      },
      metfin_status: 'active',
      precisiondob: '3',
      //1= Female, 2= Male, 3 = Other
      sex: '2'
    },
    reports: []
  };
  contact.reports = listOfReports;
  return contact;
}

module.exports = {
  contact
};
