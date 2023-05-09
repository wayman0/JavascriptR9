//@ts-check

import {TriangularPrism, Cylinder, ConeFrustum, Octahedron, Box, 
        ParametricCurve, Cone, Tetrahedron, Sphere, Axes3D, PanelXZ, PanelXY} from "../renderer/models_L/ModelsExport.js";
import {Scene, Position, Matrix, Camera} from "../renderer/scene/SceneExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {renderFB, setDoAntiAliasing, setDoGamma, setRastDebug} from "../renderer/pipeline/PipelineExport.js";
import format from "../StringFormat.js";
import Color from "../renderer/color/Color.js";
import { FrameBuffer } from "../renderer/framebuffer/FramebufferExport.js";

// Create the Scene object that we shall render.
const scene = Scene.buildFromName("Geometries_R9b");

// Create a two-dimensional array of Positions holding Models.
/**@type {Position[][]} */
const position = new Array(3);
for(let x = 0; x < position.length; x += 1)
    position[x] = new Array(3);

// row 0 (first row in first image)
position[0][0] = new Position(new TriangularPrism(1.0, 1.0, 10));
ModelShading.setColor(position[0][0].getModel(), Color.magenta);

position[0][1] = new Position(new Cylinder(0.5, 1.0, 30, 30));
ModelShading.setColor(position[0][1].getModel(), Color.blue);

position[0][2] = new Position(new ConeFrustum(0.5, 1.0, 1.0, 10, 10));
ModelShading.setColor(position[0][2].getModel(), Color.orange);

position[1][0] = new Position(Octahedron.buildMeshOctahedron(2, 2, 2, 2, 2, 2));
ModelShading.setColor(position[1][0].getModel(), Color.red);

position[1][1] = new Position(new Box(1.0, 1.0, 1.0));
ModelShading.setRandomPrimitiveColor(position[1][1].getModel());

position[1][2] = new Position(new ParametricCurve(
                        (t) => {return 0.3*(Math.sin(t) + 2*Math.sin(2*t)) + 0.1*Math.sin(t/6)},
                        (t) => {return 0.3*(Math.cos(t) - 2*Math.cos(2*t)) + 0.1*Math.sin(t/6)},
                        (t) => {return 0.3*(-Math.sin(3*t))},
                         0, 6*Math.PI, 120));
ModelShading.setRandomPrimitiveColor(position[1][2].getModel());

position[2][0] = new Position(new Cone(0.5, 1.0, 30, 30));
ModelShading.setColor(position[2][0].getModel(), Color.yellow);

position[2][1] = new Position(new Tetrahedron(12, 12));
ModelShading.setColor(position[2][1].getModel(), Color.green);

position[2][2] = new Position(new Sphere(1.0, 30, 30));
ModelShading.setColor(position[2][2].getModel(), Color.cyan);

// Create x, y and z axes
const xyzAxes = new Position(
                            new Axes3D(6, -6, 6, 0, 7, -7, Color.red));

// Create a "top level" Position that holds
// the horizontal coordinate plane model.
const topLevel_p = new Position(new PanelXZ(-6, 6, -7, 7));
ModelShading.setColor(topLevel_p.getModel(), new Color(50, 50, 50));

// Add the other Positions as nested Positions of the top level Position.
topLevel_p.addNestedPosition(xyzAxes); // draw the axes after the grid
for (let i = position.length - 1; i >= 0; --i)  // from back to front
{
   for (let j = 0; j < position[i].length; ++j)
   {
      topLevel_p.addNestedPosition(position[i][j]);
   }
}

// Add the top level Position to the Scene.
scene.addPosition( topLevel_p );

// Place the top level Position in front of the camera.
topLevel_p.setMatrix( Matrix.translate(0, -3, -10) );

// Place each model where it belongs in the xz-plane.
for (let i = 0; i < position.length; ++i)
{
   for (let j = 0; j < position[i].length; ++j)
   {
      position[i][j].getMatrix()
                    .mult(Matrix.translate(-4+4*j, 0, 6-3*i));
   }
}

// Set up the camera's view frustum.
const right  = 2.0;
const left   = -right;
const top    = 1.0;
const bottom = -top;
const near   = 1.0;
scene.getCamera().projPerspective(left, right, bottom, top, near);
/*
const fov    = 90.0;
const aspect = 2.0;
const near   = 1.0;
scene.getCamera().projPerspective(fov, aspect, near);
*/

// Create a framebuffer to render our scene into.
const vp_width  = 1800;
const vp_height =  900;
const fb = new FrameBuffer(vp_width, vp_height);

for (let k = 0; k < 360; k += 1)
{
   // Show that the accumulated model rotation has floating-point errors.
   console.log( "k = " + k + "\n" + position[0][0].getMatrix() );

   // Render
   setDoAntiAliasing(true);
   setDoGamma(true);
 //fb.clearFB(Color.darkGray);
   fb.clearFB(Color.black);
   renderFB(scene, fb);
   fb.dumpFB2File(format("Geometries_R9b_Frame%03d.ppm", k));

   // Rotate the top level Position one degree, accumulate the rotations.
   topLevel_p.getMatrix().mult(Matrix.rotateY(1)); // rotate one more degree

   // Rotate each model on its own axis, accumulate the rotations.
   for (let i = 0; i < position.length; ++i)
   {
      for (let j = 0; j < position[i].length; ++j)
      {
         // Rotate three more degrees.
         position[i][j].getMatrix()
                       .mult(Matrix.rotateX(3))
                       .mult(Matrix.rotateY(3));
      }
   }
}
