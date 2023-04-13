/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Scene} data structure is a {@link List} of {@link Position}
   data structures and a {@link Camera} data structure.
<p>
   Each {@link Position} object represents a {@link Model} object in a
   distinct position in three-dimensional view space.
<p>
   Each {@link Model} object represents a distinct geometric object
   in the scene.
<p>
   The {@link Camera} object determines a "view volume", which
   determines how much of the scene is actually visible (to the
   camera) and gets rendered into the framebuffer.
*/
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Vector, Vertex, LineSegment} from "./SceneImport.js";
// for testing purposes
import Color from "../color/Color.js";

export default class Scene
{
    #positionList;
    #camera;
    #name;
    debug = false;

    constructor(camera = new Camera(), positionList = new Array(), name = "", debug = false)
    {
        if(camera instanceof Camera == false)
            throw new Error("Camera must be a camera");

        if(!Array.isArray(positionList))
            throw new Error("Position List must be an array and is type: " + typeof positionList );
        
        if(typeof name != "string")
            throw new Error("Name must be a String");
        
        if(typeof debug != "boolean")
            throw new Error("Debug must be a boolean");

        let posLength = 0;
        this.#positionList = new Array();
        for(let x = 0; x < positionList.length; x += 1)
        {
            if(positionList[x] instanceof Position == false)
            {
                this.#positionList.length = posLength;
                throw new Error("Position List can only contain Positions");
            }
            else
            {
                this.#positionList.push(positionList[x]);
                posLength += 1;
            }
        }

        this.#camera = camera;
        this.#name = name;
        this.debug = debug;
    }

    static buildFromName(name)
    {
        return new Scene(new Camera(), new Array(), name);
    }

    static buildFromCamera(cam)
    {
        return new Scene(cam, new Array());
    }

    static buildFromCameraName(cam, name)
    {
        return new Scene(cam, new Array(), name);
    }

    getName()
    {
        return this.#name;
    }

    name = () => {return this.#name;}

    get name() {return this.#name;}

    getCamera()
    {
        return this.#camera;
    }

    camera = () => {return this.#camera;}
    
    get camera() {return this.#camera;}

    setCamera(camera)
    {
        if(camera instanceof Camera == false)
            throw new Error("Camera must be a Camera");

        this.#camera = camera;
    }

    set camera(cam)
    {
        if(cam instanceof Camera == false)
            throw new Error("Camera must be a Camera");

        this.#camera = cam;
    }

    getPositionList()
    {
        return this.#positionList;
    }
    
    positionList = () => {return this.#positionList;}
    
    get positionList() {return this.#positionList;}

    getPosition(index)
    {
        if(typeof index != "number")
            throw new Error("Index must be numerical");

        return this.#positionList[index];
    }

    setPosition(index, position)
    {
        if(typeof index != "number")
            throw new Error("Index must be numerical");

        if(position instanceof Position == false)
            throw new Error("Position must be a Position");

        this.#positionList[index] = position;
    }

    addPosition(... pArray)
    {
        for(let pos of pArray)
        {
            if(pos instanceof Position == false)
                throw new Error("Can only add Positions");

            this.#positionList.push(pos);
        }
    }

    getModelByName(name)
    {
        if(typeof name != "string")
            throw new Error("Name must be a String");

        for(let pos of this.#positionList)
        {
            if(name === pos.getModel().getName())
                return pos.getModel();
        }

        return undefined;
    }

    getPositionByModelName(name)
    {
        if(typeof name != "string")
            throw new Error("Name must be a String");

        for(let pos of this.#positionList)
        {
            if(name === pos.getModel().getName())
                return pos;
        }

        return undefined;
    }

    toString()
    {
        let result = "";
        result += "Scene: " + this.#name + "\n";
        result += this.#camera.toString();
        result += "This Scene has " + this.#positionList.length + " positions\n";
        
        let i = 0;
        for(let p of this.#positionList)
        {
            
            result += "Position " + (i++) + "\n";
            if(p == undefined)
                result += "missing position \n";
            else
                result += p.toString();
        }

        result += "\n"
        return result;
    }

    static main()
    {
        const line = new Model();
        line.addColor(Color.orange);
        line.addVertex(new Vertex(-1, 0, 0),
                        new Vertex(1, 0, 0));
        line.addPrimitive(LineSegment.buildVertexColor(0, 1, 0));
        line.setName("Line Model");

        const pos1 = Position.buildFromModelName(line, "Pos 1");
        //pos1.setName("Pos 1");
        
        const cam = new Camera();
    
        console.log("Creating scene1 = new Scene()");
        const scene1 = new Scene();
        console.log("Creating scene2 = Scene.buildFromCamera(cam = new Camera)");
        const scene2 = Scene.buildFromCamera(cam);
        console.log("Creating scene3 = Scene.buildFromName('scene 3')");
        const scene3 = Scene.buildFromName("Scene 3");
        console.log("Creating scene4 = Scene.buildFromCameraName(new Camera, 'Scene 4')");       
        const scene4 = Scene.buildFromCameraName(cam, "Scene 4");

        console.log("");
        console.log("Scene1: ");
        console.log(scene1.toString());
        
        console.log("");
        console.log("scene 2: ");
        console.log(scene2.toString());

        console.log("");
        console.log("Scene 3: ");
        console.log(scene3.toString());

        console.log("");
        console.log("Scene 4: ");
        console.log(scene4.toString());

        console.log("");
        console.log("Scene1.getName(): ");
        console.log(scene1.getName());

        console.log("");
        console.log("scene1.name() ");
        console.log(scene1.name());

        console.log("");
        console.log("scene1.name");
        console.log(scene1.name);

        console.log("");
        console.log("scene2.getCamera()")
        console.log(scene2.getCamera());

        console.log("");
        console.log("scene2.camera()")
        console.log(scene2.camera());

        console.log("");
        console.log("scene2.camera");
        console.log(scene2.camera);
        
        console.log("");
        console.log("scene3.getPositionList() ");
        console.log(scene3.getPositionList());
        
        console.log("");
        console.log("scene3.positionList()");
        console.log(scene3.positionList());

        console.log("");
        console.log("scene3.positionList");
        console.log(scene3.positionList);

        /*
        console.log("");
        console.log("scene1.setCamera(cam): ");
        scene1.setCamera(cam);
        console.log(scene1.toString());
        */

        console.log("");
        console.log("scene1.camera = cam");
        scene1.camera = cam;
        console.log(scene1.toString());


        console.log("");
        console.log("scene2.setPosition(1, pos1)");
        scene2.setPosition(1, pos1);
        console.log(scene2.toString());

        console.log("");
        console.log("scene3.addPosition(pos1)");
        scene3.addPosition(pos1);
        console.log(scene3.toString());

        console.log("");
        console.log("scene3.getPosition(0) ");
        console.log(scene3.getPosition(0).toString());

        console.log("");
        console.log("scene4.addPosition(pos1, pos1, pos1)");
        scene4.addPosition(pos1, pos1, pos1);
        console.log(scene4.toString());

        console.log("");
        console.log("scene4.getModelByName(Line Model)")
        console.log(scene4.getModelByName("Line Model").toString());

        console.log("");
        console.log("scene4.getPositionByModelName(Pos 1)");
        console.log(scene4.getPositionByModelName("Pos 1"));

        console.log("");
        console.log("scene4.getPositionByModelName(Line Model)");
        console.log(scene4.getPositionByModelName("Line Model").toString());
    }
}