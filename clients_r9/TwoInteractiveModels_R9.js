/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import { Octahedron, TriangularPyramid} from "../renderer/models_L/ModelsImport.js";
import {Scene, Position, Matrix} from "../renderer/scene/SceneImport.js";
import * as ModelShading from "../renderer/scene/util/UtilImport.js";
import {renderFB} from "../renderer/pipeline/PipelineImport.js";
import { FrameBuffer } from "../renderer/framebuffer/FramebufferImport.js";
import Color from "../renderer/color/Color.js";
import format from "../StringFormat.js";

const scene = Scene.buildFromName("Two Interactive Models");

scene.addPosition(Position.buildFromModelName(Octahedron.buildMeshOctahedron(2, 2, 2, 2, 2, 2), "Octahedron Position"));
scene.addPosition(Position.buildFromModelName(new TriangularPyramid(), "Triangular Pyramid Position"));

for(const p of scene.positionList)
    ModelShading.setRandomColor(p.getModel());

scene.getPosition(0).setMatrix(Matrix.translate(-2, 0, -4));
scene.getPosition(1).setMatrix(Matrix.translate(+2, 0, -3));

const fb = new FrameBuffer(1024, 1024, Color.Gray);
renderFB(scene, fb);
fb.dumpFB2File("TwoInteractiveModels_R9.ppm");

for(let x = 0; x < 360; x += 5)
{
    for(const p of scene.positionList)
    {
        // accumulate the rotations
        p.getMatrix().mult(Matrix.rotateX(5))
                     .mult(Matrix.rotateY(5))
                     .mult(Matrix.rotateZ(5));
    }

    fb.clearFB(fb.bgColorFB);
    renderFB(scene, fb);
    fb.dumpFB2File(format("TwoInteractiveModels_R9_Frame%3d.ppm", x/5));
}