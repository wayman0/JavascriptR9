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
import Scene from "./SceneImport.js";

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

        if(positionList.isArray())
            throw new Error("Position List must be an array");
        
        if(name instanceof String)
            throw new Error("Name must be a String");
        
        if(typeof debug != Boolean)
            throw new Error("Debug must be a boolean");

        const posLength = this.#positionList.length;
        for(let x = 0; x < positionList; x += 1)
        {
            if(positionList[x] instanceof Position == false)
            {
                this.#positionList.length = posLength;
                throw new Error("Position List can only contain Positions");
            }
            else
                this.#positionList.push(positionList[x]);

        }
        this.#camera = camera;
        this.#name = name;
        this.#positionList.splice(posLength, this.#positionList.length);
        this.debug = debug;
    }

    static buildFromName(name)
    {
        return this(new Camera(), new Array(), name);
    }

    static buildFromCamera(cam)
    {
        return this(cam, new Array());
    }
    static buildFromCameraName(cam, name)
    {
        return this(cam, new Array(), name);
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
}