var otherPlayers = {};

var playerID;
var player;

function loadGame() {
	// load the environment
	loadEnvironment();
	// load the player
	initMainPlayer();

	listenToOtherPlayers();

	window.onunload = function() {
		fbRef.child( "Players/" + playerID ).remove();
	};

	window.onbeforeunload = function() {
		fbRef.child( "Players/" + playerID ).remove();
	};
}

function listenToPlayer( playerData ) {
	if ( playerData.val() ) {
		otherPlayers[playerData.key].setOrientation( playerData.val().orientation.position, playerData.val().orientation.rotation );
	}
}

function listenToOtherPlayers() {
	// when a player is added, do something
	fbRef.child( "Players" ).on( "child_added", function( playerData ) {
		if ( playerData.val() ) {
			if ( playerID != playerData.key && !otherPlayers[playerData.key] ) {
				otherPlayers[playerData.key] = new Player( playerData.key );
				otherPlayers[playerData.key].init();
				fbRef.child( "Players/" + playerData.key ).on( "value", listenToPlayer );
			}
		}
	});

	// when a player is removed, do something

	fbRef.child( "Players" ).on( "child_removed", function( playerData ) {
		if ( playerData.val() ) {
			fbRef.child( "Players/" + playerData.key ).off( "value", listenToPlayer );
			scene.remove( otherPlayers[playerData.key].mesh );
			delete otherPlayers[playerData.key];
		}
	});
}

function initMainPlayer() {

	fbRef.child( "Players/" + playerID ).set({
		isOnline: true,
		orientation: {
			position: {x: 0, y:0, z:0},
			rotation: {x: 0, y:0, z:0}
		}
	});

	player = new Player( playerID );
	player.isMainPlayer = true;
	player.init();
}

function loadEnvironment() {
	// var sphere_geometry = new THREE.SphereGeometry( 1 );
	// var sphere_material = new THREE.MeshNormalMaterial();
	// var sphere = new THREE.Mesh( sphere_geometry, sphere_material );

	// scene.add( sphere );

	var light = new THREE.AmbientLight(); // soft white light
	scene.add( light );


	// load the art
	function addCADModel(file_name_prefix, transX, transY, transZ, rotX, rotY, rotZ, scale){
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.load( file_name_prefix+'.mtl', function( materials ) {

		  materials.preload();

		  var objLoader = new THREE.OBJLoader();
		  objLoader.setMaterials( materials );
		  objLoader.load( file_name_prefix+'.obj', function ( object ) {

		    object.rotation.x = rotX;
			object.rotation.y = rotY;
			object.rotation.z = rotZ;
			object.translateX(transX);
			object.translateY(transY);
			object.translateZ(transZ);
			object.scale.set(scale,scale,scale);
			scene.add( object );
		  } );

		} );
	}

	addCADModel('models/qmb', -20, 30, 0, -Math.PI/2, 0, 0, 0.1)
	addCADModel('models/StarportV3', -40, 11, 10, 0, 0, 0, 1)
	addCADModel('models/piper_pa18', 200, 0, 200, 0, 0, 0, 1)
	addCADModel('models/portapotty_v1', 200, 2, 0, 0, 0, 0, 1)


	//load the signs
	var loader = new THREE.FontLoader();
	loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

		function addSign(name, url, x_c, z_c, w, x_o){
			var  textGeo = new THREE.TextGeometry(name, {
	            size: 10,
	            height: 5,
	            curveSegments: 6,
	            font: font,
	    	});
	    	var realTextGeo = new THREE.BufferGeometry

	    	realTextGeo.fromGeometry(textGeo)
			var color = new THREE.Color( 0xe25822 );
			var  textMaterial = new THREE.MeshBasicMaterial({ color: color });
			var  text = new THREE.Mesh(realTextGeo , textMaterial);
			text.scale.set(0.05,0.05,0.05);
			text.translateX(x_c);
			text.translateZ(z_c);
			text.translateY(0.1);
			text.userData.URL = url
			scene.add(text);
			objects.push(text);

			var geometry = new THREE.BoxGeometry( w, 1.5, 0.5 );
			var material = new THREE.MeshBasicMaterial( {color: 0x222222} );
			var cube = new THREE.Mesh( geometry, material );
			cube.translateX(x_c+x_o);
			cube.translateZ(z_c-0.1);
			cube.userData.URL = url
			scene.add( cube );
			objects.push(cube);
		}

		addSign('QMB', 'https://quantum-multiverse-bifurcator.appspot.com', -12, -20, 2, 0.6)
		addSign('StarPort', 'https://youtu.be/bcIZu4xEqUM', -36, -5, 4, 2)
		addSign('BRTA', 'http://blackrocktravelagency.squarespace.com/', 210, 210, 4, 2)

	} );



	// load the map
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('models/brc.png')
    });
    img.map.needsUpdate = true; //ADDED

	var plane = new THREE.Mesh( geometry, img );
	plane.rotation.x = -Math.PI/2
	scene.add( plane );
}

