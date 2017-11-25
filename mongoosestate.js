var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/stateDB', { useMongoClient: true });
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;




var countrySchema = new Schema({
	name: String,
	population: Number
});

var Countries = mongoose.model("Countries", countrySchema);





var stateSchema = new Schema({
	name: String,
	code: Number,
	country: Object
});

var States = mongoose.model("States", stateSchema);




function saveCountry(countryName, newPopulation){
	Countries.findOneAndUpdate({name: countryName}, {$set: {population: newPopulation}}, {upsert: true}, function(err, doc){
		if(!err){
			if (doc){
				console.log(countryName+ " exits in db");
				console.log(doc);
			}
			else{
				console.log(countryName+ " added");
				console.log(showInsertedCountry(countryName));
			}
		}
	});
}


/*function saveCountry(countryName, newPopulation){
	Countries.find({name: countryName}, function(err, data){
		if(!err){
			if (data.length){
				return console.log(countryName+ " already exits id DB");
			}
			else{
				console.log("inside save function");
				var newCountry = new Countries({
					name: countryName,
					population: newPopulation
				});

				newCountry.save();
				console.log(countryName +" saved : ");
			}
		}
	})

}*/








function saveState(stateName, stateCode, countryName){
	saveCountry(countryName);

	Countries.find({name: countryName}, function(err, data){
		if(err){
			return console.log(err);
		}
		else{
			let countryId = data[0].id;
			console.log("countryId: ", countryId);


			States.findOneAndUpdate({name: stateName}, {$set: {code: stateCode, country: {_id: ObjectID(countryId), name: countryName}}}, {upsert: true}, function(err, doc){
			if(!err){
				if (doc){
					console.log(stateName+ " exits in db");
					console.log(doc);
				}
				else{
					console.log(stateName+ " added");
					console.log(showInsertedCountry(countryName));
					return showInsertedCountry(countryName);
				}
			}
		});
			}
		});
}


/*function saveState(stateName, stateCode, countryName){
	console.log("before saving state check if country exist in db");

	Countries.find({name: countryName}, function(err, data){
		if (err){
			return console.log("error: ", error);
		}
		else{
			if (data.length){
				console.log(countryName +" exits id DB");
				console.log(data);
				var countryId = data[0]._id;
				var countryNameToSave = data[0].name;
				console.log("country id: ", countryId);
				console.log("countryNameToSave: ", countryNameToSave);

				var newState = new States({
					name: stateName,
					code:stateCode,
					country: {_id: countryId, name: countryNameToSave}
				});

				newState.save();
				console.log(stateName+ " saved: ");
			}
			else{
				console.log(countryName + " doesn't exits");
				console.log("Country doesn't exist saving both county and state");
		
				var newCountry = new Countries({
				name: countryName,
				population: undefined
				});

				newCountry.save(function(err, data){
					if(!err){
						console.log("saved data in new country with state: ", data);
						var countryId = data._id;
						var countryNameToSave = data.name;
						console.log("country Id: ", countryId);
						console.log("now saving in state too");
						var newState = new States({
							name: stateName,
							code:stateCode,
							country: {_id: countryId, name: countryNameToSave}
						});

						newState.save();
						console.log("state saved: ");


					}
				});
				console.log(" inserted country without population: ", showInsertedCountry(countryName));
			}
		}
	});

		
}
*/




function isCountryExist(countryName){
	console.log("checking country exits in database");
	Countries.find({name: countryName}, function(err, data){
		if (err){
			return console.log("error: ", error);
		}
		else{
			if (data.length){
				console.log(countryName +" exits id DB");
				console.log(data);
				return data;
			}
			else{
				console.log(countryName + " doesn't exits");
				return false;
			}
		}
	});

}





function fetchCountryFromState(stateCode){
	console.log("\nfinding country for stateCode "+stateCode);
	States.find({code: stateCode}, function(err, data){
		if(err){
			return	console.log("error: ", err);
		}
		else{
			//
			console.log("\nstateCode: ", +stateCode+ " belongs to state: " +data[0].name);
			country = data[0].country.name;
			Countries.find({name: country}, function(err, countryData){
				if(!err){
					console.log("\ncountry is: ", countryData);

				}
			});
		}
	});
}






function showCountryCollection(){
	Countries.find({}, function(err, data){
		if(!err){
			console.log("Country data: ", data);
		}
	});
	
}






function showInsertedCountry(countryName){
	Countries.find({name: countryName}, function(err, data){
		if (err){
			console.log(err);
		}
		console.log("Country data: ", data);
	});
	
}





function showInsertedState(stateName){
	States.find({name: stateName}, function(err, data){
		if(err){
			return console.log(err);
		}
		console.log("state data : ", data);
	});
	
}


function fetchStateFromCountry(countryName){
	console.log("finding all states of: "+countryName)
	Countries.find({name: countryName}, function(err, data){
		if (err){
			return console.log(err);
		}
		else{
			//console.log(data);
			let countryId = data[0]._id;
			console.log("\ncountryId id to match in state: ", countryId );
			States.find({"country._id": countryId}, function(err, stateData){
				if(!err){
					console.log("\nall states of "+countryName+ " : ");
					console.log(stateData);
				}
			});
		}
	});
}



//saveCountry("India", 9956755);
//showCountryCollection();
//saveCountry("Australia", 325648);
//showCountryCollection();


//isCountryExist("India");
//isCountryExist("UK");

//saveState("Delhi", 11, "India");
//showInsertedState("Delhi");

//saveState("Haryana", 12, "India");
//showInsertedState("Haryana");

//saveState("QueensLand", 56, "Australia");

//saveState("London", 87, "UK");
//showInsertedState("London");
//showInsertedCountry("UK");

//fetchCountryFromState(87);

//saveState("narnia", 100, "JungleBook");
//showInsertedState("narnia");

//saveState("Victoria", 86, "Australia");
//saveState("Punjab", 01, "India");
//saveState("Goa", 01, "India");
//saveState("MP", 03, "India");
//saveState("UP", 04, "India");


//fetchCountryFromState(11);

//fetchStateFromCountry("India");
//fetchStateFromCountry("Australia");

//saveCountry("Spain", 56452);
//saveState("West Bengal", 54, "India");

//saveCountry("France", 1234);
//isCountryExist("India");

//saveState("Paris", 11, "France");
//showInsertedState("Paris");

//saveCountry("Italy", 5679);
//saveCountry("Brasil", 2546);
//saveCountry("Germany", 24567);
//saveCountry("Mexico", 56487);


//saveState("Monaco", 15, "France");