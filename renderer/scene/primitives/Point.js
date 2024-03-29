/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Point} object has two integers that represent the location
   and color of a single {@link renderer.scene.Vertex}. The first integer
   is an index into the {@link renderer.scene.Vertex} list of a
   {@link renderer.scene.Model} object and the second integer is an index
   into the {@link java.awt.Color} list of that {@link renderer.scene.Model}
   object.
*/
import Primitive from "./Primitive.js";

export default class Point extends Primitive
{
    radius = 0;

    /**
     * Construct a {@code Point} object using an integer index.
      Use the given index for both the {@link renderer.scene.Vertex}
      and the {@link java.awt.Color} lists.
      <p>
      NOTE: This constructor does not put a {@link renderer.scene.Vertex}
      or a {@link java.awt.Color} object into this {@link Primitive}'s
      {@link renderer.scene.Model} object. This constructor assumes that
      the given index is valid (or will be valid by the time this
      {@link Primitive} gets rendered).
      <p>
      NOTE: uses the default value of 0 for the vertex index and
            uses the default value of the vertex index for the color index.

     * @param {@link Number} vIndex index for the vertex to be used
     * @param {@link Number} cIndex index for the color to be used
     * @returns 
     */
    constructor(vIndex = 0, cIndex = vIndex)
    {
        return Primitive.buildIndices(vIndex, cIndex);
    }

    /**
     * For Debugging.
     * 
     * @returns the {@link String} representation of this {@code Point}
     */
    toString()
    {
        return ("Point: ([" + this.getVertexIndexList()[0] + "], " +
                        "[" + this.getColorIndexList()[0] + "]) " + 
                        "radius = " + this.radius);
    }


}