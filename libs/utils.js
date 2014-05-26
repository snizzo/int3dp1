
function getRandomColor(i) {
	var colors = [];
	var lcolors = [];

	//default good colors
	colors.push("#DBDB00");
	colors.push("#54DB00");
	colors.push("#00DBD8");
	colors.push("#0045DB");
	colors.push("#CF007F");
	colors.push("#DB7700");


	//default +30% brighter good colors
	lcolors.push("#ffff00"); 
	lcolors.push("#6dff00"); 
	lcolors.push("#00ffff"); 
	lcolors.push("#005aff"); 
	lcolors.push("#ff00a5");
	lcolors.push("#ff9b00"); 


	//choose one based on a seed
	var r = i % colors.length;

	var results = [];
	results.push(colors[r]);
	results.push(lcolors[r]);

	return results;
}

function getRandomVec3(i) {
	var dmetals = [];
	dmetals.push(new THREE.Vector3(0.66,0.6,0.266666));
	dmetals.push(new THREE.Vector3(0.5089,0.5089,0.5089));
	dmetals.push(new THREE.Vector3(1.03868055,0.2472148,0.2472148));
	
	var smetals = [];
	smetals.push(new THREE.Vector3(0.733333,0.6666666,0.6));
	smetals.push(new THREE.Vector3(0.6666,0.6666,0.6666));
	smetals.push(new THREE.Vector3(1.399995,0.6,0));
	
	var r = i % dmetals.length;
	var results = [];
	results.push(dmetals[r]);
	results.push(smetals[r]);

	return results;
}


function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
