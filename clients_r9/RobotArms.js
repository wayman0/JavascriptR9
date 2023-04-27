//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneImport.js";
import {FrameBuffer, Viewport} from "../renderer/framebuffer/FramebufferImport.js";
import {render, renderFB, setRastDebug, setDoAntiAliasing} from "../renderer/pipeline/PipelineImport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveImport.js";
import Color from "../renderer/color/Color.js";

/**
 * @param {Model} model the arm segment model to be made
 * @param {Color} color the color of the arm segment
 */
function buildArmSegment(model, color)
{
    model.addVertex(new Vertex(0, 0, 0),
                    new Vertex(0, 1, 0));
    model.addColor(color);
    model.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));
}

let shoulderLength = .4;
let elbowLength = .3;
let wristLength = .2;
let fingerLength = .1;

// build the finger structure
let arm1Finger1Mod = Model.buildName("Arm 1: Finger 1");
buildArmSegment(arm1Finger1Mod,  new Color(0, Math.trunc(3/3 * 255), Math.trunc(0/3 * 255)));
let arm1Finger1Pos = Position.buildFromModelName(arm1Finger1Mod, "Arm 1 Finger 1 Position");
arm1Finger1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength/wristLength, 1)));


let arm1Finger2Mod = Model.buildName("Arm 1: Finger 2");
buildArmSegment(arm1Finger2Mod,  new Color(0, Math.trunc(3/3 * 255), Math.trunc(0/3 * 255)));
let arm1Finger2Pos = Position.buildFromModelName(arm1Finger2Mod, "Arm 1 Finger 2 Position");
arm1Finger2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15))
                                .mult(Matrix.scaleXYZ(fingerLength / wristLength, fingerLength / wristLength, 1)));

// build the wrist structure
let arm1Wrist1Mod = Model.buildName("Arm 1: Wrist 1");
buildArmSegment(arm1Wrist1Mod,   new Color(0, Math.trunc(2/3 * 255), Math.trunc(1/3 * 255)));
let arm1Wrist1Pos = Position.buildFromModelName(arm1Wrist1Mod, "Arm 1 Wrist 1 Position");
arm1Wrist1Pos.addNestedPosition(arm1Finger1Pos);
arm1Wrist1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));

let arm1Wrist2Mod = Model.buildName("Arm 1: Wrist 2");
buildArmSegment(arm1Wrist2Mod,   new Color(0, Math.trunc(2/3 * 255), Math.trunc(1/3 * 255)));
let arm1Wrist2Pos = Position.buildFromModelName(arm1Wrist2Mod, "Arm 1 Wrist 2 Position");
arm1Wrist2Pos.addNestedPosition(arm1Finger2Pos);
arm1Wrist2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1))));


// build the elbow structure
let arm1Elbow1Mod = Model.buildName("Arm 1: Elbow 1");
buildArmSegment(arm1Elbow1Mod,   new Color(0, Math.trunc(1/3 * 255), Math.trunc(2/3 * 255)));
let arm1Elbow1Pos = Position.buildFromModelName(arm1Elbow1Mod, "Arm 1 Elbow 1 Position");
arm1Elbow1Pos.addNestedPosition(arm1Wrist1Pos);
arm1Elbow1Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(-15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

let arm1Elbow2Mod = Model.buildName("Arm 1: Elbow 2");
buildArmSegment(arm1Elbow2Mod,   new Color(0, Math.trunc(1/3 * 255), Math.trunc(2/3 * 255)));
let arm1Elbow2Pos = Position.buildFromModelName(arm1Elbow2Mod, "Arm 1 elbow 2 Position");
arm1Elbow2Pos.addNestedPosition(arm1Wrist2Pos);
arm1Elbow2Pos.setMatrix(Matrix.translate(0, 1, 0)
                                .mult(Matrix.rotateZ(15)
                                .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1))));

// build the shoulder structure
let arm1ShoulderMod = Model.buildName("Arm 1: Shoulder");
buildArmSegment(arm1ShoulderMod, new Color(0, Math.trunc(0/3 * 255), Math.trunc(3/3 * 255)));
let arm1ShoulderPos = Position.buildFromModelName(arm1ShoulderMod, "Arm 1 Shoulder Position");
arm1ShoulderPos.addNestedPosition(arm1Elbow1Pos, arm1Elbow2Pos);
arm1ShoulderPos.setMatrix(Matrix.translate(0, -.5, -1)
                                .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));

let scene = new Scene();
scene.addPosition(arm1ShoulderPos);

let fb = new FrameBuffer(1000, 1000);

render(scene, fb.vp);
fb.dumpFB2File("Robot Arm.ppm");

// rotate just the shoulder position to 
// demonstrate how nested positions works 
/*
for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();
    arm1ShoulderPos.setMatrix(
        Matrix.translate(0, -.5, -1)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(shoulderLength, shoulderLength, 1)));
    render(scene, fb.vp);
    fb.dumpFB2File("Robot Arm Rotate Shoulder " + x + ".ppm");
}
*/

for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();

    arm1Elbow1Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1)));
    
    arm1Elbow2Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(-x))
              .mult(Matrix.scaleXYZ(elbowLength / shoulderLength, elbowLength / shoulderLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File("Robot Arm Rotate Elbow 1: " + x + " Rotate Elbow 2: " + -x + ".ppm");
}

/**
 * get error: 
 * node:fs:600
  handleErrorFromBinding(ctx);
  ^

Error: ENOENT: no such file or directory, open 'Robot Arm Rotate Elbow 1: -45.ppm'
←[90m    at Object.openSync (node:fs:600:3)←[39m
←[90m    at Module.writeFileSync (node:fs:2221:35)←[39m
    at file:///E:/JavaScript%20Renderer%209/JavascriptR9/renderer/framebuffer/FrameBuffer.js:438:16 {
  errno: ←[33m-4058←[39m,
  syscall: ←[32m'open'←[39m,
  code: ←[32m'ENOENT'←[39m,
  path: ←[32m'Robot Arm Rotate Elbow 1: -45.ppm'←[39m
}

Node.js v18.13.0
 */


/*
for(let x = -45; x <= 45; x += 5)
{
    fb.clearFBDefault();

    arm1Wrist1Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(x))
              .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1)));
    
    arm1Wrist2Pos.setMatrix(
        Matrix.translate(0, 1, 0)
              .mult(Matrix.rotateZ(-x))
              .mult(Matrix.scaleXYZ(wristLength / elbowLength, wristLength / elbowLength, 1)));

    render(scene, fb.vp);
    fb.dumpFB2File("Robot Arm Rotate Wrist 1: " + x + " Rotate Wrist 2: " + -x + ".ppm");
}
*/







