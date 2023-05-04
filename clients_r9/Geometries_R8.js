//@ts-check

import { TriangularPrism, Cylinder, ConeFrustum, Octahedron, Box, 
        ParametricCurve, Cone, Tetrahedron, Sphere, Axes3D, PanelXZ} from "../renderer/models_L/ModelsImport.js";
import {Scene, Position, Matrix, Camera} from "../renderer/scene/SceneImport.js";
import * as ModelShading from "../renderer/scene/util/UtilImport.js";
import {renderFB, setDoAntiAliasing, setDoGamma, setRastDebug} from "../renderer/pipeline/PipelineImport.js";
import format from "../StringFormat.js";
import Color from "../renderer/color/Color.js";
import { FrameBuffer } from "../renderer/framebuffer/FramebufferImport.js";
import model2view from "../renderer/pipeline/Model2View.js";


// build the models, set the color, and create the positions
const triangMod = new TriangularPrism(1, 1, 10);
ModelShading.setColor(triangMod, Color.Magenta);
const triangPos = new Position(triangMod, Matrix.translate(-2, 0, 2), "Triangular Prism");

const cylModel = new Cylinder(1, 1, 30, 30);
ModelShading.setColor(cylModel, Color.blue);
const cylPos = new Position(cylModel, Matrix.translate(0, 0, 2), "Cylinder Position");

const coneFrustMod = new ConeFrustum(.5, 1, 1, 10, 10);
ModelShading.setColor(coneFrustMod, Color.green);
const coneFrustPos = new Position(coneFrustMod, Matrix.translate(2, 0, 2), "Cone Frustum Position");

const octMod = new Octahedron();
ModelShading.setColor(octMod, Color.pink);
const octPos = new Position(octMod, Matrix.translate(-2, 0, 0), "Octahedron Position");

const boxMod = new Box(1, 1, 1);
ModelShading.setColor(boxMod, Color.cyan);
const boxPos = new Position(boxMod, Matrix.translate(0, 0, 0), "Box Position");

const parCurveMod = new ParametricCurve(
                     (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
                     (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
                     (t) => {return 0.3*(-Math.sin(3*t))},
                     0, 6*Math.PI, 120);
ModelShading.setColor(parCurveMod, Color.red);
const parCurvePos = new Position(parCurveMod, Matrix.translate(2, 0, 0), "Parametric Curve Position");

const coneMod = new Cone(1, 1, 30, 30);
ModelShading.setColor(coneMod, Color.orange);
const conePos = new Position(coneMod, Matrix.translate(-2, 0, -2), "Cone Position");

const tetraMod = new Tetrahedron();
ModelShading.setColor(tetraMod, Color.Yellow);
const tetraPos = new Position(tetraMod, Matrix.translate(0, 0, -2), "Tetrahedron Position");

const sphereMod = new Sphere(1, 30, 30);
ModelShading.setColor(sphereMod, Color.white);
const spherePos = new Position(sphereMod, Matrix.translate(2, 0, -2), "Sphere Position");

const xzPlaneMod = new PanelXZ(-6, 6, -6, 6);
ModelShading.setColor(xzPlaneMod, Color.gray);
const xzPlanePos = new Position(xzPlaneMod, Matrix.translate(0, -1, -6), "Floor Position");

// create the nested structure of the scene
xzPlanePos.addNestedPosition(triangPos, cylPos, coneFrustPos, octPos, boxPos, parCurvePos, conePos, tetraPos, spherePos);

// create and set the viewvolume of the camera
const cam = new Camera();
cam.projOrtho(-5, -5, -1, 10, 0);

// add the camera and xzPlanes to the scene
const scene = Scene.buildFromCameraName(cam, "Geometries R8 Scene");
scene.addPosition(xzPlanePos);

// create the framebuffer, render, and dump to file
const fb = new FrameBuffer(1024, 1024);
//setRastDebug(true);
renderFB(scene, fb);
fb.dumpFB2File("GeometriesR8.ppm");


/*
// Create the Scene object that we shall render.
const scene = Scene.buildFromName("Geometries_R8");

// Create a two-dimensional array of Positions holding Models.
const position = new Array(3);
for(let i = 0; i < 3; i += 1)
    position[i] = new Array(3);

// row 0 (first row in first image)
position[0][0] = Position.buildFromModel(new TriangularPrism(1.0, 1.0, 10));
ModelShading.setColor(position[0][0].getModel(), Color.green);

position[0][1] = Position.buildFromModel(new Cylinder(0.5, 1.0, 30, 30));
ModelShading.setColor(position[0][1].getModel(), Color.blue);

position[0][2] = Position.buildFromModel(new ConeFrustum(0.5, 1.0, 1.0, 10, 10));
ModelShading.setColor(position[0][1].getModel(), Color.orange);

// row 1
position[1][0] = Position.buildFromModel(new Octahedron());
ModelShading.setColor(position[1][0].getModel(), Color.green);

position[1][1] = Position.buildFromModel(new Box(1.0, 1.0, 1.0));
ModelShading.setRandomPrimitiveColor(position[1][1].getModel());

position[1][2] = Position.buildFromModel(
        new ParametricCurve(
                    (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
                    (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
                    (t) => {return 0.3*(-Math.sin(3*t))},
                    0, 6*Math.PI, 120));
ModelShading.setRandomPrimitiveColor(position[1][2].getModel());

// row 2
position[2][0] = Position.buildFromModel(new Cone(0.5, 1.0, 30, 30));
ModelShading.setColor(position[2][0].getModel(), Color.yellow);

position[2][1] = Position.buildFromModel(new Tetrahedron(12, 12));
ModelShading.setColor(position[2][1].getModel(), Color.green);

position[2][2] = Position.buildFromModel(new Sphere(1.0, 30, 30));
ModelShading.setColor(position[2][2].getModel(), Color.cyan);

// Create x, y and z axes
const xyzAxes = Position.buildFromModel(new Axes3D(6, -6, 6, 0, 7, -7, Color.red));

// Create a horizontal coordinate plane model.
const xzPlane = Position.buildFromModel(new PanelXZ(-6, 6, -7, 7));
ModelShading.setColor(xzPlane.getModel(), Color.Gray);

// Add the positions (and their models) to the Scene.
scene.addPosition(xzPlane); // draw the grid first
scene.addPosition(xyzAxes); // draw the axes on top of the grid


for (let i = position.length - 1;  i >= 0; --i) // from back to front
{
   for (let j = 0; j < position[i].length; ++j)
   {
      //position[i][j].setMatrix(Matrix.translate(-4+4*j, 0, 6-3*i))
      scene.addPosition(position[i][j]);
   }
}

// Set up the camera's view frustum.
const  right  = 2.0;
const  left   = -right;
const  top    = 1.0;
const  bottom = -top;
const  near1   = 1.0;
scene.getCamera().projPerspective(left, right, bottom, top, near1);

const  fov    = 90.0;
const  aspect = 2.0;
const  near2   = 1.0;
scene.getCamera().projPerspective(fov, aspect, near2);

// Create a framebuffer to render our scene into.
let vp_width  = 1800;
let vp_height =  900;
let fb = new FrameBuffer(vp_width, vp_height);

renderFB(scene, fb);
fb.dumpFB2File("GeometriesR8.ppm");
*/
/*
for (let k = 0; k < 360; ++k)
{
   // Place the xz-plane model in front of the camera
   // and rotate the plane.
   xzPlane.matrix2Identity()
          .mult( Matrix.translate(0, -3, -10) )
          .mult( Matrix.rotateY(k) );

   // Place the xyz-axes model in front of the camera
   // and rotate the axes.
   xyzAxes.matrix2Identity()
          .mult( Matrix.translate(0, -3, -10) )
          .mult( Matrix.rotateY(k) );

   // Place each model where it belongs in the rotated xz-plane
   // and also rotate each model on its own axis.
   for (let i = 0; i < position.length; ++i)
   {
      for (let j = 0; j < position[i].length; ++j)
      {
         // Push the model away from the camera.
         // Rotate the plane of the models.
         // Place the model where it belongs in the rotated plane.
         // Then rotate the model on its own axis.
         position[i][j].matrix2Identity()
                       .mult( Matrix.translate(0, -3, -10) )
                       .mult( Matrix.rotateY(k) )
                       .mult( Matrix.translate(-4+4*j, 0, 6-3*i) )
                       .mult( Matrix.rotateX(3*k) )
                       .mult( Matrix.rotateY(3*k) );
      }
   }

   // Render
   setDoAntiAliasing(true);
   setDoGamma(true);

 //fb.clearFB(Color.darkGray.darker());
   fb.clearFB(Color.black);
   renderFB(scene, fb);
   fb.dumpFB2File(format("PPM_Geometries_R8_Frame%03d.ppm", k));
}
*/