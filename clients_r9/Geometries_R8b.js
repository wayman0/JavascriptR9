//@ts-check

import { TriangularPrism, Cylinder, ConeFrustum, Octahedron, Box, 
    ParametricCurve, Cone, Tetrahedron, Sphere, Axes3D, PanelXZ, PanelXY} from "../renderer/models_L/ModelsImport.js";
import {Scene, Position, Matrix, Camera} from "../renderer/scene/SceneImport.js";
import * as ModelShading from "../renderer/scene/util/UtilImport.js";
import {renderFB, setDoAntiAliasing, setDoGamma, setRastDebug} from "../renderer/pipeline/PipelineImport.js";
import format from "../StringFormat.js";
import Color from "../renderer/color/Color.js";
import { FrameBuffer } from "../renderer/framebuffer/FramebufferImport.js";
import model2view from "../renderer/pipeline/Model2View.js";

// build the models, set the color, and create the positions
const triangMod = new TriangularPrism(undefined, undefined, undefined, 30);
ModelShading.setColor(triangMod, Color.Magenta);
const triangPos = new Position(triangMod, Matrix.translate(-3, 0, 4), "Triangular Prism");

const cylModel = new Cylinder(1, 1, 30, 30);
ModelShading.setColor(cylModel, Color.blue);
const cylPos = new Position(cylModel, Matrix.translate(0, 0, 4), "Cylinder Position");

//why does this model have to be translated forward 4 instead of 3 to be in line?
const coneFrustMod = new ConeFrustum(.5, 1, 1, 10, 10);
ModelShading.setColor(coneFrustMod, Color.green);
const coneFrustPos = new Position(coneFrustMod, Matrix.translate(3, 0, 5), "Cone Frustum Position");


const octMod = Octahedron.buildMeshOctahedron(3, 3, 3, 3, 3, 3);
ModelShading.setColor(octMod, Color.pink);
const octPos = new Position(octMod, Matrix.translate(-3, 0, 0), "Octahedron Position");

const boxMod = new Box(1, 1, 1);
ModelShading.setColor(boxMod, Color.cyan);
const boxPos = new Position(boxMod, Matrix.translate(-.5, 0, 0), "Box Position");

const parCurveMod = new ParametricCurve(
                 (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
                 (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
                 (t) => {return 0.3*(-Math.sin(3*t))},
                 0, 6*Math.PI, 120);
ModelShading.setColor(parCurveMod, Color.red);
const parCurvePos = new Position(parCurveMod, Matrix.translate(3, 0, 0), "Parametric Curve Position");


const coneMod = new Cone(1, 1, 30, 30);
ModelShading.setColor(coneMod, Color.orange);
const conePos = new Position(coneMod, Matrix.translate(-3, 0, -4), "Cone Position");

const tetraMod = new Tetrahedron();
ModelShading.setColor(tetraMod, Color.Yellow);
const tetraPos = new Position(tetraMod, Matrix.translate(0, 0, -4), "Tetrahedron Position");

const sphereMod = new Sphere(1, 30, 30);
ModelShading.setColor(sphereMod, Color.white);
const spherePos = new Position(sphereMod, Matrix.translate(3, 0, -4), "Sphere Position");


const xzPlaneMod = new PanelXZ(-7, 7, -7, 7);
ModelShading.setColor(xzPlaneMod, new Color(200, 200, 200));
const xzPlanePos = new Position(xzPlaneMod, Matrix.translate(0, -1, -10), "Floor Position");

/*
const xyPlaneMod = new PanelXY(-6, 6, -1, 10);
ModelShading.setColor(xyPlaneMod, new Color(100, 100, 100));
const xyPlanePos = new Position(xyPlaneMod, Matrix.translate(0, 0, -20), "Back Wall Position");
*/

// create the nested structure of the scene
xzPlanePos.addNestedPosition(triangPos); // looks in wrong position?
xzPlanePos.addNestedPosition(cylPos);
xzPlanePos.addNestedPosition(coneFrustPos); // looks in wrong position?
xzPlanePos.addNestedPosition(octPos);
xzPlanePos.addNestedPosition(boxPos);
xzPlanePos.addNestedPosition(parCurvePos);
xzPlanePos.addNestedPosition(conePos);
xzPlanePos.addNestedPosition(tetraPos);
xzPlanePos.addNestedPosition(spherePos);

// create and set the viewvolume of the camera
const cam = new Camera();
//cam.projOrtho(-5, 5, -1, 10, 0);

// add the camera and xzPlanes to the scene
const scene = Scene.buildFromCameraName(cam, "Geometries R8 Scene");
scene.addPosition(xzPlanePos);
scene.getPosition(0).getMatrix().mult(Matrix.rotateX(15));


// create the framebuffer, render, and dump to file
const fb = new FrameBuffer(1024, 1024, new Color(50, 50, 50));
//setRastDebug(true);
renderFB(scene, fb);
fb.dumpFB2File("GeometriesR8b.ppm");

for(let r = 0; r < 360; r += 10)
{
    fb.clearFBDefault();

    // rotate the xyPlane    
/*
    xzPlanePos.getMatrix().mult(Matrix.rotateY(10));
    xzPlanePos.matrix2Identity().mult(Matrix.translate(0, -1, -10).mult(Matrix.rotateX(15)).mult(Matrix.rotateY(r)));
    xzPlanePos.setMatrix(Matrix.translate(0, -1, -10)
                                .mult(Matrix.rotateX(15))
                                .mult(Matrix.rotateY(r)));

    // but these do work!
    scene.getPosition(0).getMatrix().mult(Matrix.rotateY(10));
    scene.getPosition(0).matrix2Identity().mult(Matrix.translate(0, -1, -10).mult(Matrix.rotateX(15)).mult(Matrix.rotateY(r)));
*/
    scene.getPosition(0).setMatrix(Matrix.translate(0, -1, -10)
                                            .mult(Matrix.rotateX(15)
                                            .mult(Matrix.rotateY(r))));


    for(let x = 0; x < xzPlanePos.nestedPositions.length; x += 1)
    {
        const p = xzPlanePos.nestedPositions[x];

        p.setMatrix(Matrix.translate(x%3 *3 - 3, 0, x%3 * -3 + 3)
                            .mult(Matrix.rotateX(r))
                            .mult(Matrix.rotateY(r))
                            .mult(Matrix.translate((x * 3 -3), 0, x/3 * -3 + 3)));
    }
    
    renderFB(scene, fb);
    fb.dumpFB2File(format("Geometries_R8b_Frame%03d.ppm", r/10));
}