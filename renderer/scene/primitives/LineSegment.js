/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code LineSegment} object has four integers that
   represent the endpoints of the line segment and the
   color at each endpoint. Two of the integers are indices
   into the {@link renderer.scene.Vertex} list of a
   {@link renderer.scene.Model} object and the other two
   integers are indices into the {@link java.awt.Color}
   list of that {@link renderer.scene.Model} object.
*/

import {Primitive} from "./PrimitiveImport";


export default class LineSegment extends Primitive
{
    /**
     * Constructs a {@code LineSegment} using the 2 given {@link Array}s of integer indices.
     * <p>
     * NOTE: this constructor does nut put any {@link renderer.scene.Vertex} or {@link renderer.color.Color} into this
     * {@link Primitive} {@link renderer.scene.Model} object. This constructor assumes that
     * the given indices are valid or will be by the time this {@link Primitive} is rendered.
     * 
     * @param {@link Array} vIndList list of integer indexes to a {@link renderer.scene.Vertex} list
     * @param {@link Array} cIndList list of integer indexes to a {@link renderer.color.Color} list
     */
    constructor(vIndList = new Array(2), cIndList = new Array(2))
    {
        if(!vIndList.isArray() || !cIndList.isArray())
            throw new Error("Vertex and Color index lists must be array");

        if(vIndList.length != 2 || cIndList.length != 2)
            throw new Error("Need 2 points to make a line segment");

        super(vIndList, cIndList);
    }

    /**
     * Construct a {@code LineSegment} using the two gien integer indexes 
     * to access both the vertex and color list in the {@link renderer.scene.Model}
     * NOTE: uses 0 and 1 as the default indexes
     * 
     * @param {@link Number} i0 the first endpoint index into the vertex and color list
     * @param {@link Number} i1 the second endpoint index into the vertex and color list
     * @returns the new {@code LineSegment} created from the given data
     */
    static buildVertex(i0 = 0, i1 = 1)
    {
        return this(new Array(i0, i1), new Array(i0, i1));
    } 

    /**
     * Construct a {@code LineSemgnet} using the 2 integer indexes for the 
     * vertexes and the one index for the colors.
     * Note uses 0 and 1 as the default index for the vertexes and 0 for the color
     * 
     * @param {@link Number} i0 the first endpoint index into the vertex list
     * @param {@link Number} i1 the second endpoint index into the vertex list
     * @param {@link Number} c the color index into the color list
     * @returns a new {@code LineSegment} containing the given data.
     */
    static buildVertexColor(i0 = 0, i1 = 1, c = 0)
    {
        return this(new Array(i0, i1), new Array(c, c));
    }

    /**
     * Construct a {@code LineSegment} using the 2 integer indexes for the 
     * vertexes and the 2 integer indexes for the colors
     * Note uses 0 and 1 as the default first and second indexes.
     * 
     * @param {@link Number} i0 the first endpoint index into the vertex list
     * @param {@link Number} i1 the second endpoint index into the vertex list
     * @param {@link Number} c0 the first endopoint color index int the color list
     * @param {@link Number} c1 the second endpoint color index into the color list
     * @returns a new {@code LineSegment} containing the given data.
     */
    static buildVertexColors(i0 = 0, i1 = 1, c0 = 0, c1 = 1)
    {
        return this(new Array(i0, i1), new Array(c0, c1));
    }

    /**
     * For debugging. 
     * 
     * @returns a {@link String} representation of this {@code LineSegment}
     */
    toString()
    {
        return ("LineSegment: ([" + this.getVertexIndexList()[0] + ", " + this.getVertexIndexList()[1] + "], " 
                            + "[" + this.getColorIndexList()[0]  + ", " + this.getColorIndexList()[1] + "])");
    }

    /*
    constructor(i0 = 0, i1 = i0, c0 = 0, c1 = c0)
    {
        if( typeof i0 != Number || typeof i1 != Number ||
            typeof c0 != Number || typeof c1 != Number )
                throw new Error("All parameters must be numerical");

        super();

        this.getVertexIndexList().push(i0);
        this.getVertexIndexList().push(i1);
        this.getColorIndexList().push(c0);
        this.getColorIndexList().push(c1);
    }

    //need to think of better name
    static buildUsingVIndexes(i0 = 0, i1 = 1)
    {
        return this(i0, i1, i0, i1);
    }

    // need to think of better name
    static buildUsingColor(i0 = 0, i1 = 1, c = 0)
    {
        return this(i0, i1, c, c);
    }

    static buildUsingLists(vIndList = new Array(), cIndList = new Array())
    {

        
    }
    */
}