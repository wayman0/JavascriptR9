/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Vector} object holds four doubles, which makes it a vector
   in 4-dimensional space.
<p>
   In computer graphics, we use 4-dimensional homogeneous coordinates
   to represent vectors (and points) in 3-dimensional space.
<p>
   Unlike a homogeneous {@link Vertex}, a homogeneous {@code Vector} usually
   has its fourth coordinate set to 0.
*/

import Vertex from "./Vertex.js";
import Matrix from "./Matrix.js";

export default class Vector
{
   x;
   y;
   z;
   w;

   /**
    * Create a new {@code Vector} using the given x, y, z, and w coordinates
    * If no w is given uses the default value of 0.
    * 
    * @param {@link Number} x x coordinate of the new {@code Vector}
    * @param {@link Number} y y coordinate of the new {@code Vector}
    * @param {@link Number} z z coordinate of the new {@code Vector}
    * @param {@link Number} w w coordinate of the new {@code Vector}
    */
   constructor(x, y, z, w = 0.0)
   {
      if(typeof x != Number || typeof y != Number || 
         typeof z != Number || typeof w != Number)
            throw new Error("All parameters must be numerical.");
      this.x = x;
      this.y = y; 
      this.z = z; 
      this.w = w;
   }

   /**
    * Create a new {@code Vector} from a {@link Vertex}
    * 
    * @param {@link Vertex} v the vertex to convert into a {@code Vector}
    * @returns the new {@code Vector} created from a {@link Vertex}
    */
   static buildVertex(v)
   {
      if(v instanceof Vertex == false)
         throw new Error("V is not a Vertex");

      return this(v.x, v.y, v.z, v.w);
   }

   /**
    * The dot-product of two {@code Vector}s which returns a scalar
    * 
    * @param {@code Vector} v the vector to multiply with this {@code Vector}
    * @returns a number that is the dot product of this {@code Vector} and v
    */
   dotProduct(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");
      
      return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
   }

   /**
    * The cross produce of two {@code Vector}s returns a (new) {@code Vector}
    * 
    * @param {@code Vector} v the vector to mutliply with this {@code Vector}
    * @returns the new {@code Vector} that is the cross product of this {@code Vector} and v
    */
   crossProduct(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");
      
         return new Vector(this.y*v.z - this.z*v.y, thi.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x);
   }

   /**
    * A scalar times a {@code Vector} returns a (new) {@code Vector}
    * 
    * @param {@link Number} s the number to multiply this {@code Vector} by 
    * @returns a new {@code Vector} that is the scalar times this {@code Vector}
    */
   timesScalar(s)
   {
      if(typeof s != Number)
         throw new Error("S has to be numerical");

      return new Vector(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
   }

   /**
    * A {@code Vector} plus a {@code Vector} returns a (new) {@code Vector}
    * 
    * @param {@code Vector} v the vector to add to this {@code Vector} 
    * @returns a new {@code Vector} object that is the sum of this {@code Vector} and v
    */
   plusVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");

      return new Vector(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
   }

   /**
    * A {@code Vector} minus a {@code Vector} returns a (new) {@code Vector}
    * 
    * @param {@code Vector} v the vector to subtract from this {@code Vector}
    * @returns a new {@code Vector} that is this {@code Vector} minus v
    */
   minusVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");
      
      return new Vector(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
   }

   /**
    * Return the normalized version of this {@code Vector}
    * <p>
    * That is, return the {@code Vector} with length 1 that 
    * points in the same direction as this {@code Vector}
    * 
    * @returns a new {@code Vector} that has length one and has the same direction of this {@code Vector}
    */
   normalize()
   {
      norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

      return new Vector(this.x/norm, this.y/norm, this.z/norm);
   }

   /**
    * A {@code Vector} plus a {@link Vertex} returns a new {@link Vertex}
    * The vector translates the vertex to a new location.
    * 
    * @param {@link Vertex} v the vertex to add to this {@code Vector} 
    * @returns a new {@link Vertex} that is the translation of {@code v} by this {@code Vector}
    */
   plusVertex(v)
   {
      if(v instanceof Vertex == false)
         throw new Error("V is not a vertex");

      return new Vertex(this.x + v.x, this.y + v.y, this.z + v.z);
   }

   /**
    * MUTATE this {@code Vector} to contain the product of {@code Vector}
    * with the scalar {@code s}
    * 
    * @param {@link Number} s the number to multiply this {@code Vector} by 
    * @returns a reference to this {@code Vector} for method chaining.
    */
   timesEqualsScalar(s)
   {
      if(typeof s != Number)
         throw new Error("S is not a number");

      this.x *= s;
      this.y *= s;
      this.z *= s;
      this.w *= s;

      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the product of this {@code Vector} 
    * with the {@link Matrix} {@code m}
    * 
    * @param {@link Matrix} m the matrix to multiply this {@code Vector} by 
    * @returns a reference to this {@code Vector} for method chaining.
    */
   timesEqualsMatrix(m)
   {
      v1 = m.v1;
      v2 = m.v2;
      v3 = m.v3;
      v4 = m.v4;

      newX = v1.x * this.x + v2.x * this.y + v3.x * this.z + v4.x * this.w;
      newY = v1.y * this.x + v2.y * this.y + v3.y * this.z + v4.y * this.w;
      newZ = v1.z * this.x + v2.z * this.y + v3.z * this.z + v4.z * this.w;
      newW = v1.w * this.x + v2.w * this.y + v3.w * this.z + v4.w * this.w;
   
      this.x = newX;
      this.y = newY;
      this.z = newZ;
      this.w = newW;

      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the sum of this {@code Vector}
    * with the {@code Vector} {@code v}
    * 
    * @param {@code Vector} v the vector to add to this {@code Vector}
    * @returns a reference to this {@code Vector} for method chaining.
    */
   plusEquals(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");

      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      this.w += v.w;
      
      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the differenceo of this {@code Vector}
    * with the {@code Vector} {@code v}
    * 
    * @param {@code Vector} v the vector to subtract form this {@code Vector}
    * @returns a reference to this {@code Vector} for method chaining.
    */
   minusEquals(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");

      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      this.w -= v.w;

      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the normalized version of 
    * this {@code Vector}
    * <p>
    * that is mutate this {@code Vector} to have length 1
    * 
    * @returns a reference to this {@code Vector} for method chaining 
    */
   normalizeEquals()
   {
      norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      
      this.x /= norm;
      this.y /= norm;
      this.z /= norm;

      return this;
   }   

   /**
    * For debugging.
    * 
    * @returns the {@link String} representation of this {@code Vector}
    */
   toString()
   {
        return "[x,y,z,w]=[" + x + ", " + y + ", " + z + ", " + w + "]";      
   }
}