//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneImport.js";
import {FrameBuffer, Viewport} from "../renderer/framebuffer/FramebufferImport.js";
import {renderFB, setRastDebug} from "../renderer/pipeline/PipelineImport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveImport.js";
import Color from "../renderer/color/Color.js";

let lsModel = Model.buildName("Line Segment Model");
lsModel.addVertex(  new Vertex(-1, 0, 0), 
                    new Vertex(1, 0, 0));
lsModel.addColor(Color.red, Color.blue);
lsModel.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1));

let lsPosit = Position.buildFromModelName(lsModel, "Line Segment Position");
lsPosit.setMatrix(Matrix.translate(0, 0, -5));
lsPosit.debug = true;

let scene = Scene.buildFromName("Line Segment Scene");
scene.addPosition(lsPosit);
scene.debug = true;

let fb = new FrameBuffer(500, 500);

setRastDebug(true);

renderFB(scene, fb);
fb.dumpFB2File("LineSegment.ppm");

/*
// translate the linesegment from the bottom left to the top right
for(let x = -1; x < 1; x += .1)
{
    for(let y = -1; y < 1; y += .1)
    {
        lsPosit.setMatrix(Matrix.translate(x, y, -1));
        renderFB(scene, fb);
        fb.dumpFB2File("LineSegment--Translate(" + x + ", " + y + ", " + "-1).ppm");
    }
}

//rotate the linesegment around the x axis
for(let x = -90; x < 90; x += 5)
{
    lsPosit.setMatrix(Matrix.rotateX(x));
    renderFB(scene, fb);
    fb.dumpFB2File("LineSegment--RotateX(" + x + ").ppm");
}

// rotate the linesegment around the y axis;
for(let x = -90; x < 90; x += 5)
{
    lsPosit.setMatrix(Matrix.rotateY(x));
    renderFB(scene, fb);
    fb.dumpFB2File("LineSegment--RotateY(" + x + ").ppm");
}

// rotate the linesegment around the z axis;
for(let x = -90; x < 90; x += 5)
{
    lsPosit.setMatrix(Matrix.rotateZ(x));
    renderFB(scene, fb);
    fb.dumpFB2File("LineSegment--RotateZ(" + x + ").ppm");
}
*/