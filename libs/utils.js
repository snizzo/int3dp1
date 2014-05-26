
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
	var metals = [];
	metals.push(new THREE.Vector3(0.8,0.8,0.1));
	metals.push(new THREE.Vector3(0.6,0.6,0.6));
	metals.push(new THREE.Vector3(0.85,0.3,0.1));
	
	var r = i % metals.length;
	var result = metals[r];

	return result;
}


function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
