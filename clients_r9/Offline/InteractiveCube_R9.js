//@ts-check

import {Scene, Matrix, Model, Position, Vertex} from "../../renderer/scene/SceneExport.js";
import {FrameBuffer, Viewport} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB, setRastDebug, setDoAntiAliasing} from "../../renderer/pipeline/PipelineExport.js";
import {LineSegment} from "../../renderer/scene/primitives/PrimitiveExport.js";
import Color from "../../renderer/color/Color.js";

let cubeModel = Model.buildName("Cube");
cubeModel.addVertex(new Vertex(-1, -1, 1),
                    new Vertex(-1, 1, 1),
                    new Vertex(1, 1, 1),
                    new Vertex(1, -1, 1),
                    new Vertex(-1, -1, -1),
                    new Vertex(-1, 1, -1),
                    new Vertex(1, 1, -1),
                    new Vertex(1, -1, -1));
cubeModel.addColor(Color.RED, Color.Green, Color.BLUE, Color.Orange, Color.yellow, Color.pink, Color.cyan, Color.magenta);
cubeModel.addPrimitive( LineSegment.buildVertexColors(0, 1, 0, 1),
                        LineSegment.buildVertexColors(1, 2, 1, 2),
                        LineSegment.buildVertexColors(2, 3, 2, 3),
                        LineSegment.buildVertexColors(3, 0, 3, 0),
                        
                        LineSegment.buildVertexColors(4, 5, 4, 5),
                        LineSegment.buildVertexColors(5, 6, 5, 6),
                        LineSegment.buildVertexColors(6, 7, 6, 7),
                        LineSegment.buildVertexColors(7, 4, 7, 4),
                        
                        LineSegment.buildVertexColors(0, 4, 0, 4),
                        LineSegment.buildVertexColors(1, 5, 1, 5),
                        LineSegment.buildVertexColors(2, 6, 2, 6),
                        LineSegment.buildVertexColors(3, 7, 3, 7));

let cubePos = Position.buildFromModelName(cubeModel, "Cube Position");
cubePos.setMatrix(Matrix.translate(0, 0, -5));

let scene = new Scene();
scene.addPosition(cubePos);

let fb = new FrameBuffer(500, 500);

renderFB(scene, fb);
fb.dumpFB2File("Cube.ppm");

// create an animation of the cube rotating around x axis
for(let x = -90; x <= 90; x += 5)
{
    fb.clearFBDefault();
    cubePos.setMatrix(Matrix.translate(0, 0, -5)
                            .mult(Matrix.rotateX(x)));
    renderFB(scene, fb);
    fb.dumpFB2File("Cube--RotateX(" + x + ").ppm");
}

// create an animation of the cube rotating around y axis
for(let y = -90; y <= 90; y += 5)
{
    fb.clearFBDefault();
    cubePos.setMatrix(Matrix.translate(0, 0, -5)
                            .mult(Matrix.rotateY(y)));
    renderFB(scene, fb);
    fb.dumpFB2File("Cube--RotateY(" + y + ").ppm");
}

// create an animation of the cube rotating around z axis
for(let z = -90; z <= 90; z += 5)
{
    fb.clearFBDefault();
    cubePos.setMatrix(Matrix.translate(0, 0, -5)
                            .mult(Matrix.rotateZ(z)));
    renderFB(scene, fb);
    fb.dumpFB2File("Cube--RotateZ(" + z + ").ppm");
}

// create an animation of the cube rotating around x, y, z axis
for(let r = -90; r <= 90; r += 5)
{
    fb.clearFBDefault();
    cubePos.setMatrix(Matrix.translate(0, 0, -5)
                            .mult(Matrix.rotateX(r))
                            .mult(Matrix.rotateY(r))
                            .mult(Matrix.rotateZ(r)));
    renderFB(scene, fb);
    fb.dumpFB2File("Cube--RotateAll(" + r + ").ppm");
}






