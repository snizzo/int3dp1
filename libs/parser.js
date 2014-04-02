
/*
 * This function takes a CSV file as input and returns an associative array.
 * Example structure of the array returned:
 * 
 * ["header": ["one","two","three"],
 *  "data": [
 * 					["label": "ab",
 * 				 	 "floats": ["1,2,3]]
 * 					["label": "cd",
 * 				 	 "floats": ["2,5,7]]
 * 					["label": "ef",
 * 				 	 "floats": ["9,4,3]]
 * 			]
 * ]
 * 
 */
function fromCsvToAssociative(csv)
{
	//splitting file in lines
	var lines = csv.split("\n");
	
	//setting correct csv header
	var header = lines[0];
	
	//setting new list data empty
	var data = [];
	
	//removing header from lines
	lines.shift();
	//pushing every data line to data var
	lines.forEach(function(entry) {
		var lineData = [];
		var floats = [];
		
		var splits = entry.split(",");
		lineData["label"] = splits[0];
		splits.shift();
		
		splits.forEach(function(entry2) {
			floats.push(parseFloat(entry2));
		});
		
		lineData["floats"] = floats;
		data.push(lineData);
	});
	
	//building final array
	var out = [];
	var head = header.split(",");
	head.shift();
	out["header"] = head;
	out["data"] = data;
	
	return out;
}

function getMaxValue(arr)
{
	var allvalues = [];
	arr["data"].forEach(function(entry) {
		//console.log(entry["label"]);
		//console.log(entry["floats"]);
		
		entry["floats"].forEach(function(f_entry) {
			allvalues.push( f_entry );
		});
		
	});
	
	return Math.max.apply(Math,allvalues);
}

function getNorm(h,max,maxexp)
{
	var f = max/maxexp;
	return h/f;
}

function getSum(file)
{
	var sum = 0;
	file["data"][0]["floats"].forEach(function(data) {;
		sum += data;
	});
	
	return sum;
}

function getValue(h,max,maxexp)
{
	var f = max/maxexp;
	return h*f;
}
