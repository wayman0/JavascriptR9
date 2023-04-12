<<<<<<< HEAD
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Transform each {@link Vertex} of a {@link Model} from the model's
   (private) local coordinate system to the {@link Camera}'s (shared)
   view coordinate system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use the
   current model-to-view transformation {@link Matrix} to transform the
   object's {@code Vertex} coordinates from the model's coordinate
   system to the camera's view coordinate system.
*/
export default class Model2View
{
    static model2view(position, ctm)
    {
        model = position.getModel();

        newVertexList = new Array(model.getVertexList().length);
        for(v of model.getVertexList())
            newVertexList.push(ctm.times(v));
        
        return new Model(newVertexList, 
                         model.getPrimitiveList(),
                         model.getColorList(),
                         position.getName() + "::" + model.getName(),
                         model.visible);
    }
=======
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Transform each {@link Vertex} of a {@link Model} from the model's
   (private) local coordinate system to the {@link Camera}'s (shared)
   view coordinate system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use the
   current model-to-view transformation {@link Matrix} to transform the
   object's {@code Vertex} coordinates from the model's coordinate
   system to the camera's view coordinate system.
*/
export default class Model2View
{
    static model2view(position, ctm)
    {
        model = position.getModel();

        newVertexList = new Array(model.getVertexList().length);
        for(v of model.getVertexList())
            newVertexList.push(ctm.times(v));
        
        return new Model(newVertexList, 
                         model.getPrimitiveList(),
                         model.getColorList(),
                         position.getName() + "::" + model.getName(),
                         model.visible);
    }
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}