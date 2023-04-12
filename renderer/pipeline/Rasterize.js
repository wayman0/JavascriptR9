<<<<<<< HEAD
import {RastLine, RastPoint, logPrimitive} from "./PipelineImport.js";
import {Model, LineSegment, Primitive, Point} from "../scene/SceneImport.js";
import { Viewport} from "../framebuffer/FramebufferImport.js";

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
=======
export var debug = false;
export var doAntiAliasing = false;
export var doGamma = true;
export var GAMMA = 2.2;

export default function rasterize(model, vp)
{
    for(const p of model.primitiveList)
    {
        logPrimitive("6. Rasterize", model, p);

        if(p instanceof LineSegment)
            Line.rasterize(model, p, vp);
        else if(p instanceof Point)
            Point.rasterize(model, p, vp);
        else
            console.log("Incorrect Primitive: " + p);
    }
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}