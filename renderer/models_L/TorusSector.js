/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a partial torus.
<p>
   See <a href="https://en.wikipedia.org/wiki/Torus" target="_top">
                https://en.wikipedia.org/wiki/Torus</a>
<p>
   This partial torus is the surface of revolution generated by revolving
   a sector of the circle in the xy-plane with radius {@code r2} and center
   {@code (r1,0,0)} part way around the y-axis. We are assuming that
   {@code r1 > r2}.
<p>
   The whole torus is the surface of revolution generated by revolving
   the whole circle in the xy-plane with radius {@code r2} and center
   {@code (r1,0,0)} all the way around the y-axis.
<p>
   Here are parametric equations for the circle in the xy-plane with
   radius {@code r2} and center {@code (r1,0,0)} and parameterized
   starting from the top, with parameter {@code 0 <= phi <= 2*PI}.
   <pre>{@code
      x(phi) = r1 + r2 * sin(phi)
      y(phi) =      r2 * cos(phi)
      z(phi) = 0
   }</pre>
   Here is the 3D rotation matrix that rotates around the y-axis
   by {@code theta} radians with {@code 0 <= theta <= 2*PI}.
   <pre>{@code
      [ cos(theta)   0   sin(theta)]
      [     0        1       0     ]
      [-sin(theta)   0   cos(theta)]
   }</pre>
   If we multiply the rotation matrix with the circle parameterization,
   we get a parameterization of the torus.
   <pre>{@code
      [ cos(theta)   0   sin(theta)]   [r1 + r2 * sin(phi)]
      [     0        1       0     ] * [     r2 * cos(phi)]
      [-sin(theta)   0   cos(theta)]   [        0         ]

      = ( r1*cos(theta) + r2*cos(theta)*sin(phi).
          r2*cos(phi),
         -r1*sin(theta) - r2*sin(theta)*sin(phi) )

      = ( (r1 + r2*sin(phi)) * cos(theta),
                r2*cos(phi),
         -(r1 + r2*sin(phi)) * sin(theta) )
   }</pre>
   See
     <a href="https://en.wikipedia.org/wiki/Torus#Geometry" target="_top">
              https://en.wikipedia.org/wiki/Torus#Geometry</a>

   @see Torus
*/
//@ts-check 

import {Model, Vertex, LineSegment} from "../scene/SceneExports.js";
import format from "../../StringFormat";

export default class TorusSector extends Model 
{
   /**@type {number} */ #r1;
   /**@type {number} */ #r2;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #phi1;
   /**@type {number} */ #phi2;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a partial torus with a partial circle of revolution with
      radius {@code r1} and a partial cross section circle with radius
      {@code r2}.
   <p>
      If {@code phi1 > 0} or {@code phi2 < 2*PI}, then the (partial) cross
      section circle is the circular sector from angle {@code phi1} to angle
      {@code phi2}. In other words, the (partial) circles of longitude in the
      model extend from angle {@code phi1} to angle {@code phi2}.
   <p>
      If {@code theta1 > 0} or {@code theta2 < 2*PI}, then the (partial) circle
      of revolution is the circular sector from angle {@code theta1} to angle
      {@code theta2}. In other words, the (partial) circles of latitude in
      the model extend from angle {@code theta1} to angle {@code theta2}.
   <p>
      The last two parameters determine the number of (partial) circles of
      longitude and the number of (partial) circles of latitude in the model.
   <p>
      If there are {@code k} circles of longitude, then each (partial)
      circle of latitude will have {@code k-1} line segments.
      If there are {@code n} (partial) circles of latitude, then each
      circle of longitude will have {@code n-1} line segments.
   <p>
      There must be at least four circles of longitude and at least
      four circles of latitude.

      @param {number} [r1    =.75]  radius of the circle of revolution
      @param {number} [r2    =.25]  radius of the cross section circle (circle of longitude)
      @param {number} [theta1=Math.PI/2]    beginning longitude angle for the circle of revolution
      @param {number} [theta2=3*Math.PI/2]  ending longitude angle for the circle of revolution
      @param {number} [phi1  =Math.PI]    beginning latitude angle for the cross section circle
      @param {number} [phi2  =2*Math.PI]  ending latitude angle for the cross section circle
      @param {number} [n     =6]  number of circles of latitude
      @param {number} [k     =8]  number of circles of longitude
   */
   constructor(r1=.75, r2=.25, theta1=Math.PI/2, theta2=3*Math.PI/2, phi1=Math.PI, phi2 = 2*Math.PI, n=6, k=8)
   {
      super(undefined, undefined, undefined, format("Torus Sector(%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%d,%d)", r1, r2, theta1, theta2, phi1, phi2, n, k));

      if (n < 4)
         throw new Error("n must be greater than 3");
      if (k < 4)
         throw new Error("k must be greater than 3");

      this.#r1 = r1;
      this.#r2 = r2;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#phi1 = phi1;
      this.#phi2 = phi2;
      this.#n = n;
      this.#k = k;

      // Create the torus's geometry.

      const deltaPhi = (phi2 - phi1) / (n - 1);
      const deltaTheta = (theta2 - theta1) / (k - 1);

      // An array of vertices to be used to create line segments.
      /** @type {Vertex[][]} */
      const v = new Array(n);
      for(let i = 0; i < v.length; i += 1)
         v[i] = new Array(k);

      // Create all the vertices.
      for (let j = 0; j < k; ++j) // choose a rotation around the y-axis
      {
         const c1 = Math.cos(theta1 + j * deltaTheta);
         const s1 = Math.sin(theta1 + j * deltaTheta);
         for (let i = 0; i < n; ++i)  // go around a cross section circle
         {
            const c2 = Math.cos(phi1 + i * deltaPhi);
            const s2 = Math.sin(phi1 + i * deltaPhi);
            v[i][j] = new Vertex( (r1 + r2*s2) * c1,
                                        r2*c2,
                                 -(r1 + r2*s2) * s1 );
         }
      }

      // this.add all of the vertices to this model.
      for (let i = 0; i < n; ++i)
      {
         for (let j = 0; j < k; ++j)
            this.addVertex( v[i][j] );
      }

      // Create the vertical (partial) cross-section circles.
      for (let j = 0; j < k; ++j) // choose a rotation around the y-axis
      {
         for (let i = 0; i < n - 1; ++i) // go around a cross section circle
            //                                 v[i][j]      v[i+1][j]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, ((i+1) * k) + j ));
      }

      // Create all the horizontal (partial) circles around the torus.
      for (let i = 0; i < n; ++i) //choose a rotation around the cross section
      {
         for (let j = 0; j < k - 1; ++j) // go around a horizontal circle
            //                                v[i][j]       v[i][j+1]
            this.addPrimitive(LineSegment.buildVertex( (i * k) + j, (i * k) + (j+1) ));
      }
   }
}//TorusSector
