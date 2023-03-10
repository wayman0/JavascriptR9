import {RastLine, RastPoint, logPrimitive} from "./PipelineImport.js";

export var rastDebug = false;
export var doAntiAliasing = false;
export var doGamma = true;
export var GAMMA = 2.2;

export function rasterize(model, vp)
{
    for(const p of model.primitiveList)
    {
        logPrimitive("6. Rasterize", model, p);

        if(p instanceof LineSegment)
            RastLine(model, p, vp);
        else if(p instanceof Point)
            RastPoint(model, p, vp);
        else
            console.log("Incorrect Primitive: " + p);

            
    }
}