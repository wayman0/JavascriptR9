import { LineSegment, Model, Vertex } from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export default class Dodecahedron extends Model
{
    constructor()
    {
        const dodeca = Model.buildName("Dodecahedron");

        const t = (1 + Math.sqrt(5))/2;   // golden ratio
        const r = 1/t;
        const r2 = r * r;

        dodeca.addVertex(new Vertex(-r, -r, -r),
                  new Vertex(-r, -r,  r),
                  new Vertex(-r,  r, -r),
                  new Vertex(-r,  r,  r),
                  new Vertex( r, -r, -r),
                  new Vertex( r, -r,  r),
                  new Vertex( r,  r, -r),
                  new Vertex( r,  r,  r));


        dodeca.addVertex(new Vertex( 0, -r2, -1),
                  new Vertex( 0, -r2,  1),
                  new Vertex( 0,  r2, -1),
                  new Vertex( 0,  r2,  1));


        dodeca.addVertex(new Vertex(-r2, -1,  0),
                  new Vertex(-r2,  1,  0),
                  new Vertex( r2, -1,  0),
                  new Vertex( r2,  1,  0));


        dodeca.addVertex(new Vertex(-1,  0, -r2),
                  new Vertex( 1,  0, -r2),
                  new Vertex(-1,  0,  r2),
                  new Vertex( 1,  0,  r2));

        dodeca.addPrimitive(LineSegment.buildVertex( 3, 11),
                  LineSegment.buildVertex(11,  7),
                  LineSegment.buildVertex( 7, 15),
                  LineSegment.buildVertex(15, 13),
                  LineSegment.buildVertex(13,  3));

     dodeca.addPrimitive(LineSegment.buildVertex( 7, 19),
                  LineSegment.buildVertex(19, 17),
                  LineSegment.buildVertex(17,  6),
                  LineSegment.buildVertex( 6, 15));

     dodeca.addPrimitive(LineSegment.buildVertex(17,  4),
                  LineSegment.buildVertex( 4,  8),
                  LineSegment.buildVertex( 8, 10),
                  LineSegment.buildVertex(10,  6));

     dodeca.addPrimitive(LineSegment.buildVertex( 8,  0),
                  LineSegment.buildVertex( 0, 16),
                  LineSegment.buildVertex(16,  2),
                  LineSegment.buildVertex( 2, 10));

     dodeca.addPrimitive(LineSegment.buildVertex( 0, 12),
                  LineSegment.buildVertex(12,  1),
                  LineSegment.buildVertex( 1, 18),
                  LineSegment.buildVertex(18, 16));

     dodeca.addPrimitive(LineSegment.buildVertex( 2, 13));

     dodeca.addPrimitive(LineSegment.buildVertex(18,  3));

     dodeca.addPrimitive(LineSegment.buildVertex( 1,  9),
                  LineSegment.buildVertex( 9, 11));

     dodeca.addPrimitive(LineSegment.buildVertex( 4, 14),
                  LineSegment.buildVertex(14, 12));

     dodeca.addPrimitive(LineSegment.buildVertex( 9,  5),
                  LineSegment.buildVertex( 5, 19));

     dodeca.addPrimitive(LineSegment.buildVertex( 5, 14));
    }
}