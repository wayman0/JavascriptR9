/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Matrix} object has four {@link Vector} objects.
<p>
   The four {@link Vector} objects represent the four column vectors
   of the 4-by-4 matrix (as in a Linear Algebra course).
<p>
   In computer graphics, the points and vectors of 3-dimensional space
   are represented using 4-dimensional homogeneous coordinates.
   So each transformation of 3-dimensional space is represented by
   a 4-by-4 (homogeneous) matrix.
<p>
   A 4-by-4 matrix represents a transformation of 3-dimensional space.
   The most common transformations are translation, rotation, and
   scaling. A 4-by-4 matrix can also represent a projection transformation.
*/

import Scene from "./SceneImport.js";

export default class Matrix
{
   v1;
   v2;
   v3;
   v4;
   static #instantiable = false;

   /**
    * Construct an arbitrary 4x4 {@code Matrix} with the given column {@link Vector}s
    * 
    * NOTE: Use the Static Factory method to create a matrix.  
    * This is for internal use only.
    * 
    * @param {@link Vector} v1 1st column for the new {@code Matrix}
    * @param {@link Vector} v2 2nd column for the new {@code Matrix}
    * @param {@link Vector} v3 3rd column for the new {@code Matrix}
    * @param {@link Vector} v4 4th column for the new {@code Matrix}
    */
   constructor(v1, v2, v3, v4)
   {
      if(Matrix.#instantiable == false)
         throw new Error("NON INSTANTIABLE Class");
      
      if(v1 instanceof Vector == false ||
         v2 instanceof Vector == false ||
         v3 instanceof Vector == false ||
         v4 instanceof Vector == false)
            throw new Error("All parameters must be Vectors");

      this.v1 = v1;
      this.v2 = v2;
      this.v3 = v3;
      this.v4 = v4;

      Matrix.#instantiable = false;
   }

   /**
    * This is a static Factory method
    * 
    * Construct a 4x4 {@code Matrix} using the given column {@link Vector}s
    * @param {@link Vector} c1 1st column for the new {@code Matrix}
    * @param {@link Vector} c2 2nd column for the new {@code Matrix}
    * @param {@link Vector} c3 3rd column for the new {@code Matrix}
    * @param {@link Vector} c4 4th column for the new {@code Matrix}
    * @returns a new {@code Matrix} made from c1, c2, c3, c4
    */
   static buildFromColummns(c1, c2, c3, c4)
   {
      Matrix.#instantiable = true;
      return this(c1, c2, c3, c4);
   }

   /**
    * This is a static factory method.
    * 
    * Construct a 4x4 {@code Matrix} using the given row {@link Vector}s
    * @param {@link Vector} r1 1st row for the new {@code Matrix}
    * @param {@link Vector} r2 2nd row for the new {@code Matrix}
    * @param {@link Vector} r3 3rd row for the new {@code Matrix}
    * @param {@link Vector} r4 4th row for the new {@code Matrix}
    * @returns a new {@code Matrix} made from r1, r2, r3, r4
    */
   static buildFromRows(r1, r2, r3, r4)
   {
      if(r1 instanceof Vector == false ||
         r2 instanceof Vector == false ||
         r3 instanceof Vector == false ||
         r4 instanceof Vector == false)
            throw new Error("All parameters must be Vectors");

      c1 = new Vector(r1.x, r2.x, r3.x, r4.x);
      c2 = new Vector(r1.y, r2.y, r3.y, r4.y);
      c3 = new Vector(r1.z, r2.z, r3.z, r4.z);
      c4 = new Vector(r1.w, r2.w, r3.w, r4.w);
      
      Matrix.#instantiable = true;

      return this(c1, c2, c3, c4);
   }

   /**
    * this is a static factory method.
    * Construct an identity {@code Matrix}
    * 
    * @returns an identity {@code Matrix} 
    */
   static identity()
   {
      return Matrix.scaleXYZ(1, 1, 1);
   }

   /**
    * This is a static Factory Method.
    * Construct a translation {@code Matrix} that translates by the
    * given amounts in the x, y, and z directions.
    * 
    * @param {@link Number} x translation factor for the x direction. 
    * @param {@link Number} y translation factor for the y direction.
    * @param {@link Number} z translation factor for the z direction.
    * @returns a new translation {@code Matrix}
    */
   static translate(x, y, z)
   {
      if(typeof x != Number || typeof y != Number || typeof z != Number)
         throw new Error("All parameters must be numerical");

      Matrix.#instantiable = true;
      return this(new Vector(1, 0, 0, 0),
                  new Vector(0, 1, 0, 0),
                  new Vector(0, 0, 1, 0), 
                  new Vector(x, y, z, 1));
   }

   /**
    * this is a static Factory method.
    * Construct a diagonal {@code Matrix} with the given number on the diagonal.
    * 
    * @param {@link Number} d the diagonal value for the new {@code Matrix}
    * @returns a new scale {@code Matrix}
    */
   static scale(d)
   {
      if(typeof d != Number)
         throw new Error("D must be numerical");

      return Matrix.scaleXYZ(d, d, d);
   }

   /**
    * This is a static factory mehtod.
    * Construct a diagonal {@code Matrix} that scales in the 
    * x, y, and z directions by the given values.
    * 
    * @param {@link Number} x scale factor for the x direction
    * @param {@link Number} y scale factor for the y direction
    * @param {@link Number} z scale factor for the z direction
    * @returns a new scaling {@code Matrix}
    */
   static scaleXYZ(x, y, z)
   {
      if(typeof x != Number || typeof y != Number || typeof z != Number)
         throw new Error("All parameters must be numercial");

      Matrix.#instantiable = true;
      return this(new Vector(x, 0, 0, 0), 
                  new Vector(0, y, 0, 0,),
                  new Vector(0, 0, z, 0), 
                  new Vector(0, 0, 0, 1));
   }
   
   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the x axis by the given angle theta.
    * 
    * @param {@link Number} theta angle in degrees to rotate around the x axis by
    * @returns a new rotation {@code Matrix}
    */
   static rotateX(theta)
   {
      if(typeof theta != Number)
         throw new Error("Theta must be numerical");

      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 1, 0, 0);
   }

   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the y axis by the given angle theta.
    * 
    * @param {@link Number} theta angle in degrees to rotate around the y axis by
    * @returns a new rotation {@code Matrix}
    */
   static rotateY(theta)
   {
      if(typeof theta != Number)
         throw new Error("Theta must be numerical");

      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 0, y, 0);
   }

   /**
    * This is a static factory mehtod.
    * Construct a rotation {@code Matrix} that rotates around
    * the z axis by the given angle theta.
    * 
    * @param {@link Number} theta angle in degrees to rotate around the z axis by
    * @returns a new rotation {@code Matrix}
    */
   static rotateZ(theta)
   {
      if(typeof theta != Number)
         throw new Error("Theta must be numerical");
      
      Matrix.#instantiable = true;
      return Matrix.rotate(theta, 0, 0, 1);
   }

   /**
      This is a static facory method.
      <p>
      Construct a rotation {@code Matrix} that rotates around
      the axis vector {@code (x,y,z)} by the angle {@code theta}.
      <p>
      See
      <a href="https://www.opengl.org/sdk/docs/man2/xhtml/glRotate.xml" target="_top">
               https://www.opengl.org/sdk/docs/man2/xhtml/glRotate.xml</a>

    * @param {@link Number} theta angle in degrees to rotate around the axis vector by
    * @param {@link Number} x the x component of the axis vector to rotate around
    * @param {@link Number} y the y component of the axis vector to rotate around
    * @param {@link Number} z the z component of the axis vector to rotate around
    * @returns a new rotation {@code Matrix}
    */
   static rotate(theta, x, y, z)
   {
      if(typeof theta != Number || typeof x != Number ||
         typeof y != Number || typeof z != Number)
            throw new Error("All parameters need to be numerical");

      norm = Math.sqrt(x*x + y*y + z*z);
      ux = x/norm;
      uy = y/norm;
      uz = z/norm;

      c = Math.cos( Math.PI/180 * theta);
      s = Math.sin( Math.PI/180 * theta);

      Matrix.#instantiable = true;
      return this(new Vector(ux*ux*(1-c)+c,      uy*ux*(1-c)+(uz*s), uz*ux*(1-c)-(uy*s), 0.0),
                  new Vector(ux*uy*(1-c)-(uz*s), uy*uy*(1-c)+c,      uz*uy*(1-c)+(ux*s), 0.0),
                  new Vector(ux*uz*(1-c)+(uy*s), uy*uz*(1-c)-(ux*s), uz*uz*(1-c)+c,      0.0),
                  new Vector(0.0,                0.0,                0.0,                1.0));
 
   }

   /**
    * A scalar times this {@code Matrix} returns a new {@code Matrix}
    * 
    * @param {@link Number} s scalar value to multiply this {@code Matrix} by 
    * @returns a new scaled {@code Matrix} = this * s
    */
   timesScalar(s)
   {
      if(typeof s != Number)
         throw new Error("S must be numerical");

      Matrix.#instantiable = true;
      return this(this.v1.times(s), this.v2.times(s), this.v3.times(s), this.v4.times(s));
   }

   /**
    * This {@code Matrix} times a {@link Vertex} returns a new {@link Vertex}
    * 
    * @param {@link Vertex} v the vertex to be multiplied by this {@code Matrix} 
    * @returns a new {@link Vertex} = this * v
    */
   timesVertex(v)
   {
      if(v instanceof Vertex == false)
         throw new Error("V must be a Vertex");

      newX = this.v1.x * v.x + this.v2.x * v.y + this.v3.x * v.z + this.v4.x + v.w;
      newY = this.v1.y * v.x + this.v2.y * v.y + this.v3.y * v.z + this.v4.y + v.w;
      newZ = this.v1.z * v.x + this.v2.z * v.y + this.v3.z * v.z + this.v4.z + v.w;
      newW = this.v1.w * v.x + this.v2.w * v.y + this.v3.w * v.z + this.v4.w + v.w;

      return new Vertex(newX, newY, newZ, newW);
   }

   /**
    * This {@code Matrix} times a {@link Vector} returns a new {@link Vector}
    * 
    * @param {@link Vector} v the vector to be multiplied by this {@code Matrix} 
    * @returns a new {@link Vector} = this * v
    */
   timesVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");

         newX = this.v1.x * v.x + this.v2.x * v.y + this.v3.x * v.z + this.v4.x + v.w;
         newY = this.v1.y * v.x + this.v2.y * v.y + this.v3.y * v.z + this.v4.y + v.w;
         newZ = this.v1.z * v.x + this.v2.z * v.y + this.v3.z * v.z + this.v4.z + v.w;
         newW = this.v1.w * v.x + this.v2.w * v.y + this.v3.w * v.z + this.v4.w + v.w;
   
         return new Vector(newX, newY, newZ, newW);
   }

   /**
    * this {@code Matrix} times {@code Matrix} returns a new {@code Matrix}
    * 
    * @param {@code Matrix} m the matrix to be multiplied on the right of this {@code Matrix}
    * @returns a new {@code Matrix} = this * m
    */
   timesMatrix(m)
   {
      if(m instanceof Matrix == false)
         throw new Error("M is not a Matrix");
         
      Matrix.#instantiable = true;
      return this(this.timesVector(m.v1), this.timesVector(m.v2), 
                  this.timesVector(m.v3), this.timesVector(m.v4));
   }

   /**
    * Mutate this {@code Matrix} to contain the product of this * s
    * 
    * @param {@link Number} s the number to scale this {@code Matrix} by 
    * @returns a reference to this scaled {@code Matrix}
    */
   timesEqualsScalar(s)
   {
      if(typeof s != Number)
         throw new Error("S is not numerical");

      this.v1.timesEqualsScalar(s);
      this.v2.timesEqualsScalar(s);
      this.v3.timesEaualsScalar(s);
      this.v3.timesEqualsScalar(s);

      return this;
   }

   /**
    * Mutate this {@code Matrix} to contain the product of this * m
    * @param {@code Matrix} m the matrix to be multiplied on the right of this {@code Matrix} 
    * @returns a reference to this multiplied {@code Matrix} to facilitate chaining methods
    */
   mult(m)
   {
      if(m instanceof Matrix == false)
         throw new Error("M is not a Matrix");

      x = m.v1.x;
      y = m.v1.y;
      z = m.v1.z;
      w = m.v1.w;
      x1 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      y1 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      z1 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      w1 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;
      
      x = m.v2.x;
      y = m.v2.y;
      z = m.v2.z;
      w = m.v2.w;
      x2 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      y2 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      z2 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      w2 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;
      
      x = m.v3.x;
      y = m.v3.y;
      z = m.v3.z;
      w = m.v3.w;
      x3 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      y3 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      z3 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      w3 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;
      
      x = m.v4.x;
      y = m.v4.y;
      z = m.v4.z;
      w = m.v4.w;

      x4 = this.v1.x * x + this.v2.x * y + this.v3.x * z + this.v4.x * w;
      y4 = this.v1.y * x + this.v2.y * y + this.v3.y * z + this.v4.y * w;
      z4 = this.v1.z * x + this.v2.z * y + this.v3.z * z + this.v4.z * w;
      w4 = this.v1.w * x + this.v2.w * y + this.v3.w * z + this.v4.w * w;
      
      this.v1.x = x1;
      this.v1.y = y1;
      this.v1.z = z1;
      this.v1.w = w1;

      this.v2.x = x2;
      this.v2.y = y2;
      this.v2.z = z2;
      this.v2.w = w2;

      this.v3.x = x3;
      this.v3.y = y3;
      this.v3.z = z3;
      this.v3.w = w3;

      this.v4.x = x4;
      this.v4.y = y4;
      this.v4.z = z4;
      this.v4.w = w4;

      return this;
   }

   /**
    * Mutate this {@code Matrix} to contain the product of m * this
    * 
    * @param {@code Matrix} m the matrix to be multiplied on the left of this {@code Matrix}
    * @returns a reference to this multiplied {@code Matrix} for method chaining
    */
   multLeft(m)
   {
      if(m instanceof Matrix)
         throw new Error("M is not a  Matrix");

      this.v1.timesEqualsMatrix(m);
      this.v2.timesEqualsMatrix(m);
      this.v3.timesEqualsMatrix(m);
      this.v4.timesEaualsMatrix(m);

      return this;
   }

   /**
    * For debugging.
    * 
    * @returns {@link String} representation of this {@code Matrix} 
    */
   toString()
   {
      result = "";

      result += "[[" + this.v1.x + " " + this.v2.x + " " + this.v3.x + " " + this.v4.x + "]\n";
      result += " [" + this.v1.y + " " + this.v2.y + " " + this.v3.y + " " + this.v4.y + "]\n";
      result += " [" + this.v1.z + " " + this.v2.z + " " + this.v3.z + " " + this.v4.z + "]\n";
      result += " [" + this.v1.w + " " + this.v2.w + " " + this.v3.w + " " + this.v4.w + "]]\n";
   
      return result;
   }
}