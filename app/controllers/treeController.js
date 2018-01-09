const fs = require('fs');



export.list = (req, res) => {
	const jsonFile = JSON.parse(fs.readFileSync('../data/arbres-d-alignement.json', 'utf8', (err, data) => {
		data = JSON.parse(data);	
	}));
}

//		for (var i = 0; i < data.length; i++) {
//			let tree = {
//				lat: data[i].geometry.coordinates[0],
//				lng: data[i].geometry.coordinates[1]
//			};
//			let marker = new google.maps.Marker({
//				position: uluru,
//				map: document.getElementById('map');
//			});
//		}

//fs.readFile('./people.json', 'utf8', function (err,data) {
//  data = JSON.parse(data); // you missed that...
//  for(var i = 0; i < data.length; i++) {
//    var newPerson = new Person();
//    newPerson.firstname = data[i].firstname;
//    newPerson.lastname = data[i].lastname;
//    newPerson.age = data[i].age;
//    newPerson.save(function (err) {});
//  }
//});
