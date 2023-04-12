<<<<<<< HEAD
import {Model, Position, Matrix, Vertex} from "../scene/SceneImport.js";

export default function model2view(position, ctm)
{
    const model = position.model();
    let newVertexList = new Array(model.vertexList().length);

    for(let x = 0; x < model.vertexList().length; x += 1)
        newVertexList[x] = ctm.timesVertex(model.vertexList()[x]);

        console.log("Vertex is array: " + Array.isArray(newVertexList) + "\n" 
                  + "Primit is array: " + Array.isArray(model.primitiveList()) + "\n" 
                  + "Colors is array: " + Array.isArray(model.colorList()));

    return new Model(newVertexList, 
                    model.primitiveList(), 
                    model.colorList(), 
                    position.name() + "::" + model.name(), 
                    model.visible);
}

=======
export default function model2view(position, ctm)
{
    const model = position.model;
    let newVertexList = new Arrray(model.vertexList.length);

    for(let x = 0; x < model.vertexList.length; x += 1)
        newVertexList[x] = ctm.times(model.vertexList[x]);

    return new model(newVertexList, 
                    model.primitiveList, 
                    model.colorList, 
                    position.name + "::" + model.name, 
                    model.visible);
}

>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
    