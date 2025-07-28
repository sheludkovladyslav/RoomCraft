import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import lodash, { size } from 'lodash';
import furnitureList from './furnitures.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export const roomInitHtml = () => {
  const roomContainer = document.querySelector('.room__container');
  const roomHtml = `
  <aside class="room__menu menu">
  <ul class="menu-filter">
    <li class="menu-filter__item" data-filter="decoration">Декорації</li>
    <li class="menu-filter__item" data-filter="furniture">Меблі</li>
    <li class="menu-filter__item" data-filter="electronic">Електроніка</li>
    <li class="menu-filter__item" data-filter="etc">ін.</li>
  </ul>


  <ul data-list class="menu-furnirute__list furniture-list">
${furnitureList
  .map(
    f =>
      `<li class="furniture-list__item" role="button" data-spawn="${f.key}">
          <article class="furniture-list__content">
            <div class="furniture-list__photo">
              <img src="${f.image}" alt="${f.name}" class="furniture-list__image" hidden/>
            </div>
            <h3 class="furniture-list__name">${f.name}</h3>
            <span class="furniture-list__category">Категорія: ${f.category}</span>
           </article>
        </li>
      `
  )
  .join('')}
      </ul>

  </aside>
  <div class="room__playground">
    <canvas class="playground"></canvas>
  </div>
`;
  roomContainer.innerHTML = roomHtml;
};

export default class Room {
  constructor({ canvas, button, container }) {
    this.canvas = canvas;
    this.button = button;
    this.furnitureList = furnitureList;
    this.glb = null;
    this.walls = [];
    this.container = container;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(14, 12, 14);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });

    this.renderer.setSize(this.width, this.height);

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
    this._setupes();
    this._animate();
  }

  _setupScene() {
    this.scene.background = new THREE.Color(0x5b5b5b);

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

    wallBodyFront.position.copy(wallMeshFront);
    wallBodyLeft.position.copy(wallMeshLeft);

    this.world.addBody(wallBodyLeft);
    this.world.addBody(wallBodyFront);
    this.walls.push(wallBodyLeft, wallBodyFront);
    this.scene.add(wallMeshLeft, wallMeshFront);

    const floorGrid = new THREE.GridHelper(10, 10, 0xe6e6e6ff);
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

  _setupes() {
    if (this.button) {
      this.button.addEventListener('click', e => this.spawnFurniture(e));
    }

    this.canvas.addEventListener('pointerdown', this._onPointerDown.bind(this));
    window.addEventListener(
      'pointermove',
      lodash.throttle(this._onPointerMove.bind(this), 50)
    );
    window.addEventListener('pointerup', this._onPointerUp.bind(this));
    window.addEventListener('contextmenu', this._rotateFurniture.bind(this));
  }

  _rotateFurniture(e) {
    e.preventDefault();
    const furniture = this.dragging.furniture;
    if (!furniture) return;

    if (furniture.rotationStep === undefined) {
      furniture.rotationStep = 0;
    }

    furniture.rotationStep = (furniture.rotationStep + 1) % 4;

    const angle = THREE.MathUtils.degToRad(90 * furniture.rotationStep);

    furniture.mesh.rotation.y = angle;
    furniture.mesh.quaternion.setFromEuler(furniture.mesh.rotation);

    furniture.body.angularVelocity.setZero();
    furniture.body.angularDamping = 1;

    furniture.body.quaternion.copy(furniture.mesh.quaternion);

    const size = furniture.size;
    [size.x, size.z] = [size.z, size.x];

    furniture.body.shapes = [];
    furniture.body.shapeOffsets = [];
    furniture.body.shapeOrientations = [];

    const newBoxShape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
    );
    furniture.body.addShape(newBoxShape);

    furniture.mesh.position.copy(furniture.body.position);
  }

  isDescendant(object, parent) {
    if (object === parent) return true;
    let current = object.parent;
    while (current) {
      if (current === parent) return true;
      current = current.parent;
    }
    return false;
  }

  _onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const meshes = this.spawnedFurniture.map(f => f.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      this.dragging.furniture = this.spawnedFurniture.find(f => {
        return this.isDescendant(intersects[0].object, f.mesh);
      });

      if (this.dragging.furniture.category === 'декорація') {
        const box = new THREE.Box3().setFromObject(
          this.dragging.furniture.mesh
        );
        this.dragging.furniture.mesh.position.y -= box.min.y;
        this.dragging.furniture.body.position.copy(
          this.dragging.furniture.mesh.position
        );
      }

      this.controls.enabled = false;

      this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint);
      this.dragging.offset.copy(this.dragging.furniture.body.position);
    }
    this.plane.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      this.floorMesh.position
    );
  }

  _onPointerMove(e) {
    if (!this.dragging.furniture) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
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
        if (
          this.dragging.furniture.category === 'декорація' ||
          f.category === 'декорація'
        )
          return;
        if (this.aabbIntersect(body, f.body, { ignoreY: true })) {
          isCollision = true;
        }
      });

      this.walls.forEach(wall => {
        if (this.aabbIntersect(body, wall, { ignoreY: true })) {
          isCollision = true;
        }
      });

      if (isCollision) {
        body.position.copy(oldPos);
        return;
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

      if (this.dragging.furniture.category === 'декорація') {
        this.snapOnTop(this.dragging.furniture);
      }

      this.dragging.furniture = null;
    }
  }

  snapOnTop(furniture) {
    const body = furniture.body;

    const underCandidates = this.spawnedFurniture.filter(f => {
      if (f === furniture) return false;
      if (f.category === 'декорація') return false;
      return this.aabbIntersect(body, f.body, { ignoreY: true });
    });

    if (underCandidates.length === 0) return;

    let best = null;
    let minYDiff = Infinity;

    underCandidates.forEach(f => {
      const topY = f.body.position.y + f.size.y / 2;
      const bottomY = body.position.y - furniture.size.y / 2;

      const diff = bottomY - topY;
      if (diff <= 0 && Math.abs(diff) < minYDiff) {
        minYDiff = Math.abs(diff);
        best = f;
      }
    });

    if (best) {
      const topY = best.body.position.y + best.size.y / 2;
      const newY = topY + furniture.size.y / 2;

      body.position.y = newY;
      furniture.mesh.position.y = newY;
    }
  }

  aabbIntersect(bodyA, bodyB, options = {}) {
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

    const overlapX = aabbA.min.x <= aabbB.max.x && aabbA.max.x >= aabbB.min.x;
    const overlapY = aabbA.min.y <= aabbB.max.y && aabbA.max.y >= aabbB.min.y;
    const overlapZ = aabbA.min.z <= aabbB.max.z && aabbA.max.z >= aabbB.min.z;

    return overlapX && (options.ignoreY ? true : overlapY) && overlapZ;
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

      // Центруємо низ щоб був на y = 0 в незалежності від pivot`у(нижньої точки моделі)
      mesh.position.sub(center);
      mesh.position.y += size.y / 2;

      // Body так само, з допомогою size.y / 2 піднімаємо його трішки вищє
      const body = new CANNON.Body({ mass: 0 });
      const shape = new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      );
      body.addShape(shape);
      body.position.set(0, size.y / 2, 0);

      this.world.addBody(body);

      // ПЕРЕСЧИТАЙ box после смещений!
      const newBox = new THREE.Box3().setFromObject(mesh);

      // Запушуємо всі головні частини в массив з меблями
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
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}
