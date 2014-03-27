
/*
 * This function takes a CSV file as input and returns an associative array.
 * Example structure of the array returned:
 * 
 * ["header": ["one","two","three"],
 *  "data": [
 * 				[1,2,3]
 * 				[4,5,6]
 * 				[7,8,9]
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
		var floats = [];
		entry.split(",").forEach(function(entry2) {
			floats.push(parseFloat(entry2));
		});
		data.push(floats);
	});
	
	//building final array
	var out = [];
	out["header"] = header.split(",");
	out["data"] = data;
	
	return out;
}
