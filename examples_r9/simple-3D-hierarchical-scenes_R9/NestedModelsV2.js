/*

*/

import renderer.scene.*;
import renderer.scene.primitives.*;
import renderer.scene.util.DrawSceneGraph;
import renderer.scene.util.DrawSceneGraphTopologicalSort;
import renderer.scene.util.ModelShading;
import renderer.models_L.*;
import renderer.pipeline.*;
import renderer.framebuffer.*;

import java.awt.Color;

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
       RT     (triangle)    /     |     \
                           /      |      \
                          /       |       \
                  Position    Position   Position
                   /   \       /  |      /    /
                  /     \     /   |     /    /
             Matrix      \ Matrix |  Matrix /
               TR         \  TR   |    TR  /
                           \      |       /
                            \     |      /
                             \    |     /
                              \   |    /
                                Model
                              (sphere)
}</pre>
*/
public class NestedModels_v1a
{
   public static void main(String[] args)
   {
      // Create the Scene object that we shall render.
      final Scene scene = new Scene("NestedModels_v1a");

      // Create the top level Position.
      final Position top_p = new Position("top");

      // Add the top level Position to the Scene.
      scene.addPosition(top_p);

      // Create a Model for the top level position.
      final Model topModel = new Model("triangle");
      top_p.setModel(topModel);

      // Add a single triangle to the geometry of this model.
      final double sin2PIover3 = Math.sin(2*Math.PI/3);
      final Vertex v0 = new Vertex( 1,        0,       0);
      final Vertex v1 = new Vertex(-0.5,  sin2PIover3, 0);
      final Vertex v2 = new Vertex(-0.5, -sin2PIover3, 0);
      topModel.addVertex(v0, v1, v2);
      topModel.addPrimitive(new LineSegment(0, 1),
                            new LineSegment(1, 2),
                            new LineSegment(2, 0));
      ModelShading.setColor(topModel, Color.black);

      // Create three nested Positions each holding
      // a reference to a shared sphere Model.
      final Model sphere = new Sphere(0.5, 10, 10);
      ModelShading.setColor(sphere, Color.red);
      final Position p1 = new Position(sphere, "s1");
      final Position p2 = new Position(sphere, "s2");
      final Position p3 = new Position(sphere, "s3");

      // Put these three nested Positions into the top level Position.
      top_p.addNestedPosition(p1, p2, p3);

      // Place the three nested positions at the
      // corners of the top level position's triangle.
      p1.getMatrix().mult(Matrix.translate( 1.5,   0,               0));
      p2.getMatrix().mult(Matrix.translate(-0.75,  1.5*sin2PIover3, 0));
      p3.getMatrix().mult(Matrix.translate(-0.75, -1.5*sin2PIover3, 0));

      // Create a floor Model.
      final Model floor = new PanelXZ(-4, 4, -4, 4);
      ModelShading.setColor(floor, Color.black);
      final Position floor_p = new Position(floor);
      floor_p.getMatrix().mult(Matrix.translate(0, -4, 0));
      // Push this model away from where the camera is.
      floor_p.getMatrix().mult(Matrix.translate(0, 0, -5));
      // Add the floor to the Scene.
      scene.addPosition(floor_p);

      DrawSceneGraph.draw(scene, "SG_NestedModels_v1a");
      DrawSceneGraphTopologicalSort.draw(scene, "SG_NestedModels_v1a_TS");


      // Create a framebuffer to render our scene into.
      final int vp_width  = 1024;
      final int vp_height = 1024;
      final FrameBuffer fb = new FrameBuffer(vp_width, vp_height);

      //PipelineLogger.debug = true;

      for (int i = 0; i <= 72; ++i)
      {
         // Rotate each sphere WITHIN the scene.
         p1.getMatrix().mult(Matrix.rotateY(5));
         p2.getMatrix().mult(Matrix.rotateX(5));
         p3.getMatrix().mult(Matrix.rotateZ(5));

         // Translate and rotate the WHOLE scene.
         top_p.matrix2Identity();
         // Push the whole scene away from where the camera is.
         top_p.getMatrix().mult(Matrix.translate(0, 0, -5));
         // Rotate and translate the whole scene.
         top_p.getMatrix().mult(Matrix.rotateZ(5*i));
         top_p.getMatrix().mult(Matrix.translate(2, 0, 0));
//       top_p.getMatrix().mult(Matrix.rotateY(5*i));
//       top_p.getMatrix().mult(Matrix.rotateX(5*i));

         // Render
         fb.clearFB(java.awt.Color.lightGray);
         Pipeline.render(scene, fb);
         fb.dumpFB2File(String.format("PPM_NestedModels_v1a_Frame%02d.ppm", i));
      }
   }
}
