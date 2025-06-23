declare module 'three/examples/jsm/controls/OrbitControls' {
  import * as THREE from 'three';
  export class OrbitControls extends THREE.EventDispatcher {
    constructor(object: THREE.Camera, domElement?: HTMLElement);
    // You can add more type definitions here if you want, or just leave it as any:
    // [key: string]: any;
  }
}