<<<<<<< HEAD
import {Model, Vertex, Camera} from "../scene/SceneImport.js";

export default function project(model, camera)
{
    const newVertexList = new Array(model.vertexList.length);

    for(let x = 0; x < newVertexList.length; x += 1)
    {
        const v = model.vertexList[x];

        if(camera.perspective)
            newVertexList[x] = new Vertex(v.x/-v.z, v.y/-v.z, -1);
        else
            newVertexList[x] = new Vertex(v.x, v.y, 0);
    }

    return new Model(newVertexList, 
                    model.primitiveList, 
                    model.colorList, 
                    model.name, 
                    model.visible);
=======
export default function project(model, camera)
{
    const newVertexList = new Array(model.vertexList.length);

    for(let x = 0; x < newVertexList.length; x += 1)
    {
        const v = model.vertexList[x];

        if(camera.perspective)
            newVertexList[x] = new Vertex(v.x/-v.z, v.y/-v.z, -1);
        else
            newVertexList[x] = new Vertex(v.x, v.y, 0);
    }

    return new model(newVertexList, 
                    model.primitiveList, 
                    model.colorList, 
                    model.name, 
                    model.visible);
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}