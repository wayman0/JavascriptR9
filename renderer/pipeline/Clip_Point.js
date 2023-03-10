export default function clip(model, pt)
{
    const result = undefined;

    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];

    const x = v.x, y = v.y;

    if(! (Math.abs(x) > 1 || Math.abs(y) > 1))
        result = pt;
    
    return result;
}