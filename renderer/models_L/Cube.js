import { LineSegment, Model, Vertex } from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export default class Cube extends Model
{
    constructor()
    {
        const cube = Model.buildName("Cube");

        cube.addVertex( new Vertex(-1, -1, -1), // 4 vertices around the bottom face
                        new Vertex( 1, -1, -1),
                        new Vertex( 1, -1,  1),
                        new Vertex(-1, -1,  1),
                        new Vertex(-1,  1, -1), // 4 vertices around the top face
                        new Vertex( 1,  1, -1),
                        new Vertex( 1,  1,  1),
                        new Vertex(-1,  1,  1));

      // Create 12 line segments.
        cube.addPrimitive( new LineSegment(0, 1),  // bottom face
                           new LineSegment(1, 2),
                           new LineSegment(2, 3),
                           new LineSegment(3, 0),
                           new LineSegment(4, 5),  // top face
                           new LineSegment(5, 6),
                           new LineSegment(6, 7),
                           new LineSegment(7, 4),
                           new LineSegment(0, 4),  // back face
                           new LineSegment(1, 5),
                           new LineSegment(2, 6),  // front face
                           new LineSegment(3, 7));
    }
}