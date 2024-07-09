import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;

let mercury_orb_rad = 45
let venus_orb_rad = 55
let earth_orb_rad = 65
let mars_orb_rad = 80
let jupiter_orb_rad = 100
let saturn_orb_rad = 120
let uranus_orb_rad = 145
let neptune_orb_rad = 170

let mercury_rev_speed = 1.5
let venus_rev_speed = 1.1
let earth_rev_speed = 0.8
let mars_rev_speed = 0.6
let jupiter_rev_speed = 0.5
let saturn_rev_speed = 0.4
let uranus_rev_speed = 0.3
let neptune_rev_speed = 0.2


function createMaterialArray(){
    const skyboxImgpaths = ['img/cube2/sky_down.webp','img/cube2/sky_back.jpg','img/cube2/sky_above.png','img/cube2/sky_rt.avif','img/cube2/sky_lf.webp','img/cube2/sky_front.jpeg']

    
    const materialarray = skyboxImgpaths.map((image) => {
       let texture = new THREE.TextureLoader().load(image);
       return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
    }
   ); 
   return materialarray;  
}

function setSkybox(){
    const materialarray = createMaterialArray();
    let skyboxgeo= new THREE.BoxGeometry(1100,1100,1100);
    skybox = new THREE.Mesh(skyboxgeo, materialarray);
    scene.add(skybox);
}




function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType){
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture= loader.load(texture);
    const material = new THREE.MeshBasicMaterial({map: planetTexture}); 


    const planet = new THREE.Mesh(geometry, material);

    return planet;

}


function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
    82, /* gives angle of visiblity*/
    window.innerWidth / window.innerHeight, /* to set the aspect ratio to the screen size*/
    0.1, /*near sight*/
    1000 //farsight
    );

    setSkybox();

  //basic means light of its own while standard dosent
    planet_sun = loadPlanetTexture("img/sun.jpg", 20, 100, 100, 'basic');
    planet_mercury = loadPlanetTexture("img/mercury.jpg", 2, 100, 100, 'standard');
    planet_earth = loadPlanetTexture("img/earth.jpg", 4, 100, 100, 'standard');
    planet_venus = loadPlanetTexture("img/venus_hd.jpg", 3, 100, 100, 'standard');
    planet_mars = loadPlanetTexture("img/mars.jpg", 3.5, 100, 100, 'standard');
    planet_jupiter = loadPlanetTexture("img/jupiter_hd.jpg", 10, 100, 100, 'standard');
    planet_saturn = loadPlanetTexture("img/saturn.jpg", 8, 100, 100, 'standard');
    planet_uranus = loadPlanetTexture("img/planet-uranus_hd.jpg", 6, 100, 100, 'standard');
    planet_neptune = loadPlanetTexture("img/neptune_hd.jpg", 5, 100, 100, 'standard');


    scene.add(planet_sun);
    scene.add(planet_mercury);
    scene.add(planet_venus);
    scene.add(planet_earth);
    scene.add(planet_mars);
    scene.add(planet_jupiter);
    scene.add(planet_saturn);
    scene.add(planet_uranus);
    scene.add(planet_neptune);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    /*append to the html document in canvas tag*/
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id="c";
    //define controls
    controls = new OrbitControls(camera, renderer.domElement);
    //min n max dist till we can zoom
    controls.minDistance = 14;
    controls.maxDistance = 1000;
    camera.position.z=100;

    

}
function planetrevolution(time, speed, planet, orbitRadius, planetname){
    let orbitSpeedMultiplier = 0.001;
    const planetangle = time * orbitSpeedMultiplier * speed;
    planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetangle);
    planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetangle);
    
  
  }


function animate(time){
    const rotationSpeed = 0.007;
    planet_sun.rotation.y += rotationSpeed;
    planet_mercury.rotation.y += rotationSpeed;
    planet_venus.rotation.y += rotationSpeed;
    planet_earth.rotation.y += rotationSpeed;
    planet_mars.rotation.y += rotationSpeed;
    planet_jupiter.rotation.y += rotationSpeed;
    planet_saturn.rotation.y += rotationSpeed;
    planet_uranus.rotation.y += rotationSpeed;
    planet_neptune.rotation.y += rotationSpeed;

    //revolution
    planetrevolution(time, mercury_rev_speed, planet_mercury, mercury_orb_rad, 'mercury')
    planetrevolution(time, venus_rev_speed, planet_venus, venus_orb_rad, 'venus')
    planetrevolution(time, earth_rev_speed, planet_earth, earth_rev_speed, 'earth')
    planetrevolution(time, mars_rev_speed, planet_mars, mars_orb_rad, 'mars')
    planetrevolution(time, jupiter_rev_speed, planet_jupiter, jupiter_orb_rad, 'jupiter')
    planetrevolution(time, saturn_rev_speed, planet_saturn, saturn_orb_rad, 'saturn')
    planetrevolution(time, uranus_rev_speed, planet_uranus, uranus_orb_rad, 'uranus')
    planetrevolution(time, neptune_rev_speed, planet_neptune, neptune_orb_rad, 'neptune')


    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate)
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
window.addEventListener("resize", onWindowResize, false);

init();
animate(0)