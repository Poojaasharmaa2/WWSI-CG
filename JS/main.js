import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;

let mercury_orb_rad = 45;
let venus_orb_rad = 55;
let earth_orb_rad = 65;
let mars_orb_rad = 80;
let jupiter_orb_rad = 100;
let saturn_orb_rad = 120;
let uranus_orb_rad = 145;
let neptune_orb_rad = 170;


let mercury_rev_speed = 1.5;
let venus_rev_speed = 1.1;
let earth_rev_speed = 0.8;
let mars_rev_speed = 0.6;
let jupiter_rev_speed = 0.5;
let saturn_rev_speed = 0.4;
let uranus_rev_speed = 0.3;
let neptune_rev_speed = 0.2;

function createSpaceArray(){
     const skyboxImgpaths = ['C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\back.jpg','C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\down.jpg', 'C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\front.jpg', 'C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\left.jpg', 'C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\right.png', 'C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\cube\up.jpg'];
     const materialarray = skyboxImgpaths.map((image)=>{
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
     }
    ); 
    return materialarray;  
}

/*to make a cube and weave the textures and cube together*/

function setSkybox(){
    const materialarray = createSpaceArray();
    let skyboxgeo= new THREE.BoxGeometry(1100,1100,1100);
    skybox = new THREE.Mesh(skyboxgeo, materialarray);
    scene.add(skybox);
}

function createring(innerRadius){
  let innerRadius = outerRadius - 0.1;
  let thetaSegments = 65; //thetasegment gives the no. of segments and hence the  resulting shape
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({color: 'silver', side: THREE.DoubleSide}); //doublesided as in uppar neeche dono se same dikhega has 2 sides
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.rotation.x = Math.PI/2; //IN ORDER TO ROTATE THE THINGS TO LAY ON THE X AXIS
  return mesh;
}





function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType){
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture= loader.load(texture);
    const material = new THREE.MeshBasicMaterial({map: planetTexture}); 


    const planet = new THREE.Mesh(geometry, material);

    return planet;

}

/*to define scene and camera we make another function*/

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
    82, /* gives angle of visiblity*/
    window.innerWidth / window.innerHeight, /* to set the aspect ratio to the screen size*/
    0.5, /*near sight*/
    1000, /*farsight*/
    );

    setSkybox();

    planet_sun = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\sun.jpg", 20, 100, 100, 'basic');
    planet_mercury = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\mercury.jpg", 20, 100, 100, 'basic');
    planet_earth = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\earth.jpg", 4, 100, 100, 'standard');
    planet_venus = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\venus_hd.jpg", 3, 100, 100, 'standard');
    planet_mars = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\mars.jpg", 3.5, 100, 100, 'standard');
    planet_jupiter = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\jupiter_hd.jpg", 10, 100, 100, 'standard');
    planet_saturn = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\saturn.jpg", 8, 100, 100, 'standard');
    planet_uranus = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\uranus_hd.jpg", 6, 100, 100, 'standard');
    planet_neptune = loadPlanetTexture("C:\Users\pooji\OneDrive\Desktop\Solar3d-webd\img\neptune_hd.jpg", 5, 100, 100, 'standard');




  scene.add(planet_sun);
  scene.add(planet_mercury);
  scene.add(planet_venus);
  scene.add(planet_earth);
  scene.add(planet_mars);
  scene.add(planet_jupiter);
  scene.add(planet_saturn);
  scene.add(planet_uranus);
  scene.add(planet_neptune);

  
   
     createring(mercury_orb_rad);
     createring(venus_orb_rad);
     createring(earth_orb_rad);
     createring(mars_orb_rad);
     createring(jupiter_orb_rad);
     createring(saturn_orb_rad);
     createring(uranus_orb_rad);
     createring(neptune_orb_rad);
  

   


    /*to create the place where we host the scene ie the renderer*/

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
    let orbitspeedmultiplier = 0.001;
    const planetangle = time * orbitspeedmultiplier;
    planet.position.x = sun.position.x + orbitRadius * Math.cos(planetangle);
    planet.position.z = sun.position.z + orbitRadius * Math.cos(planetangle);
    
  
  }

   
function animate(time){
  const rotationSpeed = 0.005;
  sun.rotation.y += rotationSpeed;
  mercury.rotation.y += rotationSpeed;
  venus.rotation.y += rotationSpeed;
  earth.rotation.y += rotationSpeed;
  mars.rotation.y += rotationSpeed;
  jupiter.rotation.y += rotationSpeed;
  saturn.rotation.y += rotationSpeed;
  uranus.rotation.y += rotationSpeed;
  neptune.rotation.y += rotationSpeed;
 

  
  //revolution
  planetrevolution(time, mercury_rev_speed, mercury, mercury_orb_rad, 'mercury');
  planetrevolution(time, venus_rev_speed, venus, venus_orb_rad, 'venus');
  planetrevolution(time, earth_rev_speed, earth, earth_rev_speed, 'earth');
  planetrevolution(time, mars_rev_speed, mars, mars_orb_rad, 'mars');
  planetrevolution(time, jupiter_rev_speed, jupiter, jupiter_orb_rad, 'jupiter');
  planetrevolution(time, saturn_rev_speed, saturn, saturn_orb_rad, 'saturn');
  planetrevolution(time, uranus_rev_speed, uranus, uranus_orb_rad, 'uranus');
  planetrevolution(time, neptune_rev_speed, neptune, neptune_orb_rad, 'neptune');

  //to keep it running always
  controls.update();
  requestAnimationFrame(animate)
  renderer.render(scene, camera);

  
  





}
 
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//eventlistener
window.addEventListener("resize", onWindowResize, false);
init()
animate(0) //time starts from 0


