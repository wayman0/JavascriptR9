/*

*/

import renderer.scene.*;
import renderer.scene.util.DrawSceneGraph;
import renderer.scene.util.DrawSceneGraphTopologicalSort;
import renderer.scene.util.ModelShading;
import renderer.models_L.*;
import renderer.pipeline.*;
import renderer.framebuffer.*;

import java.awt.Color;

/**
   Here is a sketch of this program's scene graph.
   Only the TriangularPrism model holds any geometry.
   All of the other nodes hold only a matrix.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     |     \
       Matrix    Model    List<Position>
         R      (empty)       /    \
                             /      \
                       Position    Position
                       /     \     /     \
                      /       \   /       \
                Matrix       Position      Matrix
                  I         /    |    \     RTR
                           /     |     \
                     Matrix    Model    List<Position>
                       I      (empty)     / |  | \
                                         /  |  |  \
                                       p1  p2  p3  p4
                                         \  |  |  /
                                          \ |  | /
                                       TriangularPrism
}</pre>
*/
public class NestedPrisms_v3
{
   public static void main(String[] args)
   {
      final double sqrt3 = Math.sqrt(3.0);

      // Create the Scene object that we shall render.
      final Scene scene = new Scene("Prisms_v3");

      // Create the top level Position.
      final Position top_p = new Position("top");

      // Add the top level Position to the Scene.
      scene.addPosition(top_p);

      // Create two "linked" copies of the graph defined below.
      final Position link1_p = new Position("link_1");
      final Position link2_p = new Position("link_2");
      link2_p.getMatrix().mult(Matrix.rotateZ(180))
                         .mult(Matrix.translate(-2, 0, 0))
                         .mult(Matrix.rotateX(90));
      top_p.addNestedPosition(link1_p, link2_p);

      // Create a Position that holds one copy of the four combined prisms.
      final Position fourPrisms_p = new Position("fourPrisms");

      // Add it to each of the linked positions.
      link1_p.addNestedPosition(fourPrisms_p);
      link2_p.addNestedPosition(fourPrisms_p);

      // Create four nested Positions each holding
      // a reference to a shared prism Model.
      final Model prism = new TriangularPrism(1.0/sqrt3, 2.0, Math.PI/4.0, 25);
      ModelShading.setColor(prism, Color.magenta);
      final Position p1 = new Position(prism, "p1");
      final Position p2 = new Position(prism, "p2");
      final Position p3 = new Position(prism, "p3");
      final Position p4 = new Position(prism, "p4");

      // Put these four nested Positions into the four-prism Position.
      fourPrisms_p.addNestedPosition(p1, p2, p3, p4);

      // Place the four nested positions within
      // the four-prism position.
      // right
      p1.getMatrix().mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
      // left
      p2.getMatrix().mult(Matrix.translate(-2-0.5/sqrt3, 0, 0))
                    .mult(Matrix.rotateZ(180));
      // top
      p3.getMatrix().mult(Matrix.rotateZ(90))
                    .mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
      // bottom
      p4.getMatrix().mult(Matrix.rotateZ(-90))
                    .mult(Matrix.translate(2+0.5/sqrt3, 0, 0));

      // Create a floor Model.
      final Model floor = new PanelXZ(-4, 4, -4, 4);
      ModelShading.setColor(floor, Color.black);
      final Position floor_p = new Position(floor);
      floor_p.getMatrix().mult(Matrix.translate(0, -4, 0));
      // Push this model away from where the camera is.
      floor_p.getMatrix().mult(Matrix.translate(0, 0, -5));
      // Add the floor to the Scene.
      scene.addPosition(floor_p);

      DrawSceneGraph.draw(scene, "SG_NestedPrisms_v3");
      DrawSceneGraphTopologicalSort.draw(scene, "SG_NestedPrisms_v3_TS");


      // Create a framebuffer to render our scene into.
      final int vp_width  = 1024;
      final int vp_height = 1024;
      final FrameBuffer fb = new FrameBuffer(vp_width, vp_height);
      // Give the framebuffer a nice background color.
      fb.clearFB(Color.lightGray);

      //PipelineLogger.debug = true;

      // Spin the model 360 degrees arond two axes.
      for (int i = 0; i <= 180; ++i)
      {
         // Push the model away from where the camera is.
         top_p.matrix2Identity()
              .mult(Matrix.translate(0, 0, -8))
              .mult(Matrix.rotateX(2*i))
              .mult(Matrix.rotateY(2*i))
              .mult(Matrix.rotateZ(2*i));

         // Rotate opposite sides of each link.
         p2.getMatrix().mult(Matrix.rotateX(1));  // left side

         // Render again.
         fb.clearFB(Color.lightGray);
         Pipeline.render(scene, fb);
         fb.dumpFB2File(String.format("PPM_NestedPrism_v3_Frame_%03d.ppm", i));
      }
   }
}
