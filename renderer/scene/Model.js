/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Model} object represents a distinct geometric object in a
   {@link Scene}. A {@code Model} data structure is mainly a {@link List}
   of {@link Vertex} objects, a {@link List} of {@link Primitive} objects,
   and a list of {@link Color} objects.
<p>
   Each {@link Vertex} object contains the xyz-coordinates, in the
   {@code Model}'s own coordinate system, for one point from the
   {@code Model}.
<p>
   Each {@link Color} object represents a color associated to one
   (or more) {@link Vertex} objects.
<p>
   The {@link Vertex} objects represents points from the geometric object
   that we are modeling. In the real world, a geometric object has an infinite
   number of points. In 3D graphics, we "approximate" a geometric object by
   listing just enough points to adequately describe the object. For example,
   in the real world, a rectangle contains an infinite number of points, but
   it can be adequately modeled by just its four corner points. (Think about
   a circle. How many points does it take to adequately model a circle? Look
   at the {@link renderer.models_L.Circle} model.)
<p>
   Each {@link Primitive} object is either a {@link LineSegment} or a
   {@link Point}.
<p>
   Each {@link LineSegment} object contains four integers, two integers that
   are the indices of two {@link Vertex} objects from the {@code Model}'s
   vertex list, and two integers that are indices of two {@link Color}
   objects from the {@link Model}'s color list. The two vertices are the
   line segment's two endpoints, and each of the two colors is associated
   with one of the two endpoints.
<p>
   Each {@link Point} object contains two integers, one integer index of
   a {@link Vertex} from the {@code Model}'s vertex list, and one integer
   index of a {@link Color} from the {@code Model}'s color list.
<p>
   We use {@link LineSegment} objects to represent the space between the
   model's vertices. For example, while a rectangle can be approximated by
   its four corner points, those same four points could also represent two
   parallel line segments, or they could represent two lines that cross each
   other. By using four line segments that connect around the four points,
   we get a good, unambiguous representation of a rectangle.
<p>
   If we modeled a circle using just points, we would probably need to use
   hundreds of points. But if we connect every two adjacent points with a
   short line segment, we can get a good model of a circle with just a few
   dozen points.
<p>
   Our {@code Model}'s represent geometric objects as a "wire-frame" of line
   segments, that is, a geometric object is drawn as a collection of "edges".
   This is a fairly simplistic way of doing 3D graphics and we will improve
   this in later renderers.
<p>
   See
<br> <a href="https://en.wikipedia.org/wiki/Wire-frame_model" target="_top">
              https://en.wikipedia.org/wiki/Wire-frame_model</a>
<br>or
<br> <a href="https://www.google.com/search?q=computer+graphics+wireframe&tbm=isch" target="_top">
              https://www.google.com/search?q=computer+graphics+wireframe&tbm=isch</a>
*/

import Vertex from "./Vertex.js";
import Primitive from "./primitives/Primitive.js";
import Color from "../color/Color.js";

export default class Model
{
    #vertexList;
    #primitiveList;
    #colorList;
    #name;
    visible;

    constructor(vList= new Array(), pList= new Array(), cList = new Array(), name = "", vis = true)
    {
        if(!vList.isArray() || !pList.isArray() || !cList.isArray())
            throw new Error("Vertex, Primitive, and Color List must be arrays");

        if(name instanceof String == false)
            throw new Error("Name must be a string");

        if(typeof vis != Boolean)
            throw new Error("Visible is not a boolean");

        const vertexLength = this.#vertexList.length;        
        for(let x = 0; x < vList.length; x += 1)
        {
            if(vList[x] instanceof Vertex == false)
            {
                this.#vertexList.length = vertexLength;
                throw new Error("Vertex List must contain Vertexes");
            }
            else
                this.#vertexList.push(vList[x]);
        }

        const primitiveLength = this.#primitiveList.length;
        for(let x = 0; x < pList.length; x += 1)
        {
            if(pList[x] instanceof Primitive == false)
            {
                this.#primitiveList.length = primitiveLength;
                throw new Error("Primitive List mut contain Primitives")
            }
            else
                this.#primitiveList.push(pList[x]);
        }

        const colorLength = this.#colorList.length;
        for(let x = 0; x < cList.length; x += 1)
        {
            if(cList[x] instanceof Color == false)
            {
                this.#colorList.length = colorLength;
                throw new Error("Color List must only contain Colors");
            }
            else   
                this.#colorList.push(cList[x]);

        }

        this.#vertexList.splice(vertexLength, this.#vertexList.length);
        this.#primitiveList.splice(primitiveLength, this.#primitiveList.length);
        this.#colorList.splice(colorLength, this.#colorList.length);
        this.#name = name;
        this.visible = vis;
    }

    static buildName(name = "")
    {
        return this(new Array(), new Array(), new Array(), name);
    }

    getVertexList()
    {
        return this.#vertexList;
    }

    vertexList = () => {return this.#vertexList;}

    getPrimitiveList()
    {
        return this.#primitiveList;
    }

    primitiveList = () => {return this.#primitiveList;}

    getColorList()
    {
        return this.#colorList;
    }
    
    colorList = () => {return this.#colorList;}
    
    getName()
    {
        return this.#name;
    }

    name = () => {return this.#name;}

    setName(name = "")
    {
        if(name instanceof String == false)
            throw new Error("Name must be a string");

        this.#name = name;
    }

    getVertex(index = 0)
    {
        if(typeof index != Number)
            throw new Error("Index must be numerical");
        else
            return this.#vertexList[index];
    }
    
    addVertex(... vArray)
    {
        for(let v of vArray)
        {
            if(v instanceof Vertex == false)
                throw new Error("Can only add Vertexes");
            else
                this.#vertexList.push(v);
        }
    }

    getPrimitive(index = 0)
    {
        if(typeof index != Number)
            throw new Error("Index must be numerical");
        else
            return this.#primitiveList[index];
    }

    addPrimitive(... pArray)
    {
        for(let p of pArray)
        {
            if(p instanceof Primitive == false)
                throw new  Error("Can only add primitives");
            else
                this.#primitiveList.push(p);
        }
    }

    getColor(index = 0)
    {
        if(typeof index != Number)
            throw new Error("Index must be numerical");
        else
            return this.#colorList[index];
    }

    addColor(... cArray)
    {
        for(let c of cArray)
        {
            if(c instanceof Color == false)
                throw new Error("Can only add Colors");
            else
                this.#colorList.push(c);
        }
    }

    toString()
    {
        result = "";
        result += "Model: " + this.#name + "\n";
        result += "This Model's visibility is: " + this.visible + "\n";
        result += "Model has " + this.#vertexList.length + " vertices.\n";
        result += "Model has " + this.#colorList.length + " colors.\n";
        result += "Model has " + this.#primitiveList.length + " primitives.\n";
        
        let i = 0;
        for (let v of this.#vertexList)
        {
            result += i + ": " + v.toString() + "\n";
            ++i;
        }
        i = 0;
        for (let c of this.#colorList)
        {
            result += i + ": " + c.toString() + "\n";
            ++i;
        }
        i = 0;
        for (let p of this.#primitiveList)
        {
            result += i + ": " + p.toString() + "\n";
            ++i;
        }

        return result;
    }

}