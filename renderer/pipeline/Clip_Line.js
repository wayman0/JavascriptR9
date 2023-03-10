import {clipDebug, logMessage} from "./PipelineImport.js";
import {Model, Vertex, LineSegment} from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export default function clip(model, ls)
{
    const vIndex0 = ls.vIndexList[0];
    const vIndex1 = ls.vIndexList[1];
    const v0 = model.vertexList[vIndex0];
    const v1 = model.vertexList[vIndex1];

    const x0 = v0.x, y0 = v0.y;
    const x1 = v1.x, y1 = v1.y;

    if(! ( Math.abs(x0) > 1
        || Math.abs(y0) > 1
        || Math.abs(x1) > 1
        || Math.abs(y1) > 1) )
    {
        if(clipDebug)
            logMessage("-- Trivial accept.");

        return ls;
    }
    else if( (x0 >  1 && x1 >  1) ||
             (x0 < -1 && x1 < -1) ||
             (y0 >  1 && y1 >  1) ||
             (y0 < -1 && y1 < -1))
    {
        if(clipDebug)
            logMessage("-- Trivial delete.");

        return undefined;
    }
    else
        return clip(model, clipOneTime(model, ls));
}

clipOneTime(model, ls)
{
    const vIndex0 = ls.vertexIndexList[0];
    const vIndex1 = ls.vertexIndexList[1];
    const vertex0 = model.vertexList[vIndex0];
    const vertex1 = model.vertexList[vIndex1];

    const x0 = vertex0.x, y0 = vertex0.y;
    const x1 = vertex1.x, y1 = vertex1.y;

    equation = "";
    vOutside;
    vOx; vOy;
    vIx; vIy;
    t;
    x;
    y;
    vIndexNew;

    if(x0 > 1)
    {
        equation = "x = +1";
        vOutside = 0;
        vOx = x0; vOy = y0;
        vIx = x1; vIy = y1;

        t = (1-vOx) / (vIx - vOx);
        x = 1;
        y = (1-t) * vOy + t * vIy;
    }
    else if(x1 > 1)
    {
        equation = "x = +1";
        vOutside = 1;
        vIx = x0; vIy = y1;

        t = (1-vOx) / (vIx - vOx);
        x = 1;
        y = (1-t) * vOy + t * vIy;
    }
    else if (x0 < -1)
    {
        equation = "x = -1";
        vOutside = 0;
        vOx = x0; vOy = y0;
        vIx = x1; vIy = y1;

        t = (-1 - vOx) / (vIx - vOx);
        x = -1;
        y = (1-t) * vOy + t * vIy;
    }
    else if(x1 < -1)
    {
        equation = "x = -1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;

        t = (-1 - vOx) / (vIx - vOx);
        x = -1;  // prevent rounding errors
        y = (1 - t) * vOy + t * vIy;
    }
    else if (y0 > 1)  // ls crosses the line y = 1
    {
        equation = "y = +1";
        vOutside = 0;
        vOx = x0;  vOy = y0;
        vIx = x1;  vIy = y1;
    
        t = (1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = 1;  // prevent rounding errors
    }
    else if (y1 > 1)  // ls crosses the line y = 1
    {
        equation = "y = +1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;
    
        t = (1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = 1;  // prevent rounding errors
    }
    else if (y0 < -1)  // ls crosses the line y = -1
    {
        equation = "y = -1";
        vOutside = 0;
        vOx = x0;  vOy = y0;
        vIx = x1;  vIy = y1;
    
        t = (-1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = -1;  // prevent rounding errors
    }
    else // if (y1 < -1)  // ls crosses the line y = -1
    {
        equation = "y = -1";
        vOutside = 1;
        vIx = x0;  vIy = y0;
        vOx = x1;  vOy = y1;
    
        t = (-1 - vOy) / (vIy - vOy);
        x = (1 - t) * vOx + t * vIx;
        y = -1;  // prevent rounding errors
    }

    newVertex = new Vertex(x, y, 0);
    vIndexNew = model.vertexList.length;
    model.addVertex(newVertex);

    cIndexI = ls.colorIndexList[1-vOutside];
    cIndexO = ls.colorIndexList[vOutside];
    cI = model.colorList[cIndexI].getRGBColorComponents();
    cO = model.colorList[cIndexO].getRGBColorComponents();

        // since t is already a float we dont need to cast it
    if(t > 1)
        t_ = 1/t;
    else
        t_ = t;

    // this looks like blending code, 
    // can we just use a blend function in
    // the color class?
    r = (1-t_) * c0[0] + t_ * cI[0];
    g = (1-t_) * c0[1] + t_ * cI[1];
    b = (1-t_) * c0[2] + t_ * cI[2];

    newColor = new Color(r, g, b);
    cIndexNew = model.colorList.length;
    model.addColor(newColor);
        
    if(clipDebug)
    {
        if(0 == vOutside)
            vOut = "v0";
        else
            vOut = "v1";
        
        logMessage("--Clip off " + vOut + " at " + equation);
        logMessage("-- t = " + t);
        logMessage("-- <x_i, y_i> = <" + vIx + ", " + vIy + ">");
        logMessage("-- <x_o, y_o> = <" + vOx + ", " + vIy + ">");
        logMessage("-- <x_c, y_c> = <" + x   + ", " + y   + ">");
        logMessage("-- <r_i, g_i, b_i> = <" + 
                                        cI[0] + ", " + cI[1] + ", " + cI[2] + ">");
        logMessage("-- <r_o, g_o, b_o> = <" + 
                                        cO[0] + ", " + cO[1] + ", " + cO[2] + ">");
        logMessage("-- <r_c, g_c, b_c> = <" + 
                                            r + ", " + g + ", " + b + ">");

    }

    if(1 == vOutside)
            newLS = new LineSegment(vIndex0, vIndexNew,
                                    cIndexI, cIndexNew);
    else
            newLS = new LineSegment(vIndexNew, vIndex1, 
                                    cIndexNew, cIndexI);

    return newLS;
}