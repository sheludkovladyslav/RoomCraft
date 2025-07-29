import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import furnitureList from './furnitures.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const roomInitHtml = () => {
  const roomContainer = document.querySelector('.room');
  const roomHtml = `

 <ul data-list class="furniture-list">
 
 </ul>
 <div class="room__playground">
  <canvas id="canvas"></canvas>
</div>
`;
  roomContainer.innerHTML = roomHtml;
};

export default class Room {
  constructor({ canvas, button }) {
    this.canvas = canvas;
    this.button = button;
    this.furnitureList = furnitureList;
    this.glb = null;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      sizes.width / sizes.height,
      0.1,
      100
    );
    this.camera.position.set(5, 5, 5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(sizes.width, sizes.height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane();
    this.pointer = new THREE.Vector2();
    this.intersectPoint = new THREE.Vector3();
    this.gridSize = 1;
    this.bounds = {
      xMin: -5,
      xMax: 5,
      zMin: -5,
      zMax: 5,
    };

    this.dragging = {
      furniture: null,
      offset: new THREE.Vector3(),
    };

    this.loader = new GLTFLoader();

    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);

    this.spawnedFurniture = [];
  }

  init() {
    this._setupScene();
    this._setupPhysics();
    this._setupEvents();
    this._animate();
  }

  _setupScene() {
    this.scene.background = new THREE.Color(0x222222);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    this.scene.add(light);

    const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.position.y = -0.05;
    this.scene.add(floorMesh);

    const wallGeometry = new THREE.BoxGeometry(10, 8, 0.1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const wallMesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wallMesh2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh1.position.set(0, 3.9, -5.05);
    wallMesh2.position.set(-5.05, 3.9, 0);
    wallMesh2.rotation.y = Math.PI / 2;
    this.scene.add(wallMesh1, wallMesh2);

    const floorGrid = new THREE.GridHelper(10, 10, 0x020f527, 0xe6e6e6ff);
    this.scene.add(floorGrid);

    this.floorMesh = floorMesh;

    window.addEventListener('resize', this._onResize.bind(this));
  }

  _setupPhysics() {
    const floorShape = new CANNON.Box(new CANNON.Vec3(10, 0.1, 10));
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.position.set(0, -0.05, 0);
    this.world.addBody(floorBody);

    const wallShape = new CANNON.Box(new CANNON.Vec3(10, 8, 0.05));
    const wallBody1 = new CANNON.Body({ mass: 0 });
    const wallBody2 = new CANNON.Body({ mass: 0 });
    wallBody1.addShape(wallShape);
    wallBody2.addShape(wallShape);
    wallBody1.position.set(0, 3.9, -5.05);
    wallBody2.position.set(-5.05, 3.9, 0);
    wallBody2.quaternion.setFromEuler(0, Math.PI / 2, 0);
    this.world.addBody(wallBody1, wallBody2);

    this.floorBody = floorBody;
  }

  _setupEvents() {
    if (this.button) {
      this.button.addEventListener('click', e => this.spawnFurniture(e));
    }

    this.canvas.addEventListener('pointerdown', this._onPointerDown.bind(this));
    window.addEventListener('pointermove', this._onPointerMove.bind(this));
    window.addEventListener('pointerup', this._onPointerUp.bind(this));
    window.addEventListener('contextmenu', this._onKeyDown.bind(this));
  }

  _onKeyDown(e) {
    e.preventDefault();
    if (this.dragging.furniture) {
      if (this.dragging.furniture.rotationStep === undefined) {
        this.dragging.furniture.rotationStep = 0;
      }

      this.dragging.furniture.rotationStep =
        (this.dragging.furniture.rotationStep + 1) % 4;

      const angle = THREE.MathUtils.degToRad(
        90 * this.dragging.furniture.rotationStep
      );

      this.dragging.furniture.mesh.rotation.y = angle;

      this.dragging.furniture.body.quaternion.setFromEuler(0, angle, 0);
    }
  }

  _onPointerDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const meshes = this.spawnedFurniture.map(f => f.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    console.log(meshes);
    console.log(intersects);

    if (intersects.length > 0) {
      function isDescendant(object, parent) {
        if (object === parent) return true;
        let current = object.parent;
        while (current) {
          if (current === parent) return true;
          current = current.parent;
        }
        return false;
      }
      this.dragging.furniture = this.spawnedFurniture.find(f => {
        return isDescendant(intersects[0].object, f.mesh);
      });
      this.controls.enabled = false;

      console.log(this.dragging);
      this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint);
      this.dragging.offset.copy(this.dragging.furniture.body.position);
    }
    this.plane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      this.floorMesh.position
    );
  }

  _onPointerMove(event) {
    if (!this.dragging.furniture) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint)) {
      let newPos = this.intersectPoint.clone().sub(this.dragging.offset);

      newPos.x = Math.round(newPos.x / this.gridSize) * this.gridSize;
      newPos.z = Math.round(newPos.z / this.gridSize) * this.gridSize;

      newPos.x = Math.max(
        this.bounds.xMin,
        Math.min(this.bounds.xMax, newPos.x)
      );

      newPos.z = Math.max(
        this.bounds.zMin,
        Math.min(this.bounds.zMax, newPos.z)
      );

      this.dragging.furniture.body.position.x = newPos.x;
      this.dragging.furniture.body.position.z = newPos.z;
      this.dragging.furniture.body.velocity.setZero();
    }
  }

  _onPointerUp() {
    if (this.dragging.furniture) {
      this.controls.enabled = true;
      this.dragging.furniture.body.velocity.setZero();
      this.dragging.furniture.body.angularVelocity.setZero();
      this.dragging.furniture = null;
    }
  }

  aabbIntersect(bodyA, bodyB) {
    const aabbA = bodyA.shapes[0].halfExtents;
    const aabbB = bodyB.shapes[0].halfExtents;

    const posA = bodyA.position;
    const posB = bodyB.position;

    return (
      Math.abs(posA.x - posB.x) <= aabbA.x + aabbB.x &&
      Math.abs(posA.y - posB.y) <= aabbA.y + aabbB.y &&
      Math.abs(posA.z - posB.z) <= aabbA.z + aabbB.z
    );
  }

  spawnFurniture(e) {
    const furniture = this.furnitureList.find(
      f => f.key === e.target.dataset.spawn
    );

    this.loader.load(furniture.glb, gltf => {
      const mesh = gltf.scene;
      this.scene.add(mesh);

      const box = new THREE.Box3().setFromObject(mesh);
      const size = new THREE.Vector3();
      box.getSize(size);

      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);

      const body = new CANNON.Body({ mass: 0 });
      body.linearDamping = 0.5;
      body.angularDamping = 0.5;
      const shape = new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      );
      body.position.set(0, -box.min.y, 0);
      body.addShape(shape);
      this.world.addBody(body);

      this.spawnedFurniture.push({ mesh, body, size });
    });
  }

  _animate() {
    this.clock = new THREE.Clock();

    const loop = () => {
      requestAnimationFrame(loop);
      const dt = this.clock.getDelta();
      this.world.step(1 / 60, dt, 3);

      this.spawnedFurniture.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      });

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
