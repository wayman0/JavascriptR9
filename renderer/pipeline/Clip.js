/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) geometric {@link Primitive} that sticks out
   of the camera's view rectangle in the image plane. Interpolate
   {@link Vertex} color from any clipped off {@link Vertex} to the
   new {@link Vertex}.
*/

//@ts-check
import {LineClip, PointClip, logPrimitive} from "./PipelineImport.js";
import {Model, Primitive, LineSegment, Point} from "../scene/SceneImport.js";

export var /**@type {boolean} whether to debug clipping */clipDebug = false;

/**
      Start with a {@link Model} that contains {@link Primitive}s
      that have been projected onto the camera's view plane,
      {@code z = -1}.
   <p>
      If a projected {@link Primitive} sticks out of the camera's
      view rectangle, then replace that {@link Primitive}, in the
      {@link Model}'s list of primitives, with one that has been
      clipped so that it is contained in the view rectangle.
   <p>
      If a projected {@link Primitive} is completely outside of
      the view rectangle, then drop that {@link Primitive} from
      the {@link Model}'s list of primitives.
   <p>
      Return a {@link Model} for which every {@link Primitive} is
      completely contained in the camera's view rectangle.

 * @param {Model} model the model containing the primitives to be clipped 
 * @returns {Model} a new model containing the clipped primitives
 */
export function clip(model)
{
    // have to do this way because new Array(model.colorList()) gives error
    // and can't just pass the color list itself
    const newColorList = new Array();
    for(let x = 0; x < model.colorList.length; x += 1)
        newColorList[x] = model.colorList[x];

    const model2 = new Model(model.vertexList, 
                            model.primitiveList,
                            newColorList,
                            model.name, 
                            model.visible);

    const newPrimitiveList = new Array();

    for(const p of model2.primitiveList)
    {
        logPrimitive("5. Clipping", model2, p);

        let pClipped = undefined;
        if(p instanceof LineSegment)
            pClipped = LineClip(model2, p);
        else
            //@ts-ignore
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
                    model2.visible);
}

/**
 * Set whether or not to debug clipping
 * @param {boolean} val the value to set clipDebug to be 
 */
export function setClipDebug(val)
{
    clipDebug = val;
}