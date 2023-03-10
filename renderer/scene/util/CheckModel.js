/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Several static utility methods for checking
   and/or debugging a {@link Model}.
*/

export default class CheckModel
{
    static check(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model is not a Model");
        
        error = false;

        if(model.getVertexList().length == 0 && model.getPrimitiveList().length != 0)
        {   
            console.log("***WARNING: This model does not have any vertices.");
            error = true;
        }
        
        if(model.getVertexList().length != 0 && model.getPrimitiveList().length == 0)
        {
            console.log("***WARNING: This model does not have any primitives");
            error = true;
        }

        if(model.getVertexList().length != 0 && model.getColorList().length == 0)
        {
            console.log("***WARNING: This model does not have any colors.");
            error = true;
        }

        if(error)
            console.log(model);
    }

    static checkPrimitives(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a Model");

        const numberOfVertices = model.getVertexList().length;
        result = true;
        
        for(let p of model.getPrimitiveList())
        {
            for(let i = 0; i < p.getVertexIndexList().length; ++i)
            {
                if(i >= numberOfVertices)
                {
                    console.log("This Primitve has invalid Vertex index: " + i);
                    console.log(p);
                    result = false;
                }
            }
        }

        const numberOfColors = model.getColorList().length;
        for(p of model.getPrimitiveList())
        {
            for(i = 0; i < p.getColorIndexList().length; ++ i)
            {
                if(i >= numberOfColors)
                {
                    console.log("This Primitve has invalid Color index: " + i);
                    console.log(p);
                    result = false;
                }
            }
        }
        
        return result;
    }

    // should we make a constructor and then create a private instantiable boolean
    // like in Matrix or just not make a constructor?
}