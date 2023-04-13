import {LineClip, PointClip, logPrimitive} from "./PipelineImport.js";
import {Model, Primitive, LineSegment, Point} from "../scene/SceneImport.js";

export var clipDebug = false;

export function clip(model)
{
    const model2 = new Model(model.vertexList, 
                            model.primitiveList,
                            new Array(model.colorList),
                            model.name, 
                            model.visible);

    const newPrimitiveList = new Array();

    for(const p of model2.primitiveList)
    {
        logPrimitive("5. Clipping", model2, p);

        if(p instanceof LineSegment)
            pClipped = LineClip(model2, p);
        else
            pClipped = PointClip(model2, p);

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

    return new Model(model2.vertexList, 
                    newPrimitiveList, 
                    model2.colorList,
                    model2.name,
                    model2.visibe);
}