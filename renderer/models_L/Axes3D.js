/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a positive x, y, and z axis in 3-dimensional space.
*/
//@ts-check
import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import Color from "../color/Color.js";

export default class Axes3D extends Model
{
   /**
      Create an x, y, and z axis with the
      given endpoints for each axis.
      Use the given {@link Color} for each axis.

      @param {number} [xMin=-1]  left endpoint of the x-axis
      @param {number} [xMax=1]  right endpoint of the x-axis
      @param {number} [yMin=-1]  bottom endpoint of the y-axis
      @param {number} [yMax=1]  top endpoint of the y-axis
      @param {number} [zMin=-1]  back endpoint of the z-axis
      @param {number} [zMax=1]  front endpoint of the z-axis
      @param {Color} [cX=Color.white]    {@link Color} for the x-axis
      @param {Color} [cY=Color.white]    {@link Color} for the y-axis
      @param {Color} [cZ=Color.white]    {@link Color} for the z-axis
   */
   constructor(xMin=-1, xMax=1, yMin=-1, yMax=1, zMin=-1, zMax=1, cX=Color.white, cY=Color.white, cZ=Color.white)
   {
      super(undefined, undefined, undefined, "Axes 3D");

      this.addVertex(new Vertex(xMin, 0,    0),
                     new Vertex(xMax, 0,    0),
                     new Vertex( 0,  yMin,  0),
                     new Vertex( 0,  yMax,  0),
                     new Vertex( 0,   0,   zMin),
                     new Vertex( 0,   0,   zMax));

      this.addColor(cX, cY, cZ);

      this.addPrimitive(LineSegment.buildVertexColor(0, 1, 0),  // use color cX
                        LineSegment.buildVertexColor(2, 3, 1),  // use color cY
                        LineSegment.buildVertexColor(4, 5, 2)); // use color cZ
   }
}//Axes3D
