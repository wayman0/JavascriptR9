//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneImport.js";
import {FrameBuffer, Viewport} from "../renderer/framebuffer/FramebufferImport.js";
import {renderFB, setRastDebug, setDoAntiAliasing} from "../renderer/pipeline/PipelineImport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveImport.js";
import Color from "../renderer/color/Color.js";

let lsModelBlend = Model.buildName("Line Segment Model: Red to Blue");
lsModelBlend.addVertex(  new Vertex(-1, 0, 0), 
                    new Vertex(1, 0, 0));
lsModelBlend.addColor(Color.red, Color.blue);
lsModelBlend.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1));

let lsPositBlend = Position.buildFromModelName(lsModelBlend, "Line Segment Blend Position");
lsPositBlend.setMatrix(Matrix.translate(0, 0, -5));

//add a second model because when first model gets drawn, 
// it is only a black line instead of fading from red to blue
// see if the problem is blending or just colors in general

// the problem is colors in general.
let lsModelRed = Model.buildName("Line Segment Model Red");
lsModelRed.addVertex(   new Vertex(-1, -1, 0),
                        new Vertex(1, -1, 0));
lsModelRed.addColor(Color.Red);
lsModelRed.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

let lsPositRed = Position.buildFromModelName(lsModelRed, "Line Segment Red Position ")
lsPositRed.setMatrix(Matrix.translate(0, 0, -5));

let lsModelBlue = Model.buildName("Line Segment Model Blue");
lsModelBlue .addVertex( new Vertex(-1, 1, 0),
                        new Vertex(1, 1, 0));
lsModelBlue.addColor(Color.Blue);
lsModelBlue.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));

let lsPositBlue = Position.buildFromModelName(lsModelBlue, "Line Segment Blue Position ")
lsPositBlue.setMatrix(Matrix.translate(0, 0, -5));


let scene = Scene.buildFromName("Line Segment Scene");
scene.addPosition(lsPositBlend);
scene.addPosition(lsPositRed);
scene.addPosition(lsPositBlue);


let fb = new FrameBuffer(500, 500);

fb.vp.bgColorVP = Color.WHITE;
fb.vp.clearVPDefault();

// the rendered line is black instead of changing from red to blue;
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