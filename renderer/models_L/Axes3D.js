import Color from "../color/Color.js";
import {LineSegment, Model, Vector, Vertex} from "../scene/SceneImport.js";

export default class Axes3D extends Model
{
    constructor(xMin = -1, xMax = 1, yMin = -1, yMax = -1, zMin = -1, zMax = 1, cX = Color.white, cY = Color.white, cZ = Color.white)
    {
        if( typeof xMin != Number ||
            typeof xMax != Number ||
            typeof yMin != Number ||
            typeof yMax != Number ||
            typeof zMin != Number ||
            typeof zMax != Number)
                throw new Error("All parameters besides cX, cY, cZ must be numerical");

        if( cX instanceof Color == false ||
            cY instanceof Color == false ||
            cZ instanceof Color == false)
                throw new Error("Axis colors must be of Color type");
    
        Model.buildName("Axes 3D");

        this.addVertex(new Vertex(xMin, 0, 0),
                        new Vertex(xMax, 0, 0),
                        new Vertex(0, yMin, 0),
                        new Vertex(0, yMax, 0),
                        new Vertex(0, 0, zMin),
                        new Vertex(0, 0, zMax));

        this.addColor(cX, cY, cZ);
        this.addPrimitive(new LineSegment(0, 1, 0),
                            new LineSegment(2, 3, 1),
                            new LineSegment(4, 5, 2));
    }
}