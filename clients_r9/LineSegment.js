import {Scene, Camera, Matrix, Model, Position, Vertex} from "../renderer/scene/SceneImport.js";
import {LineSegment} from "../renderer/scene/primitives/PrimitiveImport.js";

import Color from "../renderer/color/Color.js";

import {showCamera, showMatrix, showWindow, pushback, scene, keyPressed, 
        setTransformations, displayCamera, displayMatrix, printHelpMessage} from "./InteractiveAbstractClient_R9.js";

lsModel = Model.buildName("Line Segment Model");
lsModel.addVertex(  new Vertex(-1, 0, 0), 
                    new Vertex(1, 0, 0));
lsModel.addColor(Color.red, Color.blue);
lsModel.addPrimitive(LineSegment.buildVertexColors(0, 1, 0, 1));

lsPosit = Position.buildFromModelName(lsModel, "Line Segment Position");
lsPosit.setMatrix(Matrix.translate(0, 0, pushback));

scene = Scene.buildFromName("Line Segment Scene");
scene.addPosition(lsPosit);

showCamera = true;
showMatrix = true;

printHelpMessage();

const width = 512;
const height = 512;


