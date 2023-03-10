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

import Scene from "./SceneImport.js";

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
    constructor(x, y, z, w = 1.0)
    {
        if( typeof x != Number || typeof y != Number ||
            typeof z != Number || typeof w != Number)
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

    getY()
    {
        return this.#y;
    }

    y = () => {return this.#y;}

    getZ()
    {
        return this.#z;
    }

    z = () => {return this.#z;}

    getW()
    {
        return this.#w;
    }

    w = () => {return this.#w;}
    
    //could we create an anonymous function 
    //pointed to by a variable named x
    //to replicate in java vertex1.x?

    x = () => {return this.#x};
    y = () => {return this.#y};
    z = () => {return this.#z};
    w = () => {return this.#w};
    

   /**
    * For debugging.
    * 
    * @returns the {@link String} representation of this {@code Vertex}
    */
   toString()
   {
        return "(x,y,z,w)=(" + x + ", " + y + ", " + z + ", " + w + ")";      
   }
}

