<<<<<<< HEAD
import {Model, Vertex, Point, Camera} from "../scene/SceneImport.js";

export default function clip(model, pt, camera)
{
    const result = undefined;
    const vIndex = pt.vindexList[0];
    const v = model.vertexList[vIndex];
    const z = v.z;

    if(z <= camera.n)
        result = pt;
    
    return result;
=======
export default function clip(model, pt, camera)
{
    const result = undefined;
    const vIndex = pt.vindexList[0];
    const v = model.vertexList[vIndex];
    const z = v.z;

    if(z <= camera.n)
        result = pt;
    
    return result;
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}