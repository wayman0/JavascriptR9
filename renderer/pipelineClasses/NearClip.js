/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Primitive} that crosses
   the camera's near clipping plane {@code z = -near}.
*/
export default class NearClip
{
    static donearClipping = true;
    static debug = false;

    static clip(model, camera)
    {
        if(!doNearClipping)
            return model;

        model2 = new model( model.getVertexList(),
                            model.getPrimitiveList(),
                            new Array(model.getColorList()),
                            model.getName(),
                            model.visible);
        
        newPrimitiveList = new Array();
        for(p of model2.getPrimitiveList())
        {
            PipelineLogger.logPrimitive("3. Near_Clipping", model2, p);

            p_clipped = undefined;
            if(p instanceof LineSegment)
                p_clipped = NearCLip_Line.clip(model2, p, camera);
            else
                p_clipped = NearClip_Point.clip(model2, p, camera);

            if(p_clipped != undefined)
            {
                newPrimitiveList.push(p_clipped);
                PipelineLogger.logPrimitive("3. Near_Clipped (accept)", model2, p_clipped);
            }
            else
            {
                PipelineLogger.logPrimitive("3. Near_Clipped (reject)", model2, p);
            }

            return new model(model2.getVertexList(),
                                newPrimitiveList,
                                model2.getColorList(),
                                model2.getName(),
                                model2.visible);
        }
    }
}