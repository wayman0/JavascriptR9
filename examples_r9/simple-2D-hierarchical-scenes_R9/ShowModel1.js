//@ts-check

import Model1 from "./Model1.js";
import * as ModelShading from "../../renderer/scene/util/UtilImport.js";
import {Position, Scene, Matrix} from "../../renderer/scene/SceneImport.js";
import {FrameBuffer} from "../../renderer/framebuffer/FramebufferImport.js";
import {renderFB} from "../../renderer/pipeline/PipelineImport.js";
import Color from "../../renderer/color/Color.js";


// Create the Scene object that we shall render.
const scene = Scene.buildFromName("ShowModel_1");
// Create the top level Position.
const p = Position.buildFromName("top");
// Add the top level Position to the Scene.
scene.addPosition(p);
// Create an instance of Model_1.
const m = new Model1();
// Set the model's color.
ModelShading.setColor(m, Color.black);
// Add the Model to the Position.
p.setModel(m);
// Create a FrameBuffer to render our Scene into.
const vp_width  = 1024;
const vp_height = 1024;
const fb = new FrameBuffer(vp_width, vp_height);
//PipelineLogger.debug = true;
for(let i = 0; i <= 36; ++i)
{
   // Push the model away from where the camera is.
   scene.getPosition(0).matrix2Identity()
                       .mult( Matrix.translate(0, 0, -3) )
                       .mult( Matrix.rotateZ(10*i) );
   // Render again.
   fb.clearFB(Color.white);
   renderFB(scene, fb);
   fb.dumpFB2File("PPM_ShowModel1Frame0" + i + ".ppm");
}
