import {Model, Camera, Vertex} from "../scene/SceneImport.js";

export default function view2camera(model, camera)
{
    const l = camera.left;
    const r = camera.right;
    const b = camera.bottom;
    const t = camera.top;
    const near = - camera.n;

    const newVertexList = new Array();

    for(let x = 0; x < model.vertexList().length; x += 1)
    {
        const v = model.vertexList()[x];

        let v_x = undefined;
        let v_y = undefined;
        let v_z = undefined;

        if(camera.perspective)
        {
            v_z = v.z();
            v_x = v.x() - v_z * (r + l)/(2 * near);
            v_y = v.y() - v_z * (t + b)/(2 * near);

            v_x = (2 * near * v_x)/(r - l);
            v_y = (2 * near * v_y)/(t - b);
        }
        else
        {
            v_z = v.z();
            v_x = v.x() - (r + l)/2;
            v_y = v.y() - (t + b)/2;
        
            v_x = (2 * v_x)/(r - l);
            v_y = (2 * v_y)/(t - b);
        }

        newVertexList[x] = new Vertex(v_x, v_y, v_z);
    }

    return new Model(newVertexList, 
                    model.primitiveList(), 
                    model.colorList(),
                    model.name(), 
                    model.visible);
}