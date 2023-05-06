//@ts-check

import {Scene, Position, Matrix} from "../renderer/scene/SceneExport.js";
import {Sphere, Cylinder, Torus, Cube, PanelXY, PanelXZ} from "../renderer/models_L/ModelsExport.js";
import * as ModelShading from "../renderer/scene/util/UtilExport.js";
import {FrameBuffer} from "../renderer/framebuffer/FramebufferExport.js";
import {renderFB} from "../renderer/pipeline/PipelineExport.js";
import Color from "../renderer/color/Color.js";


// Create the Scene object that we shall render.
const scene = Scene.buildFromName("InteractiveModels_R9");
  
// Create several Model objects.
scene.addPosition(Position.buildFromModel(new Sphere(1.0, 30, 30)));
scene.addPosition(Position.buildFromModel(new Cylinder(0.5, 1.0, 20, 20)));
scene.addPosition(Position.buildFromModel(new Torus(0.75, 0.25, 25, 25)));
scene.addPosition(Position.buildFromModel(new Cube(5)));
scene.addPosition(Position.buildFromModel(new PanelXY(-7, 7, -1, 3)));  // wall
scene.addPosition(Position.buildFromModel(new PanelXZ(-7, 7, -3, 1)));  // floor
   
// Give each model a random color.
for(const p of scene.positionList)
   ModelShading.setRandomColor( p.getModel() );

// Push the Positions away from where the camera is.
for(const p of scene.positionList)
   p.setMatrix(Matrix.translate(0, 0, -3) );

// Position the wall, floor and airplane.
const size = scene.positionList.length;
scene.getPosition(size - 2).getMatrix().mult( Matrix.translate(0,  0, -3) );// wall
scene.getPosition(size - 1).getMatrix().mult( Matrix.translate(0, -1,  0) );// floor

const fb = new FrameBuffer(1000, 1000, new Color(50, 50, 50));
renderFB(scene, fb);
fb.dumpFB2File("InteractiveModels_R9.ppm");