/*
 * This function generates text labels to be put in our graph
 */
function getMeshText(text, sizevalue, colorcode)
{
	var textGeo = new THREE.TextGeometry( text, {

		size: sizevalue,
		height: 0.5,
		curveSegments: 4,

		font: "helvetiker",
		weight: "bold",
		style: "normal",

	});
	var material = new THREE.MeshBasicMaterial({color: colorcode});
	var mesh = new THREE.Mesh(textGeo, material);
	
	return mesh; 
}
