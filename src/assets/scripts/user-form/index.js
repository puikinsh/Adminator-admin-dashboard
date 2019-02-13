import * as $ from 'jquery';

const schemeJson = [
    {name: "full_name", type: "text", required: true, label: "Full name" },
    {name: "dob", type: "date", required: true, label: "Date of Birth" },
    {name: "arrived", type: "date", required: true, label: "Arrived in Australia" }, 
    {name: "visa", type: "dropdown", required: true, label: "Visa Type", 
      dropdown: [ 
        {
          id: 0, 
          name: "417 Working Holiday 1st yr"
        }, 
        {
          id: 1, 
          name: "417 Working Holiday 2nd yr"
        }, 
        {
          id: 2,
          name: "417 Working Holiday 3rd yr"
        },
        { 
          id: 3,
          name: "462 Work and Holiday"
        }, 
        {
          id: 4,
          name: "600 Student"
        }
      ] 
    },
    {name: "skills", type: "tags", required: true, label: "Skills" },
];
let formHtml = '';
for (let key in schemeJson) {
    let field = schemeJson[key];
    let visas = field.dropdown;
    
    switch(field.type){
      case 'text':
        formHtml += `
          <div class="form-group">
            <label for="${field.name}" class="bmd-label-floating">${field.label}</label>
            <input type="${field.type}" class="form-control" name="${field.name}">
          </div>
        `;
        break;
      case 'dropdown':
        formHtml += `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <select id="${field.name}" class="form-control">
              <option selected>Choose...</option>
              ${ visas.map(visa => `
                <option>${visa.name}</option>
              `)}
            </select>
          </div>
        `;
        break;
      case 'date':
        formHtml += `
          <div class="form-group">
            <label for="${field.name}" class="bmd-label-floating">${field.label}</label>
            <input type="text" id="date-${field.name}" class="form-control datepicker" name="${field.name}">
          </div>
        `;
      break;
    }
}

formHtml += `<button type="submit" class="btn btn-primary">Submit</button>`;
$('#user-form').html(formHtml);

$('#date-dob').datepicker({
  format: 'mm/dd/yyyy',
  endDate: '-18y'
});

$('#date-arrived').datepicker({
  format: 'mm/dd/yyyy',
    endDate: '0d'
});
