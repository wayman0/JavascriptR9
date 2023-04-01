import Color from "../color/Color.js";
import {LineSegment, Model, Vertex} from "../scene/SceneImport.js";

export default class Axes3D extends Model
{
    constructor(xMin = -1, xMax = 1, yMin = -1, yMax = -1, zMin = -1, zMax = 1, cX = Color.white, cY = Color.white, cZ = Color.white)
    {
        if( typeof xMin != "number" ||
            typeof xMax != "number" ||
            typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof zMin != "number" ||
            typeof zMax != "number")
                throw new Error("All parameters besides cX, cY, cZ must be numerical");

        if( cX instanceof Color == false ||
            cY instanceof Color == false ||
            cZ instanceof Color == false)
                throw new Error("Axis colors must be of Color type");
    
        const axes = Model.buildName("Axes 3D");

        axes.addVertex(new Vertex(xMin, 0, 0),
                        new Vertex(xMax, 0, 0),
                        new Vertex(0, yMin, 0),
                        new Vertex(0, yMax, 0),
                        new Vertex(0, 0, zMin),
                        new Vertex(0, 0, zMax));

        axes.addColor(cX, cY, cZ);
        axes.addPrimitive(LineSegment.buildVertexColor(0, 1, 0),
                          LineSegment.buildVertexColor(2, 3, 1),
                          LineSegment.buildVertexColor(4, 5, 2));
    }

    static buildDefaultAxes()
    {
        return new Axes3D();
    }

    static buildEvenSizedAxes(xVal, yVal, zVal)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal);
    }

    static build1ColorEvenSizedAxes(xVal, yVal, zVal, c)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal, c, c, c);
    }

    static build3ColorEvenSizedAxes(xVal, yVal, zVal, cx, cy, cz)
    {
        return new Axes3D(-xVal, xVal, -yVal, yVal, -zVal, zVal, cx, cy, cz);
    }

    static buildSizedAxes(xMin, xMax, yMin, yMax, zMin, zMax)
    {
        return new Axes3D(xMin, xMax, yMin, yMax, zMin, zMax);
    }

    static build1ColorSizedAxes(xMin, xMax, yMin, yMax, zMin, zMax, c)
    {
        return new Axes3D(xMin, xMax, yMin, yMax, zMin, zMax, c, c, c);
    }
}