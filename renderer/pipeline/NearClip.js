import {NearLine, NearPoint, logPrimitive} from "./PipelineImport.js";
import {Camera, Model, Primitive, LineSegment, Point} from "../scene/SceneImport.js";

export var doNearClipping = true;
export var nearDebug = false;

export function clip(model, camera)
{
    if(!doNearClipping)
        return model;

    const model2 = new Model(model.vertexList(), 
                            model.primitiveList(),
                            new Array(model.colorList()),
                            model.name(), 
                            model.visible);

    const newPrimitiveList = new Array();

    for(const p of model2.primitiveList())
    {
        logPrimitive("3. Near_Clipping", model2, p);

        if(p instanceof LineSegment)
            pClipped = NearLine(model2, p, camera);
        else
            pClipped = NearPoint(model2, p, camera);

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

    return new Model(model2.vertexList(), 
                    newPrimitiveList, 
                    model2.colorList(),
                    model2.name(),
                    model2.visibe);
}

export function setDoNearClipping(val)
{
    doNearClipping = val;
}

export function setNearDebug(val)
{
    nearDebug = val;
}
