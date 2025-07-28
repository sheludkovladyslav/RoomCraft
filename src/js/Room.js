import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import lodash from 'lodash';
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
 ${furnitureList
   .map(
     f =>
       `<li class="furniture">
          <button class="furniture__spawn" data-spawn="${f.key}">
          <h3 class="furniture__name">${f.name}</h3>
          <p class="furniture__text">Категорія: ${f.category}</p>
          </button>
        </li>
      `
   )
   .join('')}
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
    this.walls = [];

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

    const wallGeometryLeft = new THREE.BoxGeometry(10, 8, 0.1);
    const wallGeometryRight = new THREE.BoxGeometry(0.1, 8, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const wallMeshLeft = new THREE.Mesh(wallGeometryLeft, wallMaterial);
    const wallMeshFront = new THREE.Mesh(wallGeometryRight, wallMaterial);

    const wallShape = new CANNON.Box(new CANNON.Vec3(10, 8, 0.1));
    const wallBodyLeft = new CANNON.Body({ mass: 0 });
    const wallBodyFront = new CANNON.Body({ mass: 0 });

    wallBodyLeft.addShape(wallShape);
    wallBodyFront.addShape(wallShape);

    wallMeshLeft.position.set(0, 3.9, -5.05);
    wallMeshFront.position.set(-5.05, 3.9, 0);

    this.world.addBody(wallBodyLeft, wallBodyFront);
    this.walls.push(wallBodyLeft, wallBodyFront);
    this.scene.add(wallMeshLeft, wallMeshFront);

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
    window.addEventListener(
      'pointermove',
      lodash.throttle(this._onPointerMove, 100)
    );
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

      const halfSizeX = this.dragging.furniture.size.x / 2;
      const halfSizeZ = this.dragging.furniture.size.z / 2;

      newPos.x = Math.max(
        this.bounds.xMin + halfSizeX,
        Math.min(this.bounds.xMax - halfSizeX, newPos.x)
      );
      newPos.z = Math.max(
        this.bounds.zMin + halfSizeZ,
        Math.min(this.bounds.zMax - halfSizeZ, newPos.z)
      );

      const body = this.dragging.furniture.body;

      const oldPos = body.position.clone();
      body.position.x = newPos.x;
      body.position.y = newPos.y;

      let isCollision = false;

      this.spawnedFurniture.forEach(f => {
        if (f.body === body) return;

        if (this.aabbIntersect(body, f.body)) isCollision = true;
      });

      this.walls.forEach(wall => {
        if (this.aabbIntersect(body, wall)) isCollision = true;
      });

      if (isCollision) {
        body.position.copy(oldPos);
      } else {
        this.dragging.furniture.mesh.position.copy(newPos);
        this.dragging.furniture.body.position.copy(newPos);
      }

      body.position.set(newPos.x, oldPos.y, newPos.z);
      body.velocity.setZero();
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
    const shapeA = bodyA.shapes[0];
    const shapeB = bodyB.shapes[0];

    const aabbA = { min: new CANNON.Vec3(), max: new CANNON.Vec3() };
    const aabbB = { min: new CANNON.Vec3(), max: new CANNON.Vec3() };

    shapeA.calculateWorldAABB(
      bodyA.position,
      bodyA.quaternion,
      aabbA.min,
      aabbA.max
    );
    shapeB.calculateWorldAABB(
      bodyB.position,
      bodyB.quaternion,
      aabbB.min,
      aabbB.max
    );

    return (
      aabbA.min.x <= aabbB.max.x &&
      aabbA.max.x >= aabbB.min.x &&
      aabbA.min.y <= aabbB.max.y &&
      aabbA.max.y >= aabbB.min.y &&
      aabbA.min.z <= aabbB.max.z &&
      aabbA.max.z >= aabbB.min.z
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
      const shape = new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      );
      body.position.set(0, -box.min.y, 0);
      body.addShape(shape);
      this.world.addBody(body);

      this.spawnedFurniture.push({
        mesh,
        body,
        size,
        category: furniture.category,
      });
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
