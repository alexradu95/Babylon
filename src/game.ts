// =============================-===--======- -    -
// Babylon.js 5.x Typescript Template
//
// Main Game Class
//
// But... of course there are infinite ways of
// doing the same thing.
// ===========================-===--======- -    -

import * as BABYLON from 'babylonjs';
import { float, int } from 'babylonjs';
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

let USE_DEBUG_LAYER: boolean = false;              // enable debug inspector?
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
    createScene(): Promise<boolean> {
        let main = this;

        return new Promise(
            function (resolve, reject) {
                main._engine.displayLoadingUI();

                // create main scene
                main._scene = new BABYLON.Scene(main._engine);

                // create cameras
                main._camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), main._scene);
                main._camera.attachControl(main._canvas, true);

                let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0),  main._scene);
                let env = main._scene.createDefaultEnvironment({});
                main._grounds.push(env.ground);

                const cone = BABYLON.MeshBuilder.CreateCylinder("cone", {}); 

                // ready to play
                if (USE_DEBUG_LAYER) main._scene.debugLayer.show();
                console.log("All resources loaded!");

                // enable user click to close loading screen
                document.getElementById("frontdiv2").innerHTML = "<h2>CLICK TO START</h2>"
                document.getElementById("frontdiv").style.cursor = "pointer";

                // just open the default xr env
                main.createDefaultXr();
                resolve(true);
            });
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
        });

        // resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

}