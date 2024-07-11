import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById('solarsystem-animated');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;

let mercury_orb_rad = 45;
let venus_orb_rad = 55;
let earth_orb_rad = 65;
let mars_orb_rad = 80;
let jupiter_orb_rad = 100;
let saturn_orb_rad = 120;
let uranus_orb_rad = 145;
let neptune_orb_rad = 170;

let mercury_rev_speed = 0.5;
let venus_rev_speed = 0.1;
let earth_rev_speed = 0.08;
let mars_rev_speed = 0.06;
let jupiter_rev_speed = 0.05;
let saturn_rev_speed = 0.04;
let uranus_rev_speed = 0.03;
let neptune_rev_speed = 0.02;

const planets = [];

function createMaterialArray() {
    const skyboxImgPaths = ['img/cube2/sky_down.webp', 'img/cube2/sky_back.jpg', 'img/cube2/sky_above.png', 'img/cube2/sky_rt.avif', 'img/cube2/sky_lf.webp', 'img/cube2/sky_front.jpeg'];
    
    const materialArray = skyboxImgPaths.map((image) => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    });
    return materialArray;
}

function setSkybox() {
    const materialArray = createMaterialArray();
    let skyboxGeo = new THREE.BoxGeometry(1100, 1100, 1100);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture = loader.load(texture);
    const material = new THREE.MeshBasicMaterial({ map: planetTexture }); 
    const planet = new THREE.Mesh(geometry, material);
    return planet;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        82, /* gives angle of visibility */
        window.innerWidth / window.innerHeight, /* to set the aspect ratio to the screen size */
        0.1, /* near sight */
        1000 // far sight
    );

    setSkybox();

    // Add planets to the scene
    planet_sun = loadPlanetTexture("img/sun.jpg", 20, 100, 100);
    planet_mercury = loadPlanetTexture("img/mercury.jpg", 2, 100, 100);
    planet_venus = loadPlanetTexture("img/venus_hd.jpg", 3, 100, 100);
    planet_earth = loadPlanetTexture("img/earth.jpg", 4, 100, 100);
    planet_mars = loadPlanetTexture("img/mars.jpg", 3.5, 100, 100);
    planet_jupiter = loadPlanetTexture("img/jupiter_hd.jpg", 10, 100, 100);
    planet_saturn = loadPlanetTexture("img/saturn.jpg", 8, 100, 100);
    planet_uranus = loadPlanetTexture("img/planet-uranus_hd.jpg", 6, 100, 100);
    planet_neptune = loadPlanetTexture("img/neptune_hd.jpg", 5, 100, 100);

    // Add planets to the scene and the planets array
    scene.add(planet_sun);
    planets.push(planet_sun);

    scene.add(planet_mercury);
    planets.push(planet_mercury);

    scene.add(planet_venus);
    planets.push(planet_venus);

    scene.add(planet_earth);
    planets.push(planet_earth);

    scene.add(planet_mars);
    planets.push(planet_mars);

    scene.add(planet_jupiter);
    planets.push(planet_jupiter);

    scene.add(planet_saturn);
    planets.push(planet_saturn);

    scene.add(planet_uranus);
    planets.push(planet_uranus);

    scene.add(planet_neptune);
    planets.push(planet_neptune);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 14;
    controls.maxDistance = 1000;
    camera.position.z = 100;
}

function planetRevolution(time, speed, planet, orbitRadius) {
    let orbitSpeedMultiplier = 0.001;
    const planetAngle = time * orbitSpeedMultiplier * speed;
    planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
    planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
}

function animate(time) {
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

    // Revolution
    planetRevolution(time, mercury_rev_speed, planet_mercury, mercury_orb_rad);
    planetRevolution(time, venus_rev_speed, planet_venus, venus_orb_rad);
    planetRevolution(time, earth_rev_speed, planet_earth, earth_rev_speed);
    planetRevolution(time, mars_rev_speed, planet_mars, mars_orb_rad);
    planetRevolution(time, jupiter_rev_speed, planet_jupiter, jupiter_orb_rad);
    planetRevolution(time, saturn_rev_speed, planet_saturn, saturn_orb_rad);
    planetRevolution(time, uranus_rev_speed, planet_uranus, uranus_orb_rad);
    planetRevolution(time, neptune_rev_speed, planet_neptune, neptune_orb_rad);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        handlePlanetClick(clickedPlanet);
    }
}

function handlePlanetClick(planet) {
    if (planet === planet_sun) {
        window.location.href = 'sun.html';
    } else if (planet === planet_mercury) {
        window.location.href = 'mercury.html';
    } else if (planet === planet_venus) {
        window.location.href = 'venus.html';
    } else if (planet === planet_earth) {
        window.location.href = 'earth.html';
    } else if (planet === planet_mars) {
        window.location.href = 'mars.html';
    } else if (planet === planet_jupiter) {
        window.location.href = 'jupiter.html';
    } else if (planet === planet_saturn) {
        window.location.href = 'saturn.html';
    } else if (planet === planet_uranus) {
        window.location.href = 'uranus.html';
    } else if (planet === planet_neptune) {
        window.location.href = 'neptune.html';
    }
}

window.addEventListener('click', onMouseClick);
window.addEventListener("resize", onWindowResize, false);

init();
animate(0);


                                                                                                                                                                                                                                                                                                                                                                                                                                                    



