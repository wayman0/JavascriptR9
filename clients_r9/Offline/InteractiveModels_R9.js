//@ts-check

import {Scene, Position, Matrix} from "../../renderer/scene/SceneExport.js";
import {Sphere, Cylinder, Torus, Cube, PanelXY, PanelXZ} from "../../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../../renderer/scene/util/UtilExport.js";
import {FrameBuffer} from "../../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../../renderer/pipeline/PipelineExport.js";
import Color from "../../renderer/color/Color.js";
import format from "../../StringFormat.js";


// Create the Scene object that we shall render.
const scene = Scene.buildFromName("InteractiveModels_R9");
  
// Create several Model objects.
scene.addPosition(Position.buildFromModel(new Sphere(1.0, 30, 30)));
scene.addPosition(Position.buildFromModel(new Cylinder(0.5, 1.0, 20, 20)));
scene.addPosition(Position.buildFromModel(new Torus(0.75, 0.25, 25, 25)));
scene.addPosition(Position.buildFromModel(new Cube(1)));
   
// Give each model a random color.

// Push the Positions away from where the camera is.
for(let x = 0; x < scene.positionList.length; x += 1)
{  
   const p = scene.getPosition(x); 
   ModelShading.setRainbowPrimitiveColors(p.model);
   p.setMatrix(Matrix.translate(3*x - 6, 0, -3) );
   p.visible = false;
}

scene.addPosition(Position.buildFromModel(new PanelXY(-7, 7, -1, 3)));  // wall
scene.addPosition(Position.buildFromModel(new PanelXZ(-7, 7, -3, 1)));  // floor

// Position the wall, floor and airplane.
const size = scene.positionList.length;
scene.getPosition(size - 2).getMatrix().mult( Matrix.translate(0,  0, -3) );// wall
ModelShading.setColor(scene.getPosition(size-2).getModel(), new Color(50, 50, 50));
scene.getPosition(size - 1).getMatrix().mult( Matrix.translate(0, -1,  0) );// floor
ModelShading.setColor(scene.getPosition(size-1).getModel(), new Color(50, 50, 50));

const fb = new FrameBuffer(1000, 1000, new Color(50, 50, 50));

for(let x = 0; x < scene.positionList.length-2; x += 1)
{
   fb.clearFBDefault();
   const p = scene.getPosition(x);
   p.visible = true;

   for(let rot = 0; rot < 180; rot += 5)
   {   
      p.setMatrix(Matrix.translate(0, 0, -3)
                        .mult(Matrix.rotateY(rot))
                        .mult(Matrix.rotateX(rot)));
      renderFB(scene, fb);
      fb.dumpFB2File(format("InteractiveModels_R9_Pos%1d_Frame%3d.ppm", x, rot/5));
      fb.clearFBDefault();
   }

   p.setMatrix(Matrix.translate(3*x-6, 0, -3));
   p.visible = false;
}