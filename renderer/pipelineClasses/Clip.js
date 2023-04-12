<<<<<<< HEAD
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

export default class Clip
{
    static debug = false;

    static clip(model)
    {
        if(model == undefined)
            throw new Error("Cannot clip a Model that is undefined");

        model2 = new model(model.getVertexList(),
                            model.getPrimitiveList(),
                            model.getColorList(),
                            model.getName(),
                            model.visible);
    
        newPrimitiveList = new Array();

        for(let p of model2.getPrimitiveList())
        {
            PipelineLogger.logPrimitive("5. Clipping", model2, p);

            p_clipped = undefined;

            if(p instanceof LineSegment)
                p_clipped = Clip_Line.clip(model2, p);
            else
                p_clipped = Clip_Point.clip(model2, p);

            if(p_clipped != undefined)
            {
                newPrimitiveList.add(p_clipped);
                PipelineLogger.logPrimitive("5. Clipped (accept)", model2, p_clipped);
            }
            else
                PipelineLogger.logPrimitive("5. Clipped (reject)", model2, p);
        }

        return new model(model2.getVertexList(),
                         newPrimitiveList, 
                         model2.getColorList(),
                         model2.getName(),
                         model2.visible);
    }

    
=======
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

export default class Clip
{
    static debug = false;

    static clip(model)
    {
        if(model == undefined)
            throw new Error("Cannot clip a Model that is undefined");

        model2 = new model(model.getVertexList(),
                            model.getPrimitiveList(),
                            model.getColorList(),
                            model.getName(),
                            model.visible);
    
        newPrimitiveList = new Array();

        for(let p of model2.getPrimitiveList())
        {
            PipelineLogger.logPrimitive("5. Clipping", model2, p);

            p_clipped = undefined;

            if(p instanceof LineSegment)
                p_clipped = Clip_Line.clip(model2, p);
            else
                p_clipped = Clip_Point.clip(model2, p);

            if(p_clipped != undefined)
            {
                newPrimitiveList.add(p_clipped);
                PipelineLogger.logPrimitive("5. Clipped (accept)", model2, p_clipped);
            }
            else
                PipelineLogger.logPrimitive("5. Clipped (reject)", model2, p);
        }

        return new model(model2.getVertexList(),
                         newPrimitiveList, 
                         model2.getColorList(),
                         model2.getName(),
                         model2.visible);
    }

    
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}