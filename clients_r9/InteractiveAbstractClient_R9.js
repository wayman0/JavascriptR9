import {Scene, Model, Position, Matrix, Camera, Vertex} from "../renderer/scene/SceneImport.js";
import {Point, LineSegment} from "../renderer/scene/primitives/PrimitiveImport.js";
import {PointCloud, MeshMaker, ModelShading} from "../renderer/scene/util/UtilImport.js";
import {render, renderFB, clipDebug, rastDebug, doAntiAliasing, doGamma, doNearClipping} from "../renderer/pipeline/PipelineImport.js"
import { FrameBuffer, Viewport} from "../renderer/framebuffer/FramebufferImport.js";

export let letterbox = false;
export let aspectRatio = 1.0;
export let near = 1.0;
export let fovy = 90.0;
export let showCamera = false;
export let showWindow = false;

export let showMatrix = false;
export let pushback = -2.0;
export let xTranslation = 0.0;
export let yTranslation = 0.0;
export let zTranslation = 0.0
export let xRotation = 0.0;
export let yRotation = 0.0;
export let zRotation = 0.0;
export let scale = 1.0;

export let scene;
export let numberOfInteractiveModels = 1;
export let interactiveModelsAllVisible = false;
export let debugWholeScene = true;
export let currentModel = 0;
export let savedModel;
export let pointSize = 0;

export let takeScreenshot = false;
export let screenshotNumber = 0;

export function keyPressed(e)
{
    const c = e.key;

    if('h' == c)
        printHelpMessage();
    else if('d' == c && e.altKey)
        console.log("\n" + scene.getPosition(currentModel().getMode().toString()))
    else if('d' == c)//change the debug info
    {
        if(debugWholeScene)
        {
            scene.debug = !scene.debug;
            clipDebug = scene.debug;
        }
        else
        {
            const p = scene.getPosition(currentModel);
            p.debug = !p.debug;
            clipDebug = p.debug;
        }
    }
    else if('D' == c)
        rastDebug = !rastDebug;
    else if('/' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = (currentModel + 1)%numberOfInteractiveModels;
        scene.getPosition(currentModel).visible = true;
        savedModel = null;
        pointSize = 0;
    }
    else if('?' == c)
    {
        scene.getPosition(currentModel).visible = interactiveModelsAllVisible;
        currentModel = currentModel - 1;

        if(currentModel < 0)
            currentModel = numberOfInteractiveModels -1;

        scene.getPosition(currentModel).visible = true;
        savedModel = null; 
        pointSize == 0;
    }
    else if('a' == c)
    {
        doAntiAliasing = !doAntiAliasing;
        console.log("Anti aliasing is turned " + doAntiAliasing ? "On":"Off");
    }
    else if('g' == c)
    {
        doGamma = !doGamma;
        console.log("Gamma correction is turned " + doGamma ? "On":"Off");
    }
    else if('p' == c)
    {
        scene.getCamera().perspective = !scene.getCamera().perspective;
        const p = scene.getCamera().perspective ? "perspective":"orthographic";
        console.log("Using " + p + "projection");
    }
    else if('P' == c)
    {
        if(savedModel != null)
        {
            scene.getPosition(currentModel).setModel(savedModel);
            savedModel = null;
            ++pointSize;
        }
        else
        {
            const model = scene.getPosition(curretnModel).getModel();
            savedModel = model;
            scene.getPosition(currentModel).setModel(PointCloud.make(model, pointSize));
        }
    }
    else if('l' == c)
    {
        letterbox = !letterbox;
        console.log("Letterboxing is turned " + letterbox ? "On":"Off");
    }
    else if('n' == c)
        near -= .01;
    else if('N' == c)
        near += .01;
    else if('b' == c)
    {
        doNearClipping = !doNearClipping;
        console.log("Near plane clipping is turned: " + doNearClipping ? "On":"Off");
    }
    else if('r' == c)
        aspectRatio -= .01;
    else if('R' == c)
        aspectRatio += .01;
    else if('f' == c)
        fovy -= .5;
    else if('F' == c)
        fovy += .5;
    else if('M' == c)
        showCamera = !showCamera;
    else if('c' == c)
        ModelShading.setRandomColor(scene.getPosition(currentModel).getModel());
    else if('C' == c)
        ModelShading.setRandomColors(scene.getPosition(currentModel).getModel());
    else if('e' == c && e.altKey)
        ModelShading.setRandomVertexColor(scene.getPosition(currentModel).getModel());
    else if('e' == c)
        ModelShading.setRandomPrimitiveColor(scene.getPosition(currentModel).getModel());
    else if('E' == c)
        ModelShading.setRainbowPrimitiveColors(scene.getPosition(currentModel).getModel());
    else if('m' == c)
        showMatrix = !showMatrix;
    else if('k' == c)
        showWindow = !showWindow;
    else if('+' == c)
        takeScreenshot = true;
    
    setTransformations(c);
    displayMatrix(c);
    displayCamera(c);
    
    // these two depend on implementation in html
    //displayWindow(c);
    //setUpViewing();
}

export function setTransformations(c)
{
    if('=' == c)
    {    
        scale = 1.0;
        xTranslation = 0;
        yTranslation = 0; 
        zTranslation = 0; 
        xRotation = 0; 
        yRotation = 0; 
        zRotation = 0;
    }
    else if('s' == c)
        scale /= 1.1;
    else if('S' == c)
        scale *= 1.1;
    else if('x' == c)
        xTranslation -= .1;
    else if('X' == c)
        xTranslation += .1;
    else if('y' == c)
        yTranslation -= .1;
    else if('Y' == c)
        yTranslation += .1;
    else if('z' == c)
        zTranslation -= .1;
    else if('Z' == c)
        zTranslation != .1;
    else if('u' == c)
        xRotation -= 2;
    else if('U' == c)
        xRotation += 2;
    else if('v' == c)
        yRotation -= 2;
    else if('V' == c)
        yRotation += 2;
    else if('w' == c)
        zRotation -= 2;
    else if('W' == c)
        zRotation += 2;

    const modelP = scene.getPosition(currentModel);

    modelP.matrix2Identity().mult(Matrix.translate(0, 0, pushback))
                           .mult(Matrix.translate(xTranslation, yTranslation, zTranslation))
                           .mult(Matrix.rotateX(xRotation))
                           .mult(Matrix.rotateY(yRotation))
                           .mult(Matrix.rotateZ(zRotation))
                           .mult(Matrix.scale(scale));
}

export function displayMatrix(c)
{
    if(showMatrix && 
        (  'm' == c || '=' == c || 's' == c 
        || 'x' == c || 'y' == c || 'z' == c 
        || 'u' == c || 'v' == c || 'w' == c 
        || 'X' == c || 'Y' == c || 'Z' == c 
        || 'U' == c || 'V' == c || 'W' == c
        || 'S' == c))
    {
        console.log("xRot = % .5f, yRot = % .5f, zRot = % .5\n", 
                    xRotation, yRotation, zRotation);
        console.log(scene.getPosition(currentModel).getMatrix().toString());
    }
}

export function displayCamera(c)
{
    if(showCamera && 
        ('M' == c || 'p' == c ||
         'n' == c || 'N' == c ||
         'f' == c || 'F' == c ||
         'r' == c || 'R' == c ||
         ('b' == c && doNearClipping) ))
            console.log(scene.getCamera().toString());
}

export function printHelpMessage()
{
    console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
    console.log("Use the '1' and '2' keys to switch between the two renderers.");
    console.log("Use the '/' and '?' keys to cycle forwards and backwards through the models.");
    console.log("Use the '>/<' and shift keys to increase and decrease the mesh divisions in each direction.");
    console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
    console.log("Use the x/X, y/Y, z/Z, keys to translate the model along the x, y, z axes.");
    console.log("Use the u/U, v/V, w/W, keys to rotate the model around the x, y, z axes.");
    console.log("Use the s/S keys to scale the size of the model.");
    console.log("Use the 'm' key to toggle the display of matrix information.");
    console.log("Use the '=' key to reset the model matrix.");
    console.log("Use the 'c' key to change the random solid model color.");
    console.log("Use the 'C' key to randomly change model's colors.");
    console.log("Use the 'e' key to change the random solid edge colors.");
    console.log("Use the 'E' key to change the random edge colors.");
    console.log("Use the 'Alt-e' key combination to change the random vertex colors.");
    console.log("Use the 'a' key to toggle anti-aliasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'b' key to toggle near plane clipping on and off.");
    console.log("Use the n/N keys to move the camera's near plane.");
    console.log("Use the f/F keys to change the camera's field-of-view (keep AR constant).");
    console.log("Use the r/R keys to change the camera's aspect ratio (keep fov constant).");
    console.log("Use the 'l' key to toggle letterboxing viewport on and off.");
    console.log("Use the 'M' key to toggle showing the Camera data.");
    console.log("Use the 'k' key to show window data.");
    console.log("Use the 'P' key to convert the current model to a point cloud.");
    console.log("Use the '+' key to save a \"screenshot\" of the framebuffer.");
    console.log("Use the 'h' key to redisplay this help message.");
}
