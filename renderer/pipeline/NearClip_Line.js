import {nearDebug, logMessage} from "./PipelineImport.js";

export default function clip(model, ls, camera)
{
    const n = camera.n;
    const vInd0 = ls.vIndexList[0];
    const vInd1 = ls.vIndexList[1];
    const v0 = model.vertexList[vInd0];
    const v1 = model.vertexList[vInd1];
    const z0 = v0.z;
    const z1 = v1.z;

    if(z0 <= n && z1 <= n)
    {
        if(nearDebug)
           logMessage("-- Near_Clip: Trivial accept.");
           
        return ls;
    }
    else if(z0 > n && z1 > n)
    {
        if(nearDebug)
            logMessage("-- Near_Clip: Trivial delete");

        return undefined;
    }
    else
        return interpolateNewVertex(model, ls, n);
}

interpolateNewVertex(model, ls, n)
{
    const vInd0 = ls.vIndexList[0];
    const v0 = model.vertexList[vInd0];
    const v0x = v0.x;
    const v0y = v0.y;
    const v0z = v0.z;
    const cInd0 = ls.cIndexList[0];
    const c0 = model.colorList[cInd0].getRGBColorComponents();

    const vInd1 = ls.vIndexList[1];
    const v1 = model.vertexList[vInd1];
    const v1x = v1.x;
    const v1y = v1.y;
    const v1z = v1.z;
    const cInd1 = ls.cIndexList[1];
    const c1 = model.colorList[cInd1].getRGBColorComponents();

    const t = (n-v1z)/(v0z-v1z);
    
    const x = (1-t) * v1x + t * v0x;
    const y = (1-t) * v1y + t * v0y;
    const z = n;

    t_ = undefined;

    if(t > 1)
        t_ = 1/t;
    else
        t_ = t;

    // can we just use blend function in color?
    const r = (1-t_) * c1[0] + t_ * c0[0];
    const g = (1-t_) * c1[1] + t_ * c0[1];
    const b = (1-t_) * c1[2] + t_ * c0[2];
    
    const newVertex = new Vertex(x, y, z);
    const vIndexNew = model.vertexList.length;
    model.vertexList.push(newVertex);

    const newColor = new Color(r, g, b);
    const cIndexNew = model.colorList.length;
    model.colorList.push(newColor);

    if(v0z > n)
        vNearIndex = 0;
    else
        vNearIndex = 1;

    if(nearDebug)
    {
        const vClipped = (0 == vNearIndex) ? "v0" : "v1";

        logMessage(("-- Clip off %s at z=%.3f",
                                        vClipped, n));
        logMessage(("-- t = %.25f", t));
        logMessage(("-- <x0, y0, z0> = <% .8f, % .8f, % .8f",
                                    v0x, v0y, v0z));
        logMessage(("-- <x1, y1, z1> = <% .8f, % .8f, % .8f",
                                       v1x, v1y, v1z));
        logMessage(("-- <x,  y,  z>  = <% .8f, % .8f, % .8f",
                                      x,  y,  z));
        logMessage(("-- <r0, g0, b0> = <%.8f, %.8f, %.8f>",
                                       c0[0], c0[1], c0[2]));
        logMessage(("-- <r1, g1, b1> = <%.8f, %.8f, %.8f>",
                                       c1[0], c1[1], c1[2]));
        logMessage(("-- <r,  g,  b>  = <%.8f, %.8f, %.8f>",
                                       r,  g,  b));
    }
        const result = undefined;

        if(0 == vNearIndex)
            result = new LineSegment(vIndexNew, vIndex1, cIndexNew, cIndex1)
        else
            result = new LineSegment(vIndex0, vIndexNew, cIndex0, cIndexNew);

        return result;
}