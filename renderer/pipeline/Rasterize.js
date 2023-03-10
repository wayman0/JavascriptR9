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
}