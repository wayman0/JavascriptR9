/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Vertex} object has four doubles which represent the
   homogeneous coordinates of a point in 3-dimensional space.
   The fourth, homogeneous, coordinate will usually be 1, but in
   some stages of the graphics rendering pipeline it can be some
   other (non-zero) number.
<p>
   When a {@code Vertex} object is created in a client program,
   before the {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be in
   some model's local coordinate system.
<p>
   As a {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be transformed
   from one coordinate system to another.
<p>
   A {@code Vertex} object is immutable, so after it gets created it
   cannot be modified (mutated). So a {@code Vertex} object does not
   really "move" down the graphics pipeline. When a {@code Vertex}
   object needs to be transformed, we replace it, with a new
   {@code Vertex} object, instead of mutating it.
*/

import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Position, Scene, Vector} from "./SceneImport.js";

export default class Vertex
{
    #x;
    #y;
    #z;
    #w;

    /**
      Construct a new {@code Vertex} with the given homogeneous coordinates.
      Uses the default value of 1 for w if not given.

      @param x  x-coordinate of the new {@code Vertex}
      @param y  y-coordinate of the new {@code Vertex}
      @param z  z-coordinate of the new {@code Vertex}
      @param w  w-coordinate of the new {@code Vertex}
   */
    constructor(x, y, z, w = 1.0) // should w default be 1 or 0?
    {
        if( typeof x != "number" || typeof y != "number" ||
            typeof z != "number" || typeof w != "number")
                throw new Error("All parameters must be numerical");

        this.#x = x; 
        this.#y = y;
        this.#z = z;
        this.#w = w;
    }

    getX()
    {
        return this.#x;
    }

    x = () => {return this.#x;}

    get x() { return this.#x;}

    getY()
    {
        return this.#y;
    }

    y = () => {return this.#y;}

    get y() { return this.#y;}

    getZ()
    {
        return this.#z;
    }

    z = () => {return this.#z;}

    get z() { return this.#z;}

    getW()
    {
        return this.#w;
    }

    w = () => {return this.#w;}
    
    get w() {return this.#w;}

   /**
    * For debugging.
    * 
    * @returns the {@link String} representation of this {@code Vertex}
    */
   toString()
   {
        return "(x,y,z,w)=(" + this.#x + ", " + this.#y + ", " + this.#z + ", " + this.#w + ")";      
   }

   static main()
   {
        console.log("Creating vertex v1 = 1, 1, 1, 1");
        const v1 = new Vertex(1, 1, 1);

        console.log("Checking functions of v1");

        console.log("")
        console.log("v1.x: ");
        console.log(v1.x);
        console.log("v1.x(): ");
        console.log(v1.x());
        console.log("v1.getX(): ");
        console.log(v1.getX());

        console.log("");
        console.log("v1.y: ");
        console.log(v1.y);
        console.log("v1.y(): ");
        console.log(v1.y());
        console.log("v1.getY(): ");
        console.log(v1.getY());

        console.log("");
        console.log("v1.z: ");
        console.log(v1.z);
        console.log("v1.z(): ");
        console.log(v1.z());
        console.log("v1.getZ(): ");
        console.log(v1.getZ());

        console.log("");
        console.log("v1.w: ");
        console.log(v1.w);
        console.log("v1.w(): ");
        console.log(v1.w());
        console.log("v1.getW(): ");
        console.log(v1.getW());

        console.log("");
        console.log("v1: ");
        console.log(v1);
        console.log("v1.toString(): ");
        console.log(v1.toString());
   }
}

