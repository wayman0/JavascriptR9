import { LineSegment, Model, Vertex } from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export default class Axes2D extends Model
{
    constructor(xMin = -1, xMax = 1, yMin = -1, yMax = 1, xMarks = 5, yMarks = 5, cX = Color.White, cY = Color.white, z = 0)
    {
        if( typeof xMin != "number" ||
            typeof xMax != "number" ||
            typeof yMin != "number" ||
            typeof yMax != "number" ||
            typeof xMarks != "number" ||
            typeof yMarks != "number" ||
            typeof z != "number")
                throw new Error("All Parameters besides cX and cY must be numerical");

        if( cX instanceof Color == false || 
            cY instanceof Color == false)
                throw new Error("axis color must be a Color");
        
        const axes = Model.buildName("Axes 2D");

        axes.addColor(cX, cY);
        axes.addVertex(new Vertex(xMin, 0, z),
                        new Vertex(xMax, 0, z));
        axes.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

        axes.addVertex(new Vertex(0, yMin, z),
                        new Vertex(0, yMax, z));
        axes.addPrimitive(LineSegment.buildVertexColor(2, 3, 1));

        let index = 4;

        let xDelta = (xMax - yMin)/xMarks;
        let yDelta = (yMax - yMin)/50;

        for(let x = xMin; x <= xMax; x += xDelta)
        {
            axes.addVertex(new Vertex(x, yDelta/2, z),
                            new Vertex(x, -yDelta/2, z));
            axes.addPrimitive(LineSegment.buildVertexColor(index + 0, index + 1, 0));
            index += 2;            
        }

        xDelta = (xMax - yMin)/50;
        yDelta = (yMax - yMin)/yMarks;
        for(let y = yMin; y <= yMax; y += yDelta)
        {
            axes.addVertex(new Vertex(xDelta/2, y, z),
                            new Vertex(-xDelta/2, y, z));
            axes.addPrimitive(LineSegment.buildVertexColor(index + 0, index + 1, 1));
            index += 2;
        }
    }

    static buildDefaultAxes()
    {
        return new Axes2D();
    }

    static buildSizedAxes(xMin, xMax, yMin, yMax)
    {
        return new Axes2D(xMin, xMax, yMin, yMax);
    }

    static buildSpacedAxes(xMin, xMax, yMin, yMax, xMarks, yMarks)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks);
    }

    static buildColorAxes(xMin, xMax, yMin, yMax, xMarks, yMarks, c)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks, c, c);
    }

    static buildColorAxes(xMin, xMax, yMin, yMax, xMarks, yMarks, cX, cY)
    {
        return new Axes2D(xMin, xMax, yMin, yMax, xMarks, yMarks, cX, cY);
    }
}