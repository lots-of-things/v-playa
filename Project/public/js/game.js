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

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load( 'models/qmb.mtl', function( materials ) {

	  materials.preload();

	  var objLoader = new THREE.OBJLoader();
	  objLoader.setMaterials( materials );
	  objLoader.load( 'models/qmb.obj', function ( object ) {

	    object.rotation.x = -Math.PI/2;
		object.translateY(30);
		object.translateX(-20);
		object.scale.set(0.1,0.1,0.1);
		scene.add( object );
	  } );

	} );

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load( 'models/StarportV3.mtl', function( materials ) {

	  materials.preload();

	  var objLoader = new THREE.OBJLoader();
	  objLoader.setMaterials( materials );
	  objLoader.load( 'models/StarportV3.obj', function ( object ) {

	    // object.rotation.x = -Math.PI/2;
		object.translateY(11);
		object.translateX(-40);
		object.translateZ(10);
		// object.scale.set(0.1,0.1,0.1);
		scene.add( object );

	  } );

	} );

	var loader = new THREE.FontLoader();
	loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

		var  textGeo = new THREE.TextGeometry('QMB', {
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
		text.translateX(-12);
		text.translateZ(-20);
		text.translateY(0.1);
		text.userData.URL = "https://quantum-multiverse-bifurcator.appspot.com"
		scene.add(text);
		objects.push(text);

		var geometry = new THREE.BoxGeometry( 2, 1.5, 0.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x222222} );
		var cube = new THREE.Mesh( geometry, material );
		cube.translateX(-11.4);
		cube.translateZ(-20.1);
		cube.userData.URL = "https://quantum-multiverse-bifurcator.appspot.com"
		scene.add( cube );
		objects.push(cube);


		// StarPort
		var  textGeo = new THREE.TextGeometry('StarPort', {
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
		text.translateX(-36);
		text.translateZ(-5.0);
		text.translateY(0.1);
		text.userData.URL = "https://youtu.be/bcIZu4xEqUM"
		scene.add(text);
		objects.push(text);

		var geometry = new THREE.BoxGeometry( 4, 1.5, 0.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x222222} );
		var cube = new THREE.Mesh( geometry, material );
		cube.translateX(-34);
		cube.translateZ(-5.1);
		cube.userData.URL = "https://youtu.be/bcIZu4xEqUM"
		scene.add( cube );
		objects.push(cube);
	} );




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

