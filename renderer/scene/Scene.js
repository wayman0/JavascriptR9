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
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Vector, Vertex} from "./SceneImport.js";
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

        if(Array.isArray(positionList))
            throw new Error("Position List must be an array");
        
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

    getCamera()
    {
        return this.#camera;
    }

    camera = () => {return this.#camera;}
    
    setCamera(camera)
    {
        if(camera instanceof Camera == false)
            throw new Error("Camera must be a Camera");

        this.#camera = camera;
    }

    getPositionList()
    {
        return this.#positionList;
    }
    
    positionList = () => {return this.#positionList;}
    
    getPosition(index)
    {
        if(typeof index != Number)
            throw new Error("Index must be numerical");

        return this.#positionList[index];
    }

    setPosition(index, position)
    {
        if(typeof index != Number)
            throw new Error("Index must be numerical");

        if(position instanceof Position)
            throw new Error("Position must be a Position");

        this.#positionList[index] = position;
    }

    addPosition(... pArray)
    {
        for(let pos of pArray)
        {
            if(pos instanceof pArray == false)
                throw new Error("Can only add Positions");

            this.#positionList.push(pos);
        }
    }

    getModelByName(name)
    {
        if(name instanceof String)
            throw new Error("Name must be a String");

        for(pos of this.#positionList)
        {
            if(name === pos.getModel().getName())
                return pos.getModel();
        }

        return undefined;
    }

    getPositionByModelName(name)
    {
        if(name instanceof String == false)
            throw new Error("Name must be a String");

        for(let pos of this.#positionList)
        {
            if(name === pos.getModel().getName)
                return pos;
        }

        return undefined;
    }

    toString()
    {
        result = "";
        result += "Scene: " + this.#name + "\n";
        result += this.#camera.toString();
        result += "This Scene has " + this.#positionList.length + " positions\n";
        
        let i = 0;
        for(let p of this.#positionList)
        {
            result += "Position " + (i++) + "\n";
            result += p.toString();
        }

        return result;
    }

    static main()
    {
        const line = new Model();
        line.addColor(Color.orange);
        line.addVertex(new Vertex(-1, 0, 0),
                        new Vertex(1, 0, 0));
        line.addPrimitive(new LineSegment(0, 1, 0));
        line.setName("Line Model");

        const pos1 = new Position(line);
        pos1.setName("Pos 1");
        
        const cam = new Camera();
    
        console.log("Creating scene1 = new Scene()");
        console.log("Creating scene2 = Scene.buildFromCamera(cam = new Camera)");
        console.log("Creating scene3 = Scene.buildFromName('scene 3')");
        console.log("Creating scene4 = Scene.buildFromCameraName(new Camera, 'Scene 4')");
        const scene1 = new Scene();
        const scene2 = Scene.buildFromCamera(cam);
        const scene3 = Scene.buildFromName("Scene 3");
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

        

        

    }
}