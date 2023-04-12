<<<<<<< HEAD
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Point} that crosses the
   camera's near clipping plane {@code z = -near}.
*/

export default class NearClip_Point
{
    static clip(model, pt, camera)
    {
        result = undefined;

        vIndex = pt.getVertexIndexList()[0];
        v = model.getVertexList()[vIndex];
        z = v.z;

        if(z <= camera.n)
            result = pt;

        return result;        
    }
=======
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip in camera space any {@link Point} that crosses the
   camera's near clipping plane {@code z = -near}.
*/

export default class NearClip_Point
{
    static clip(model, pt, camera)
    {
        result = undefined;

        vIndex = pt.getVertexIndexList()[0];
        v = model.getVertexList()[vIndex];
        z = v.z;

        if(z <= camera.n)
            result = pt;

        return result;        
    }
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}