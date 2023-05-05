/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*

/**
   Create a wireframe model of a square in the xy-plane centered at the origin.
*/

//@ts-check

import format from "../../StringFormat";
import {Model, Vertex, LineSegment} from "../scene/SceneImport.js";

export default class SquareGrid extends Model
{
   r;
   n;
   k;

   /**
      Create a square in the xy-plane with corners {@code (�r, �r, 0)} and
      with {@code n} grid lines parallel to the x-axis and
      with {@code k} grid lines parallel to the y-axis.
   <p>
      If there are {@code n} grid lines parallel to the x-axis, then each
      grid line parallel to the y-axis will have {@code n+1} line segments.
      If there are {@code k} grid lines parallel to the y-axis, then each
      grid line parallel to the x-axis will have {@code k+1} line segments.

      @param {number} r  determines the corners of the square
      @param {number} n  number of grid lines parallel to the x-axis
      @param {number} k  number of grid lines parallel to the y-axis
   */
   constructor(r = 1, n = 4, k = 4)
   {
      super(undefined, undefined, undefined, format("Square Grid(%.2f,%d,%d)", r, n, k));

      if (n < 0)
         throw new Error("n must be greater than or equal to 0");
      if (k < 0)
         throw new Error("k must be greater than or equal to 0");
      if (r <= 0)
         throw new Error("r must be greater than 0");

      this.r = r;
      this.n = n;
      this.k = k;

      // Create the square's geometry.

      const xStep = (2 * r) / (1 + k);
      const yStep = (2 * r) / (1 + n);

      // An array of vertices to be used to create the line segments.
      /**@type {Vertex[][]} */
      const v = new Array(n+2);
      for(let x = 0; x < v.length; x += 1)
         v[x] = new Array(k+2);

      // Create all the vertices.
      for(let i = 0; i <= n + 1; ++i)
      {
         for(let j = 0; j <= k + 1; ++j)
            v[i][j] = new Vertex(r - j * xStep, -r + i * yStep, 0);
      }

      // Add all of the vertices to this model.
      for(let i = 0; i < n + 2; ++i)
      {
         for(let j = 0; j < k + 2; ++j)
            this.addVertex( v[i][j] );
      }

      // Create the line segments parallel to the x-axis.
      for(let i = 0; i < n + 2; ++i)
      {
         for(let j = 0; j < k + 1; ++j)
            this.addPrimitive(LineSegment.buildVertex((i*(k+2)) + j,        // v[i][j  ]
                                                      (i*(k+2)) + (j+1) )); // v[i][j+1]
      }

      // Create the line segments parallel to the y-axis.
      for(let j = 0; j < k + 2; ++j)
      {
         for(let i = 0; i < n + 1; ++i)
            this.addPrimitive(LineSegment.buildVertex((i*(k+2)) + j,    // v[i  ][j]
                                                      ((i+1)*(k+2)) + j )); // v[i+1][j]
      }

   }
}//SquareGrid
