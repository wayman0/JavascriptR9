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

    