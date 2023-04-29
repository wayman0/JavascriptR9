//@ts-check

import * as ModelShading from "../../renderer/scene/util/UtilImport.js";
import {Position, Scene, Matrix, Model, LineSegment, Vertex} from "../../renderer/scene/SceneImport.js";
import {PanelXZ, Sphere} from "../../renderer/models_L/ModelsImport.js";
import {FrameBuffer} from "../../renderer/framebuffer/FramebufferImport.js";
import {renderFB} from "../../renderer/pipeline/PipelineImport.js";
import Color from "../../renderer/color/Color.js";


/**
   This is a simple hierarchical scene made up of a
   triangle with a sphere attached to each vertex.
<p>
   Here is a sketch of the scene graph for this example.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     }     \
            /      |      \
      Matrix     Model     List<Position>
       RT     (triangle)  /     |        \
                         /      |         \
                        /       |          \
                       /        |           \
                      /         |            \
              Position      Position       Position
             /     \        /    \           /   \
            /       \      /      \         /     \
      Matrix    List<   Matrix  List<     Matrix   List<
        T    Position>    T     Position>   T      Position>
                      \            |             /
                        \          |           /
                          \        |         /
                            \      |       /
                              \    |     /
                                Position
                              /   |    \
                             /    |     \
                        Matrix   Model   List<Position>
                          R    (sphere)      (empty)
}</pre>
*/

// Create the Scene object that we shall render.
const scene = Scene.buildFromName("NestedModels_v1");

// Create the top level Position.
const top_p = Position.buildFromName("top");

// Add the top level Position to the Scene.
scene.addPosition(top_p);

// Create a Model for the top level position.
const topModel = Model.buildName("triangle");
top_p.setModel(topModel);

// Add a single triangle to the geometry of this model.
const sin2PIover3 = Math.sin(2*Math.PI/3);
const v0 = new Vertex( 1,        0,       0);
const v1 = new Vertex(-0.5,  sin2PIover3, 0);
const v2 = new Vertex(-0.5, -sin2PIover3, 0);

topModel.addVertex(v0, v1, v2);
topModel.addPrimitive(LineSegment.buildVertex(0, 1),
                      LineSegment.buildVertex(1, 2),
                      LineSegment.buildVertex(2, 0));

ModelShading.setColor(topModel, Color.black);

// Create three nested Positions.
const p1 = Position.buildFromName("p1");
const p2 = Position.buildFromName("p2");
const p3 = Position.buildFromName("p3")

// Put these three nested Positions into the top level Position.
top_p.addNestedPosition(p1, p2, p3);

// Place the three nested positions at the
// corners of the top level position's triangle.
p1.getMatrix().mult(Matrix.translate( 1.5,   0,               0));
p2.getMatrix().mult(Matrix.translate(-0.75,  1.5*sin2PIover3, 0));
p3.getMatrix().mult(Matrix.translate(-0.75, -1.5*sin2PIover3, 0));

// Give each of these three nested Positionsa a shared
// sphere Model in another (deeper) nested Position.
const sphere = new Sphere(0.5, 10, 10);
ModelShading.setColor(sphere, Color.red);
const p4 = Position.buildFromModel(sphere);
p1.addNestedPosition(p4);
p2.addNestedPosition(p4);
p3.addNestedPosition(p4);

// Create a floor Model.
const floor = new PanelXZ(-4, 4, -4, 4);
ModelShading.setColor(floor, Color.black);
const floor_p = Position.buildFromModel(floor);
floor_p.getMatrix().mult(Matrix.translate(0, -4, 0));
// Push this model away from where the camera is.
floor_p.getMatrix().mult(Matrix.translate(0, 0, -5));
// Add the floor to the Scene.
scene.addPosition(floor_p);

// Create a framebuffer to render our scene into.
const vp_width  = 1024;
const vp_height = 1024;
const fb = new FrameBuffer(vp_width, vp_height);

//PipelineLogger.debug = true

for (let i = 0; i <= 72; ++i)
{
   // Rotate the spheres WITHIN the scene.
   p4.getMatrix().mult(Matrix.rotateX(5))
   // Translate and rotate the WHOLE scene.
   top_p.matrix2Identity();
   // Push the whole scene away from where the camera is.
   top_p.getMatrix().mult(Matrix.translate(0, 0, -5));
   // Rotate and translate the whole scene.
   top_p.getMatrix().mult(Matrix.rotateZ(5*i));
   top_p.getMatrix().mult(Matrix.translate(2, 0, 0));
//     top_p.getMatrix().mult(Matrix.rotateY(5*i));
//     top_p.getMatrix().mult(Matrix.rotateX(5*i))
   // Render
   fb.clearFB(Color.Gray);
   renderFB(scene, fb);
   fb.dumpFB2File(("PPM_NestedModels_V1_Frame0" + i + ".ppm"));
}