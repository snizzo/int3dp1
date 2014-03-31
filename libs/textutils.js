/*
 * This function generates text labels to be put in our graph
 */
function getMeshText(text, sizevalue, heightvalue, colorcode)
{
	var textGeo = new THREE.TextGeometry( text, {

		size: sizevalue,
		height: heightvalue,
		curveSegments: 2,

		font: "helvetiker",
		weight: "normal",
		style: "normal",

	});
	var material = new THREE.MeshPhongMaterial({color: colorcode, shading: THREE.SmoothShading});
	var mesh = new THREE.Mesh(textGeo, material);
	
	return mesh;
}
