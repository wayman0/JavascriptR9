<<<<<<< HEAD
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link Point} that might stick out
   of the camera's view rectangle in the image plane.
*/

export default class Clip_Point
{
    static clip(model, pt)
    {
        result = undefined;
        vIndex = pt.getVertexIndexList()[0];
        v = model.getVertexList()[vIndex];

        x = v.x; y = v.y;

        if(! (Math.abs(x) > 1 ||
              Math.abs(y) > 1))
        {
            result = pt;
        }

        return result;
    }
=======
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link Point} that might stick out
   of the camera's view rectangle in the image plane.
*/

export default class Clip_Point
{
    static clip(model, pt)
    {
        result = undefined;
        vIndex = pt.getVertexIndexList()[0];
        v = model.getVertexList()[vIndex];

        x = v.x; y = v.y;

        if(! (Math.abs(x) > 1 ||
              Math.abs(y) > 1))
        {
            result = pt;
        }

        return result;
    }
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}