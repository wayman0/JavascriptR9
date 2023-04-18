import {Model, Position, Matrix, Vertex} from "../scene/SceneImport.js";

export default function model2view(position, ctm)
{
    const model = position.model();
    let newVertexList = new Array();

    for(let x = 0; x < model.vertexList().length; x += 1)
        newVertexList[x] = ctm.timesVertex(model.vertexList()[x]);

    return new Model(newVertexList, 
                    model.primitiveList(), 
                    model.colorList(), 
                    position.name() + "::" + model.name(), 
                    model.visible);
}

    