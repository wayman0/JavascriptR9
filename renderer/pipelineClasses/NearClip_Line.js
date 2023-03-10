/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link LineSegment} that crosses the
   camera's near clipping plane {@code z = -near}.  Interpolate
   {@link Vertex} color from any clipped off {@link Vertex} to
   the new {@link Vertex}.
<p>
   This clipping algorithm is a simplification of the Liang-Barsky
   Parametric Line Clipping algorithm.
*/

export default class NearClip_Line
{
    static clip(model, ls, camera)
    {
        n = camera.n;
        vIndex0 = ls.getVertexIndexList()[0];
        vIndex1 = ls.getVertexIndexList()[1];
        v0 = model.getVertexList()[vIndex0];
        v1 = model.getVertexList()[vIndex1];

        z0 = v0.z;
        z1 = v1.z;

        if(z0 <= n && z1 <= n)
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Near_Clip: Trivial Accept.");

            return ls;
        }
        else if(z0 > n && z1 > n)
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Near_Clip: Trivial delet.");

            return undefined;
        }
        else
            return NearClip_Line.#interpolateNewVertex(model, ls, n);
    }

    static #interpolateNewVertex(model, ls, n)
    {
        vIndex0 = ls.getVertexIndexList()[0];
        v0 = model.getVertexList()[vIndex0];
        v0x = v0.x;
        v0y = v0.y;
        v0z = v0.z;
        cIndex0 = ls.getColorIndexList()[0];
        c0 = model.getColorList()[cIndex0].getRGBColorComponents();

        vIndex1 = ls.getVertexIndexList()[1];
        v1 = model.getVertexList()[vIndex1];
        v1x = v1.x;
        v1y = v1.y;
        v1z = v1.z;
        cIndex1 = ls.getColorIndexList()[1];
        c1 = model.getColorList()[cIndex1].getRGBColorComponents();
        
        t = (n-v1z)/(v0z-v1z);

        x = (1-t) * v1x + t * v0x;
        y = (1-t) * v1y + t * v0y;
        z = n;

        if(t > 1)
            t_ = 1/t;
        else 
            t_ = t;

        r = (1-t_) * c1[0] + t_ * c0[0];
        g = (1-t_) * c1[1] + t_ * c0[1];
        b = (1-t_) * c1[2] + t_ * c0[2];
        
        newVertex = new Vertex(x, y, z);
        vIndexNew = model.getVertexList().length;
        model.addVertex(newVertex);

        newColor = new Color(r, g, b);
        cIndexNew = model.getColorList().length;
        model.addColor(newColor);

        vNearIndex;

        if(v0z > n)
            vNearIndex = 0;
        else    
            vNearIndex = 1;

        if(Clip.debug)
        {
            vClipped = (0==vNearIndex) ? "v0" : "v1";
            PipelineLogger.logMessage("-- Clip off " + vClipped + " at z= " + n);
            PipelineLogger.logMessage("--t = " + t);
            PipelineLogger.logMessage("-- <x0, y0, z0> = <" + v0x + ", " + v0y + ", " + v0z + ">");
            PipelineLogger.logMessage("-- <x1, y1, z1> = <" + v1x + ", " + v1y + ", " + v1z + ">")
            PipelineLogger.logMessage("-- <x,  y,  z> = <" + x + ",  " + y + ",  " + z + ">");
            PipelineLogger.logMessage("-- <r0, g0, b0> = <" + c0[0] + ", " + c0[1] + ", " + c0[2] + ">");
            PipelineLogger.logMessage("-- <r1, g1, b1> = <" + c1[0] + ", " + c1[1] + ", " + c1[2] + ">");
            PipelineLogger.logMessage("-- <r,  g,  b> = <" + r + ",  " + g + ",  " + b + ">");
        }

        result = undefined;
        if(0 == vNearIndex)
            result = new LineSegment(vIndexNew, vIndex1, cIndexNew, cIndex1);
        else
            result = new LineSegment(vIndex0, vIndexNew, cIndex0, cIndexNew);
        
        return result;
    }
}