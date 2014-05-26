function initScene()
{
	scene = new THREE.Scene();
	scene.objlist = [];
	scene.cubes = null;
	scene.counter = 0;
	scene.type = "";
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	//var camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 1, 1000 );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x111111 );
	document.body.appendChild( renderer.domElement );
	
	projector = new THREE.Projector();
	
	//setting lights
	var light1 = new THREE.DirectionalLight( 0xffffff, 1, 50 );
	light1.position.x = 2;
	light1.position.y = 4;
	light1.position.z = 5;
	light1.lookAt( new THREE.Vector3(0,0,0) );
	scene.add( light1 );
	
	var ambient = new THREE.AmbientLight( 0x333333 );
	scene.add( ambient );
	
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	
	controls.zoomSpeed = 0.3;
	controls.rotateSpeed = 0.05;
	controls.minDistance = 2;
	controls.maxDistance = 500;
	
	controls.addEventListener( 'change', render );
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
	
	animate();

}
		
function animate() {
	requestAnimationFrame( animate );
	controls.update();		
	render();
}

function render() {
	if (scene.counter < 1) {
		scene.counter += 0.005;
	}
	if (scene.type == "bar" || scene.type == "area") {
		updateBars(scene.counter);
	}
	if (scene.type == "pie") {
		updateSlices(scene.counter);
	}
	renderer.render(scene, camera);
	stats.update();
}

function updateBars(t) {
	if(scene.cubes!=null){
		scene.cubes.scale.y = t;
	}
}
function updateSlices(t) {
	if(scene.cubes!=null){
		scene.cubes.scale.x = t;
		scene.cubes.scale.y = t;
		scene.cubes.scale.z = t;
	}
}

function clearScene()
{
	$(window).unbind('resize');
	$(document).unbind('mousemove');
	$(document).unbind('mousedown');
	
	for(i=0;i<scene.objlist.length;i++){
		scene.remove(scene.objlist[i]);
	}
	
	scene.objlist = [];
	scene.counter = 0;
}

function setAntialiasing(v)
{
	renderer.antialias = v;
}


function lookAtChart(r, n)
{
	camera.rotation.y = 0;
	camera.rotation.x = 0;
	camera.rotation.z = 0;
	camera.position = new THREE.Vector3(n*8+4, r*8+4, 50);
	camera.lookAt(new THREE.Vector3(0,0,0));
	controls.target = new THREE.Vector3(n*4, 10, r*4);
}

function lookAtPieChart()
{
	camera.position = new THREE.Vector3(0, 1, 3);
	camera.lookAt(new THREE.Vector3(0,0,0));
	controls.target = new THREE.Vector3(0, 0, 0);
}

function barChart(file)
{	
	//object highlight list
	var objects = [];
	//obj labels is a list of all rendered labels for mouse hovering
	var obj_labels = [];
	//last object selected (closest to camera)
	var obj_selected = null;
	
	var r = file["data"].length; //number of rows
	var n = file["data"][0]["floats"].length; //number of bars per row
	
	lookAtChart(r, n);
	
	var maximum = getMaxValue(file);		//maximum value of the bars
	var maxexp = 30;
	var material, geometry, mesh;
	
	scene.type = "bar";
			
	darkgrey = new THREE.MeshPhongMaterial( { ambient: 0x444444, color: 0x444444, specular: 0x444444, shininess:4, shading: THREE.FlatShading, side: THREE.DoubleSide }  );
	lightgrey = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0x555555, shininess:4, shading: THREE.FlatShading, side: THREE.DoubleSide }  );
	
	//draw back panel
	var previous = false;
	for(i=0;i<10;i++){
		var geometry = new THREE.PlaneGeometry( n*8, 3 );
		if(previous==false){
			var mesh = new THREE.Mesh(geometry,darkgrey);
			previous = true;
		} else {
			var mesh = new THREE.Mesh(geometry,lightgrey);
			previous = false;
		}
		mesh.position.y = 1.5+(3*i);
		mesh.position.x += n*4;
		scene.add(mesh);
		scene.objlist.push( mesh );
	}
	
	//draw left panel
	var previous = false;
	for(i=0;i<10;i++){
		var geometry = new THREE.PlaneGeometry( r*8, 3 );
		if(previous==false){
			var mesh = new THREE.Mesh(geometry,darkgrey);
			previous = true;
		} else {
			var mesh = new THREE.Mesh(geometry,lightgrey);
			previous = false;
		}
		mesh.rotation.y = (Math.PI * 90/180);
		mesh.position.y = 1.5+(3*i);
		mesh.position.z += r*4;
		scene.add(mesh);
		scene.objlist.push( mesh );
		
		//add labels for counting efficiently
		var value = (maximum/10)*i;
		var lmesh = getMeshText((Math.round(value*100)/100).toString(), 1.1, 0.15, 0xcccccc, "right");
		lmesh.position.x = -1;
		lmesh.position.y = -0.5+(3*i);
		lmesh.position.z = r*8;
		scene.add( lmesh );
		scene.objlist.push( lmesh );
	}
	
	//draw maximum label
	//add labels for counting efficiently
	var value = maximum;
	var lmesh = getMeshText((Math.round(value*100)/100).toString(), 1.1, 0.15, 0xcccccc, "right");
	lmesh.position.x = -1;
	lmesh.position.y = 29.5;
	lmesh.position.z = r*8;
	scene.add( lmesh );
	scene.objlist.push( lmesh );
	
	var previous = false;
	//draw base
	for (i=0; i<r; i++) {
		for (j=0; j<n; j++) {
			var geometry = new THREE.PlaneGeometry( 8, 8 );
			if(previous==false){
				var mesh = new THREE.Mesh(geometry,lightgrey);
				previous = true;
			} else {
				var mesh = new THREE.Mesh(geometry,darkgrey);
				previous = false;
			}
			mesh.position.x = (j+1)*8-4;
			mesh.position.y = 0;
			mesh.position.z = (i+1)*8-4;
			mesh.rotation.x = Math.PI * 90/180
			scene.add( mesh );
			scene.objlist.push( mesh );
		}
	}
	
	scene.cubes = new THREE.Mesh;
	
	for (i=0; i<r; i++) {
		
		//for first line, add labels
		if(i==(r-1)){
			for (j=0; j<n; j++) {
				var lmesh = getMeshText(file["header"][j], 2, 0.15, 0xcccccc, "right");
				lmesh.position.x = (j+1)*8-4;
				lmesh.position.y = 0;
				lmesh.position.z = (i+1)*8+1;
				lmesh.rotation.z = Math.PI * 90/180;
				lmesh.rotation.x = -(Math.PI * 90/180);
				scene.add( lmesh );
				scene.objlist.push( lmesh );
			}
		}
		
		var lcolors = getRandomColor(i);
		var linecolor = lcolors[0];
		var shinecolor = lcolors[1];
		
		var metalColors = getRandomVec3(i);
		var diffuseColor = metalColors[0];
		var specularColor = metalColors[1];
		
		var uniforms = {
				Ks:	{ type: "v3", value: new THREE.Vector3() },
				Kd:	{ type: "v3", value: new THREE.Vector3() },
				ambient:	{ type: "v3", value: new THREE.Vector3() },
				pointLightPosition:	{ type: "v3", value: new THREE.Vector3() },
				lightPower:	{ type: "v3", value: new THREE.Vector3() },
				s: {type: "f", value: 0},
				m: {type: "f", value: 0}
			};
								
		var vs = document.getElementById("vertex").textContent;
		var fs = document.getElementById("ct-fragment").textContent;
		
		var cubeMaterial = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vs, fragmentShader: fs });
			
		/*light = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
		light.position = new THREE.Vector3( 40.0, 40.0, 40.0 );
		scene.add( light );
		
		pointLight = new THREE.PointLight( 0xffaa00, 2 );
		pointLight.position = new THREE.Vector3( 40.0, 40.0, 40.0 );
		scene.add( pointLight );*/
			
		uniforms.Ks.value = specularColor;//new THREE.Vector3( 0.95, 0.93, 0.88 );
		uniforms.Kd.value = diffuseColor;//(new THREE.Vector3( 0.8,0.8,0.1 ));//( 0.50754, 0.50754, 0.50754 ));
		uniforms.ambient.value = (new THREE.Vector3(0.3,0.3,0.3));//( 0.19225, 0.19225, 0.19225 ));
		uniforms.pointLightPosition.value = new THREE.Vector3( 40.0, 40.0, 40.0 )//(light.position.x, light.position.y, light.position.z);
		uniforms.lightPower.value = new THREE.Vector3( 78000.0, 78000.0, 78000.0 );
		uniforms.s.value = 1;//0.5;
		uniforms.m.value = 1;//0.1;
		
		for (j=0; j<n; j++) {
			addCube ( getNorm(file["data"][i]["floats"][j],maximum,maxexp), linecolor, shinecolor );
			cube.position.x = wcube.position.x = (j+1)*8-4;
			cube.position.y = wcube.position.y = getNorm(file["data"][i]["floats"][j],maximum,maxexp)/2;
			cube.position.z = wcube.position.z = (i+1)*8-4;
			scene.cubes.add( cube );
			//cube.add( wcube );////////////////////////////////////////////////////////// per rimettere il wireframe
			if(j==(n-1)){
				var lmesh = getMeshText(file["data"][i]["label"], 2, 0.15, linecolor, "left");
				lmesh.position.x = (j+1)*8+1;
				lmesh.position.y = 0;
				lmesh.position.z = (i+1)*8-4;
				lmesh.rotation.x = -(Math.PI * 90/180);
				scene.add( lmesh );
				scene.objlist.push( lmesh );
			}
		}
		scene.add( scene.cubes );
		scene.objlist.push( scene.cubes );
	}

	$( window ).bind( "resize", onWindowResize);
	
	//highlights on user input
	$( document ).bind( "mousemove", onDocumentMouseMove);
	
	function addCube ( h,c, sc) {
		var geom = new THREE.CubeGeometry( 4, h, 4 );
		/*cube = new THREE.Mesh( geom, new THREE.MeshPhongMaterial( {
									ambient: c,
									color: c,
									specular: "#ffffff",
									transparent:true,
									opacity:0.5,
									shininess: 2,
									shading: THREE.FlatShading }  )  );*/
		cube = new THREE.Mesh( geom, cubeMaterial );
		
		cube.darkColor = c;
		cube.lightColor = sc;
		wcube = new THREE.BoxHelper( cube );
		wcube.material.color.set( sc );
		
		objects.push(cube);
	}
	
	function onDocumentMouseMove( event ) {

		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( objects );
		
		//if there's at least a collision
		//take closest to camera and 
		if ( intersects.length > 0 ) {
			if(obj_selected != intersects[ 0 ].object){
				//remove last labels
				obj_labels.forEach(function(entry) {
					scene.remove(entry);
				});
				obj_labels = [];
				
				if(obj_selected!=null){
					obj_selected.material.opacity = 0.5;
					obj_selected.material.color.set( obj_selected.darkColor );
				}
				
				//add new
				objectHighlighted(intersects[ 0 ].object);
				obj_selected = intersects[ 0 ].object;
			} else {
				
			}
		} else {
			if(obj_selected!=null){
				obj_selected.material.opacity = 0.5;
				obj_selected.material.color.set( obj_selected.darkColor );
				
			}
			//remove
			obj_labels.forEach(function(entry) { scene.remove(entry); });
			obj_labels = [];
			obj_selected = null;
		}
	}
	
	function objectHighlighted(obj)
	{
		var height = obj.geometry.height;
		var value = getValue(height, maximum, maxexp);
		
		obj.material.color.set( obj.lightColor );
		obj.material.opacity = 0.75;
		
		var lmesh = getMeshText(value.toString(), 2, 0.15, 0xcccccc, "center");
		lmesh.position.x = obj.position.x;
		lmesh.position.y = height+1;
		lmesh.position.z = obj.position.z;
		lmesh.rotation.x = camera.rotation.x;
		lmesh.rotation.y = camera.rotation.y;
		lmesh.rotation.z = camera.rotation.z;
		
		scene.add( lmesh );
		obj_labels.push( lmesh );
		
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( -1000, 0, -2.01 ) );
		geometry.vertices.push( new THREE.Vector3( 1000, 0, -2.01 ) );
		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}) );
		
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( -1000, 0, +2.01 ) );
		geometry.vertices.push( new THREE.Vector3( 1000, 0, +2.01 ) );
		var line2 = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}) );
		
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( -2.01, 0, -1000 ) );
		geometry.vertices.push( new THREE.Vector3( -2.01, 0, 1000 ) );
		var line3 = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}) );
		
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 2.01, 0, -1000 ) );
		geometry.vertices.push( new THREE.Vector3( 2.01, 0, 1000 ) );
		var line4 = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}) );
		
		line.position.z = line2.position.z = line3.position.z = line4.position.z = obj.position.z;
		line.position.x = line2.position.x = line3.position.x = line4.position.x = obj.position.x;
		line.position.y = line2.position.y = line3.position.y = line4.position.y = height;
		
		obj_labels.push( line ); obj_labels.push( line2 ); obj_labels.push( line3 ); obj_labels.push( line4 );
		scene.add( line ); scene.add( line2 ); scene.add( line3 ); scene.add( line4 );
	}
}

function areaChart(file)
{
	//object highlight list
	var objects = [];
	//obj labels is a list of all rendered labels for mouse hovering
	var obj_labels = [];
	//last object selected (closest to camera)
	var obj_selected = null;
	
	var r = file["data"].length; //number of rows
	var n = file["data"][0]["floats"].length; //number of bars per row
	
	lookAtChart(r, n);
	
	scene.type = "area";
	
	//draw ground
	
	var material, geometry, mesh;
	var maximum = getMaxValue(file);
	var maxexp = 30;
	
	darkgrey = new THREE.MeshPhongMaterial( { ambient: 0x444444, color: 0x444444, specular: 0x444444, shininess:4, shading: THREE.FlatShading, side: THREE.DoubleSide }  );
	lightgrey = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0x555555, shininess:4, shading: THREE.FlatShading, side: THREE.DoubleSide }  );
	
	//draw back panel
	var previous = false;
	for(i=0;i<10;i++){
		var geometry = new THREE.PlaneGeometry( n*8, 3 );
		if(previous==false){
			var mesh = new THREE.Mesh(geometry,darkgrey);
			previous = true;
		} else {
			var mesh = new THREE.Mesh(geometry,lightgrey);
			previous = false;
		}
		mesh.position.y = 1.5+(3*i);
		mesh.position.x += n*4;
		scene.add(mesh);
		scene.objlist.push(mesh);
	}
	
	//draw left panel
	var previous = false;
	for(i=0;i<10;i++){
		var geometry = new THREE.PlaneGeometry( r*8, 3 );
		if(previous==false){
			var mesh = new THREE.Mesh(geometry,darkgrey);
			previous = true;
		} else {
			var mesh = new THREE.Mesh(geometry,lightgrey);
			previous = false;
		}
		mesh.rotation.y = (Math.PI * 90/180);
		mesh.position.y = 1.5+(3*i);
		mesh.position.z += r*4;
		scene.add(mesh);
		scene.objlist.push(mesh);
		
		//add labels for counting efficiently
		var value = (maximum/10)*i;
		var lmesh = getMeshText((Math.round(value*100)/100).toString(), 1.1, 0.15, 0xcccccc, "right");
		lmesh.position.x = -1;
		lmesh.position.y = -0.5+(3*i);
		lmesh.position.z = r*8;
		scene.add( lmesh );
		scene.objlist.push(lmesh);
	}
	
	//draw maximum label
	//add labels for counting efficiently
	var value = maximum;
	var lmesh = getMeshText((Math.round(value*100)/100).toString(), 1.1, 0.15, 0xcccccc, "right");
	lmesh.position.x = -1;
	lmesh.position.y = 29.5;
	lmesh.position.z = r*8;
	scene.add( lmesh );
	scene.objlist.push(lmesh);
	
	var previous = false;
	// draw base
	for (i=0; i<r; i++) {
		for (j=0; j<n; j++) {
			var geometry = new THREE.PlaneGeometry( 8, 8 );
			if(previous==false){
				var mesh = new THREE.Mesh(geometry,lightgrey);
				previous = true;
			} else {
				var mesh = new THREE.Mesh(geometry,darkgrey);
				previous = false;
			}
			mesh.position.x = (j+1)*8-4;
			mesh.position.y = 0;
			mesh.position.z = (i+1)*8-4;
			mesh.rotation.x = Math.PI * 90/180
			scene.add( mesh );
			scene.objlist.push(mesh);
		}
	}
	
	// add labels
	scene.cubes = new THREE.Mesh;
	for (i=0; i<r; i++) {
		
		var lcolors = getRandomColor(i);
		var linecolor = lcolors[0];
		var shinecolor = lcolors[1];
		
		var metalColors = getRandomVec3(i);
		var diffuseColor = metalColors[0];
		var specularColor = metalColors[1];
		
		var uniforms = {
				Ks:	{ type: "v3", value: new THREE.Vector3() },
				Kd:	{ type: "v3", value: new THREE.Vector3() },
				ambient:	{ type: "v3", value: new THREE.Vector3() },
				pointLightPosition:	{ type: "v3", value: new THREE.Vector3() },
				lightPower:	{ type: "v3", value: new THREE.Vector3() },
				s: {type: "f", value: 0},
				m: {type: "f", value: 0}
			};
								
		var vs = document.getElementById("vertex").textContent;
		var fs = document.getElementById("ct-fragment").textContent;
		
		var cubeMaterial = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vs, fragmentShader: fs });

		uniforms.Ks.value = specularColor;//new THREE.Vector3( 0.95, 0.93, 0.88 );
		uniforms.Kd.value = diffuseColor;//(new THREE.Vector3( 0.8,0.8,0.1 ));//( 0.50754, 0.50754, 0.50754 ));
		uniforms.ambient.value = (new THREE.Vector3(0.3,0.3,0.3));//( 0.19225, 0.19225, 0.19225 ));
		uniforms.pointLightPosition.value = new THREE.Vector3( 40.0, 40.0, 40.0 )//(light.position.x, light.position.y, light.position.z);
		uniforms.lightPower.value = new THREE.Vector3( 78000.0, 78000.0, 78000.0 );
		uniforms.s.value = 1;//0.5;
		uniforms.m.value = 1;//0.1;
		
		//for first line, add labels
		if(i==(r-1)){
			for (j=0; j<n; j++) {
				var lmesh = getMeshText(file["header"][j], 2, 0.15, 0xcccccc, "right");
				lmesh.position.x = (j+1)*8-4;
				lmesh.position.y = 0;
				lmesh.position.z = (i+1)*8+1;
				lmesh.rotation.z = Math.PI * 90/180;
				lmesh.rotation.x = -(Math.PI * 90/180);
				scene.add( lmesh );
				scene.objlist.push(lmesh);
			}
		}
		
		addShape ( i, linecolor, shinecolor );
		rectMesh.position.x = 4;
		rectMesh.position.z = (i+1)*8-6;
		scene.cubes.add( rectMesh );
		
	}
	scene.add( scene.cubes );
	scene.objlist.push( scene.cubes );
	
	function addShape ( i, c, sc ) {
		var rectShape = new THREE.Shape();
		rectShape.moveTo( 0,0 );
		
		//list keeping in all the pointers of value labels
		var labels = [];
		
		for (j=0; j<n; j++) {
			//calculating normalized height of current chunk
			var height = getNorm(file["data"][i]["floats"][j], maximum, maxexp);
			rectShape.lineTo( j*8, height );
			
			//inserting a label showing value of the current height
			var label = getMeshText(file["data"][i]["floats"][j], 2, 0.15, 0xcccccc, "center");
			label.position.x = j*8+4;
			label.position.y = height+1;
			label.position.z = i*8+3;
			scene.add( label );
			scene.objlist.push(label);
			//setting is to invisible by default
			label.visible = false;
			//adding to label list in order to have it on meshGeom later
			labels.push( label );
			
			//if is writing the last element of a line, write also the line label
			if(j==(n-1)){
				var lmesh = getMeshText(file["data"][i]["label"], 2, 0.15, sc, "left");
				lmesh.position.x = (j+1)*8+1;
				lmesh.position.y = 0;
				lmesh.position.z = (i+1)*8-4;
				lmesh.rotation.x = -(Math.PI * 90/180);
				scene.add( lmesh );
				scene.objlist.push(lmesh);
			}
		}
		rectShape.lineTo( (n-1)*8, 0 );
		rectShape.lineTo( 0, 0 );
		//set settings for the extrusion of the area
		var extrusionSettings = {
			amount: 1, size: 1, height: 0, curveSegments: 10,
			bevelThickness: 0.1, bevelSize: 0.1, bevelEnabled: true,
			material: 0, extrudeMaterial: 5
		};
		
		var rectGeom = new THREE.ExtrudeGeometry( rectShape, extrusionSettings );
		/*rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshPhongMaterial( {
									ambient: c,
									color: c,
									specular: "#ffffff",
									transparent:true,
									opacity:0.5,
									shininess: 2,
									shading: THREE.SmoothShading }  ) );*/
		rectMesh = new THREE.Mesh( rectGeom, cubeMaterial );
		//adding custom props to mesh
		rectMesh.labels = labels;
		rectMesh.darkColor = c;
		rectMesh.lightColor = sc;
		objects.push(rectMesh);
		
	}
	
	//resize render view when window is resized
	// onWindowResize is located in utils.js
	$( window ).bind( "resize", onWindowResize);
	
	//highlights management
	$( document ).bind( "mousemove", onDocumentMouseMove);
	
	function onDocumentMouseMove( event ) {


		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( objects );
		
		//if there's at least a collision
		//take closest to camera and 
		if ( intersects.length > 0 ) {
			if(obj_selected != intersects[ 0 ].object){
				//remove last labels
				obj_labels.forEach(function(entry) {
					scene.remove(entry);
				});
				obj_labels = [];
				
				//hiding old highlighted object's labels
				if(obj_selected != null){
					obj_selected.material.opacity = 0.5;
					obj_selected.material.color.set( obj_selected.darkColor );
					obj_selected.labels.forEach( function (l){
						l.visible = false;
					});
				}
				
				//add new
				objectHighlighted(intersects[ 0 ].object);
				obj_selected = intersects[ 0 ].object;
			} else {
			}
		} else {
			if(obj_selected != null){
				obj_selected.material.opacity = 0.5;
				obj_selected.material.color.set( obj_selected.darkColor );
				obj_selected.labels.forEach( function (l){
					l.visible = false;
				});
			}
			//remove
			obj_labels.forEach(function(entry) { scene.remove(entry); });
			obj_labels = [];
			obj_selected = null;
		}
	}
	
	function objectHighlighted(obj)
	{
		obj.material.color.set( obj.lightColor );
		obj.material.opacity = 0.75;
		obj.labels.forEach( function (l) {
			l.visible = true;
		});
	}
}

function pieChart(file)
{
	//object highlight list
	var objects = [];
	//obj labels is a list of all rendered labels for mouse hovering
	var obj_labels = [];
	//last object selected (closest to camera)
	var obj_selected = null;
	
	lookAtPieChart();
	
	scene.type = "pie";
	
	var n = 1000; // number of points (top circle)
	
	var degrees = 360/n; // degrees per point
	
	var sum = getSum(file);
	
	var l = file["data"][0]["floats"];
	var s = l.reduce(function(prev, cur) { // s = sum of the list elements
		return prev + cur;
	});
	
	var d = [0]; // d = array containing z rotations of the slices
	var c = 0;
	
	for (i=1; i<l.length; i++) {		// compute rotations and add to d
		d.push (c += 360/s*l[i-1]);
	}
	
	scene.cubes = new THREE.Mesh;
	
	for (i=0; i<l.length; i++) {		
		var lcolors = getRandomColor(i);
		var linecolor = lcolors[0];
		var shinecolor = lcolors[1];
		
		var fac = n/s*l[i];
		
		//too small chunks fix
		if(fac < 4.5){
			fac = 4.5;
		}
		
		var value = ((l[i]/sum)*100).toFixed(2)
		
		var mesh = addSlice ( fac, linecolor, shinecolor );
		var pushPoint = getMidSlicePoint(mesh, 0.15);
		var labelPoint = getMidSlicePoint(mesh, 0.65);
		mesh.pushPoint = pushPoint;
		mesh.labelPoint = labelPoint;
		mesh.darkColor = linecolor;
		mesh.lightColor = shinecolor;
		mesh.labelText = file["header"][i]+": "+l[i]+ " ("+value+"%)";
		
		mesh.rotation.z = Math.PI*d[i]/180;
		
		scene.cubes.add( mesh );
		objects.push( mesh );
	}
	
	// get middle point useful for adding labels
	function getMidSlicePoint (mesh, f) {
		var x = f*Math.cos(Math.PI*mesh.degrees/180);
		var y = f*Math.sin(Math.PI*mesh.degrees/180);
		
		return new THREE.Vector3(x,y,0);
	}
	
	scene.add( scene.cubes );
	scene.objlist.push( scene.cubes );
	
	// add slices and wireframe skeleton on the edges
	function addSlice ( n_v, linecolor, shinecolor ) {
		var material, geometry, mesh
		var rectShape = new THREE.Shape();
		
		var lineMaterial = new THREE.LineBasicMaterial({color: shinecolor});
		var lineGeometry = new THREE.Geometry();
		var lineMaterial1 = new THREE.LineBasicMaterial({color: shinecolor});
		var lineGeometry1 = new THREE.Geometry();
		
		// lineGeometry draws the slice, lineGeometry1 draws wireframe
		rectShape.moveTo( 0,0 );
		lineGeometry.vertices.push( new THREE.Vector3( 1, 0, 0.2 ) );
		lineGeometry.vertices.push( new THREE.Vector3( 1, 0, 0 ) );
		lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		lineGeometry1.vertices.push( new THREE.Vector3( 0, 0, 0.2 ) );
		
		// points of the geometries are pushed based on cos and sin functions
		for (j=0; j<n_v-3; j++) {
			var x = Math.cos(Math.PI * (degrees*j/180));
			var y = Math.sin(Math.PI * (degrees*j/180));
			
			rectShape.lineTo ( x, y );
			lineGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
			lineGeometry1.vertices.push( new THREE.Vector3( x, y, 0.2 ) );
		}
		rectShape.lineTo ( 0, 0 );
		
		lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		lineGeometry.vertices.push( new THREE.Vector3( Math.cos(Math.PI * (degrees*(j-1)/180)), Math.sin(Math.PI * (degrees*(j-1)/180)), 0 ) );
		lineGeometry.vertices.push( new THREE.Vector3( Math.cos(Math.PI * (degrees*(j-1)/180)), Math.sin(Math.PI * (degrees*(j-1)/180)), 0.2 ) );
		lineGeometry1.vertices.push( new THREE.Vector3( 0, 0, 0.2 ) );
		
		var extrusionSettings = {
			amount: 0.2, size: 1, height: 100, curveSegments: 3,
			bevelThickness: 0, bevelSize: 0, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};
		var line = new THREE.Line( lineGeometry, lineMaterial );
		var line1	 = new THREE.Line( lineGeometry1, lineMaterial1 );
		
		var rectGeom = new THREE.ExtrudeGeometry( rectShape, extrusionSettings );
		
		var meshGeomShineMaterial = new THREE.MeshPhongMaterial( {
					ambient: linecolor,
					color: linecolor,
					specular: "#ffffff",
					transparent:true,
					opacity:0.85,
					shininess: 2,
					shading: THREE.FlatShading }  );
		
		var meshGeom = new THREE.Mesh( rectGeom, meshGeomShineMaterial );
		if (i==l.length-1) {
			meshGeom.degrees = (360+d[i])/2;
		} else {
			meshGeom.degrees = (d[i+1]+d[i])/2;
		}
		
		meshGeom.add( line );
		meshGeom.add( line1 );
		
		return meshGeom;
	}
	
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	//dynamic resize od viewport
	$( window ).bind( "resize", onWindowResize);
	//highlights
	$( document ).bind( "mousedown", onDocumentMouseMove);
	
	
	function onDocumentMouseMove( event ) {


		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( objects );
		
		//if there's at least a collision
		//take closest to camera and 
		if ( intersects.length > 0 ) {
			if(obj_selected != intersects[ 0 ].object){
				obj_labels.forEach(function(entry) { scene.remove(entry); });
				obj_labels = [];
				//popping in
				if(obj_selected!=null){
					obj_selected.position = new THREE.Vector3(0,0,0);
					obj_selected.material.color.set( obj_selected.darkColor );
					obj_selected.material.opacity = 0.85;
				}
				
				//add new
				objectHighlighted(intersects[ 0 ].object);
				obj_selected = intersects[ 0 ].object;
			} else {
				
			}
		} else {
			if(obj_selected!=null){
				//poppin in
				obj_selected.position = new THREE.Vector3(0,0,0);
				obj_selected.material.color.set( obj_selected.darkColor );
				obj_selected.material.opacity = 0.85;
				
			}
			//remove
			obj_labels.forEach(function(entry) { scene.remove(entry); });
			obj_labels = [];
			obj_selected = null;
		}
	}
	
	function objectHighlighted(obj)
	{
		//popping out slice
		obj.position = obj.pushPoint;
		obj.material.color.set( obj.lightColor );
		obj.material.opacity = 1.0;
		
		var lmesh = getMeshText(obj.labelText, 0.1, 0.015, 0xcccccc, "center");
		lmesh.position = obj.labelPoint;
		lmesh.position.z = 0.3;
		lmesh.rotation.x = Math.PI * 10/180;
		
		scene.add( lmesh );
		scene.objlist.push(lmesh);
		obj_labels.push( lmesh );
	}
}
