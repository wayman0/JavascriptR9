import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector, Vertex, Primitive, LineSegment, Point} from "../scene/SceneImport.js";
import {check} from "../scene/util/UtilImport.js";
import {FrameBuffer, Viewport} from "../framebuffer/FramebufferImport.js";
import {clip, M2V, NearClip, Project, rasterize, V2C, debugPosition, debugScene, logMessage, logVertexList, logColorList, logPrimitiveList} from "./PipelineImport.js";
import Color from "../color/Color.js";

export var DEFAULT_COLOR = Color.white;

export function renderFB(scene, fb)
{
    if(fb instanceof FrameBuffer == false)
        throw new Error("FB must be a framebuffer");

    render(scene, fb.vp());
}

export function render(scene, vp)
{
    if(scene instanceof Scene == false)
        throw new Error("Scene must be a scene data type");

    if(vp instanceof Viewport == false)
        throw new Error("VP must be a Viewport data type");

    //TypeError: Assignment to constant variable.
    //debugScene = scene.debug;

    logMessage("/n== Begin Renderering of Scene (Pipeline1): " + scene.name + " ==");

    for(const position of scene.positionList())
    {
        //TypeError: Assignment to constant variable.
        //debugPosition = position.debug;

        if(position.visible)
            renderPosition(scene, position, Matrix.identity(), vp);
        else
            logMessage("==== Hidden Position: " + position.name());
    }

    logMessage("== End Rendering of Scene (Pipeline 1) == ");
}

function renderPosition(scene, position, ctm, vp)
{
    if(position.getModel() != null && position.getModel() != undefined)
        logMessage("==== Render Position: " + position.getName() + " ====");
    else
        logMessage("==== Render Position (no model) ====");
    
    logMessage("---- Transformation matrix:\n" + position.getMatrix());

    const ctm2 = ctm.timesMatrix(position.getMatrix());

    if(position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
    {
        logMessage("====== Render model: " + position.getModel().name + " ======");

        check(position.getModel());

        if( position.getModel().colorList.length == 0 &&
            !position.getModel().vertexList.length == 0)
        {
            for(let i = 0; i < position.getModel().vertexList.length; ++i)
                position.getModel().addColor(DEFAULT_COLOR);

            console.log("***WARNING: Added default color to model: " + position.getModel().name + ".");
        }

        logVertexList("0. Model    ", position.getModel());

        const model1 = M2V(position, ctm2);
        logVertexList("1. View      ", model1);
        
        const model2 = V2C(model1, scene.camera);
        logVertexList("2. Camera    ", model2);
        logColorList("2. Camera    ", model2);
        logPrimitiveList("2. Camera    ", model2);

        const model3 = NearClip(model2, scene.camera);
        logVertexList("3. NearClipped", model3);
        logColorList("3. NearClipped", model3);
        logPrimitiveList("3. NearClipped", model3);

        const model4 = Project(model3, scene.getCamera());
        logVertexList("4. Projected  ", model4);

        model5 = clip(model4);
        logVertexList("5. Clipped    ", model5);
        logColorList("5. Clipped    ", model5);
        logPrimitiveList("5. Clipped    ", model5);

        rasterize(model5, vp);
        logMessage("====== End Model: " + position.getModel().getName() + " =====");
    }
    else
    {
        if(position.getModel() != null && position.getModel() != undefined)
            logMessage("===== Hidden model: " + position.getModel().getName() + "======");
        else    
            logMessage("====== Missing model ======");
    }

    for(const p of position.nestedPositions)
    {
        if(p.visible)
            renderPosition(scene, p, ctm2, vp);
        else
            logMessage("====== Hidden Position" + position.getName() + " =====");
    }
}