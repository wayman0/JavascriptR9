import * as Line from "./NearClip_Line.js";
import * as Point from "./NearClip_Point.js"

export var doNearClipping = true;
export var debug = false;

export function clip(model, camera)
{
    if(!doNearClipping)
        return model;

    const model2 = new model(model.vertexList, 
                            model.primitiveList,
                            new Array(model.colorList),
                            model.name, 
                            model.visible);

    const newPrimitiveList = new Array();

    for(const p of model2.primitiveList)
    {
        logPrimitive("3. Near_Clipping", model2, p);

        if(p instanceof LineSegment)
            pClipped = Line.clip(model2, p, camera);
        else
            pClipped = Point.clip(model2, p, camera);

        if(pClipped != undefined)
        {
            newPrimitiveList.push(pClipped);
            logPrimitive("3. Near_Clipped (accept)", model2, pClipped);
        }
        else
        {
            logPrimitive("3. Near_Clipped (reject)", model2, p);
        }
    }

    return new model(model2.vertexList, 
                    newPrimitiveList, 
                    model2.colorList,
                    model2.name,
                    model2.visibe);
}