import * as Line from "./Clip_Line.js";
import * as Point from "./Clip_Point.js"

export var debug = false;

export default function clip(model)
{
    const model2 = new model(model.vertexList, 
                            model.primitiveList,
                            new Array(model.colorList),
                            model.name, 
                            model.visible);

    const newPrimitiveList = new Array();

    for(const p of model2.primitiveList)
    {
        logPrimitive("5. Clipping", model2, p);

        if(p instanceof LineSegment)
            pClipped = Line.clip(model2, p);
        else
            pClipped = Point.clip(model2, p);

        if(pClipped != undefined)
        {
            newPrimitiveList.push(pClipped);
            logPrimitive("5. Clipped (accept)", model2, pClipped);
        }
        else
        {
            logPrimitive("5. Clipped (reject)", model2, p);
        }
    }

    return new model(model2.vertexList, 
                    newPrimitiveList, 
                    model2.colorList,
                    model2.name,
                    model2.visibe);
}