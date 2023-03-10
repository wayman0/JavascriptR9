/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import Model from "../Model";

/**
   Convert a {@link Model} object into a point cloud {@link Model}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Point_cloud" target="_top">
                https://en.wikipedia.org/wiki/Point_cloud</a>
*/
export default class PointCloud 
{
    static make(model, pointSize = 0)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a model");

        if(typeof pointSize != Number)
            throw new Error("Point Size must be a number");

        pointCloud = new Model( new Array(model.getVertexList()),
                                new Array(), 
                                new Array(model.getColorList()),
                                "PointCloud: " + model.getName(),
                                model.visible);
                                
        vIndices = new Array(model.getVertexList().length);
        cIndices = new Array(model.getVertexList().length);

        for(let p of model.getPrimitiveList())
        {
            for(let i = 0; i < p.getVertexIndexList().length; i += 1)
            {
                vIndices[p.getVertexIndexList()[i]] = true;
                cIndices[p.getVertexIndexList()[i]] = p.getColorIndexList()[i];
            }
        }

        for(let i = 0; i < vIndices.length; i += 1)
        {
            if(vIndices[i])
                pointCloud.addPrimitive(new PointCloud(i, cIndices[i]));
        }

        for(let p of pointCloud.getPrimitiveList())
        {
            p.radius = pointSize;
        }

        return pointCloud; 
    }
}