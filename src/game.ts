// =============================-===--======- -    -
// Babylon.js 5.x Typescript Template
//
// Main Game Class
//
// But... of course there are infinite ways of
// doing the same thing.
// ===========================-===--======- -    -

import * as BABYLON from 'babylonjs';
import { float, int, Vector3 } from 'babylonjs';
import { PlatformUtil } from './utils/PlatformUtil';

// ======================================
// performance tweakers
// ======================================
//
// hardware scale will affect the
// final rendering resolution;
// 1 = default scale (normal speed)
// above 1 = lower resolution (faster)
// below 1 = higher resolution (slower)
// ======================================

let USE_DEBUG_LAYER: boolean = true;              // enable debug inspector?
let HW_SCALE_NORMAL: float = 2;                  // scale in non-vr mode
let HW_SCALE_VR: float = 2;                      // scale in vr mode
// ======================================


// Main game class
export class Game {

    private _fps: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.Camera;
    private _xrhelper: BABYLON.WebXRDefaultExperience;
    private _grounds: BABYLON.AbstractMesh[] = new Array<BABYLON.AbstractMesh>();

    private limbaMinute;
    private limbaSecunde;
    private limbaOre;

    private rotatielimbaMinute : Vector3;
    private rotatielimbaSecunde : Vector3;
    private rotatielimbaOre : Vector3;


    // Initialization, gets canvas and creates engine
    constructor(canvasElement: string) {
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas);
        this._engine.setHardwareScalingLevel(HW_SCALE_NORMAL);
    }


    // create a default xr experience
    createDefaultXr() : void {
        this._scene.createDefaultXRExperienceAsync(
            {
                floorMeshes: this._grounds,
                outputCanvasOptions: { canvasOptions: { framebufferScaleFactor: 1/HW_SCALE_VR } }
            }).then((xrHelper) => {
                this._xrhelper = xrHelper;
                xrHelper.baseExperience.sessionManager.updateTargetFrameRate(30);

                //const layers = this._xrhelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.LAYERS, "latest", {
                //    preferMultiviewOnInit: true
                //}, true, false);

                this._xrhelper.baseExperience.onStateChangedObservable.add((state) => {
                    if (state === BABYLON.WebXRState.IN_XR) {
                        // not working yet, but we hope it will in the near future
                        //this._engine.setHardwareScalingLevel(HW_SCALE_VR);

                        // force xr camera to specific position and rotation
                        // when we just entered xr mode
                        this._scene.activeCamera.position.set(0, 0.1, 2);
                        (this._scene.activeCamera as BABYLON.WebXRCamera).setTarget(new BABYLON.Vector3(0, 0.1, 0));
                    }
                });
            }, (error) => {
                console.log("ERROR - No XR support.");
            });
    }


    // Creates the main Scene
    // with a basic model and a default environment;
    // it will also prepare for XR where available.
    createScene(): void {
        let main = this;

                main._engine.displayLoadingUI();

                // create main scene
                main._scene = new BABYLON.Scene(main._engine);

                // Parameters : name, position, scene
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 20, 0), this._scene);
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.attachControl(this._canvas, true);

                let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 15, 0),  main._scene);

                // Targets the camera to a particular position. In this case the scene origin
                camera.setTarget(new Vector3(0,1,0));

                // Attach the camera to the canvas
                //camera.attachControl(main._canvas, true);

                let env = main._scene.createDefaultEnvironment({});
                main._grounds.push(env.ground);

                this.createClockBack();
                this.createOre();
                this.createLimbaOre();
                this.createLimbaMinute();
                this.createLimbaSecunde();

                // ready to play
                if (USE_DEBUG_LAYER) main._scene.debugLayer.show();
                
                // just open the default xr env
                main.createDefaultXr();
    }

        createLimbaSecunde() {
            this.limbaSecunde = BABYLON.MeshBuilder.CreateBox("secunde", {faceColors: [new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1)]});
            this.limbaSecunde.scaling = new Vector3(0.1, 0.1, 4);
            this.limbaSecunde.position = new Vector3(0,0.2,0.5);
            this.limbaSecunde.setPivotPoint(new BABYLON.Vector3(0, 0, -0.5));
            this.limbaSecunde.outlineColor = BABYLON.Color3.Black();  
            
            this.rotatielimbaSecunde = new Vector3();
            this.limbaSecunde.rotation = this.rotatielimbaSecunde;

        }

        createLimbaMinute() {
            this.limbaMinute = BABYLON.MeshBuilder.CreateBox("minute", {faceColors: [new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1)]});
            this.limbaMinute.scaling = new Vector3(0.1, 0.1, 3.5);
            this.limbaMinute.position = new Vector3(0,0.3,0.5);

            this.limbaMinute.setPivotPoint(new BABYLON.Vector3(0, 0, -0.5));
            this.rotatielimbaMinute = new Vector3();
            this.limbaMinute.rotation = this.rotatielimbaMinute;
        }

        createLimbaOre() {
            this.limbaOre = BABYLON.MeshBuilder.CreateBox("ore", {faceColors: [new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1),new BABYLON.Color4(1,0,1,1)]});
            this.limbaOre.scaling = new Vector3(0.1, 0.1, 3);
            this.limbaOre.position = new Vector3(0,0.4,0.5);
            this.limbaOre.setPivotPoint(new BABYLON.Vector3(0, 0, -0.5));
            this.rotatielimbaOre = new Vector3();
            this.limbaOre.rotation = this.rotatielimbaOre;
        }


    private createClockBack() {
        const cone = BABYLON.MeshBuilder.CreateCylinder("cone", {});
        cone.scaling = new Vector3(10, 0.1, 10);
    }

    private createOre() {

        const nArrows = 12;
        const arrowMesh = BABYLON.MeshBuilder.CreateCylinder('arrowheads', {
            height: 0.5,
            diameterBottom: 0.25,
            diameterTop: 0.0,
            tessellation: 4
            });
        arrowMesh.isVisible = false;
    
        arrowMesh.registerInstancedBuffer("color", 4);
    
        arrowMesh.material = new BABYLON.StandardMaterial('arrow_mat');
    
        for(let ix = 0; ix < nArrows; ix++) {
            const instance = arrowMesh.createInstance('arrow' + ix);
    
            instance.instancedBuffers.color = new BABYLON.Color4((ix+0)%3==0 ? 1 : 0, (ix+1)%3==0 ? 1 : 0, (ix+2)%3==0 ? 1 : 0, 1);
    
            const angle = BABYLON.Tools.ToRadians(ix*360/nArrows);
    
            instance.position.x = 4*Math.sin(angle);
            instance.position.y = 0.5;
            instance.position.z = 4*Math.cos(angle);
    
        }
    
    }


    // Game main loop
    run(): void {
        // hide the loading ui
        this._engine.hideLoadingUI();

        this._fps = document.getElementById("fps");

        // before rendering a new frame
        this._scene.registerBeforeRender(() => {
            this._fps.innerHTML = this._engine.getFps().toFixed() + " fps";
        });

        // render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();

            let currentDate = new Date();

            this.rotatielimbaSecunde.y =  BABYLON.Tools.ToRadians(360 * (currentDate.getSeconds() / 60) + 180);
            this.rotatielimbaMinute.y = BABYLON.Tools.ToRadians(360 * (currentDate.getMinutes() / 60) + 180);
            this.rotatielimbaOre.y = BABYLON.Tools.ToRadians(360 * (currentDate.getHours() / 12) + 180);
        });

        // resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

}