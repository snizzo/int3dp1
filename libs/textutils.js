/*
 * This function generates text labels to be put in our graph
 */
function getMeshText(text, sizevalue, heightvalue, colorcode, align, material)
{
	var textGeo = new THREE.TextGeometry( text, {

		size: sizevalue,
		height: heightvalue,
		curveSegments: 2,

		font: "helvetiker",
		weight: "normal",
		style: "normal",

	});
	
	textGeo.computeBoundingSphere();
	var radius = textGeo.boundingSphere.radius;
	if(align==="left"){
		//nothing to do here
	} else if (align==="center"){
		textGeo.applyMatrix( new THREE.Matrix4().makeTranslation(-(radius), 0, 0) );
		textGeo.verticesNeedUpdate = true;
	} else if (align==="right"){
		textGeo.applyMatrix( new THREE.Matrix4().makeTranslation(-(radius*2), 0, 0) );
		textGeo.verticesNeedUpdate = true;
	}
	
	material = material || new THREE.MeshPhongMaterial({color: colorcode, shading: THREE.SmoothShading});
	var mesh = new THREE.Mesh(textGeo, material);
	
	return mesh;
}
