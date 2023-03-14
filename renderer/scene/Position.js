/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Position} data structure represents a group of geometric objects
   positioned (both location and orientation) in three-dimensional space as
   part of a {@link Scene}. A {@code Position} is a recursive data structure.
   Every {@code Position} object contains a {@link List} of nested
   {@code Position} objects. The list of nested {@code Position}s lets us
   define what are called hierarchical, or nested, scenes. These are scenes
   that are made up of groups of models and each group can be moved around
   in the scene as a single unit while the individual models in the group
   can also be moved around within the group.
<p>
   A {@code Position} object holds references to a {@link Model} object,
   a {@link Matrix} object, and a {@code List} of {@code Position} objects.
   A {@code Position}'s {@code List} of {@code Position} objects creates
   a tree data structure of {@code Position} objects. A {@code Position}'s
   {@link Model} object represents a geometric shape in the {@link Scene}.
   The role of a {@code Position}'s  {@link Matrix} can be understood two
   ways. First, the {@link Matrix} determines the {@link Model}'s location
   and orientation within the local coordinate system determined by the
   {@code Position}'s parent {@code Position} (in the {@link Scene}'s forest
   of {@code Position} objects). Second, the {@link Matrix} determines a new
   local coordinate system within which the {@link Model} (and all the nested
   models lower in the tree) is plotted. The two ways of understanding a
   {@code Position}'s  {@link Matrix} correspond to reading a matrix
   transformation expression
   <pre>{@code
                T * v
   }</pre>
   from either right-to-left or left-to-right.
<p>
   When the renderer renders a {@code Position} object, the renderer
   traverses the tree of {@code Position}s rooted at the given
   {@code Position}. The renderer does a recursive, pre-order
   depth-first-traversal of the tree. As the renderer traverses the tree,
   it accumulates a "current-transformation-matrix" that multiplies each
   {@code Position}'s {@link Matrix} along the path from the tree's root
   {@code Position} to wherever the traversal is in the tree (this is the
   "pre-order" step in the traversal). The {@code ctm} is the current
   model-to-view transformation {@link Matrix}. The first stage of the
   rendering pipeline, {@link renderer.pipeline.Model2View}, multiplies every
   {@link Vertex} in a {@link Model}'s vertex list by this {@code ctm}, which
   converts the coordinates in each {@link Vertex} from the model's own local
   coordinate system to the {@code Camera}'s view coordinate system (which is "shared"
   by all the other models). Multiplication by the {@code ctm} has the effect
   of "placing" the model in view space at an appropriate location (using the
   translation part of the {@code ctm}) and in the appropriate orientation
   (using the rotation part of the {@code ctm}). Notice the difference between
   a {@code Position}'s {@code ctm} and the {@code Position}'s {@link Matrix}.
   At any specific node in the {@link Scene}'s forest of {@code Position} nodes,
   the {@code Position}'s {@link Matrix} places the {@code Position}'s
   {@link Model} within the local coordinate system of the {@code Position}'s
   parent {@code Position}. But the {@code Position}'s {@code ctm} places the
   {@code Position}'s {@link Model} within the {@link Camera}'s view coordinate
   system.
*/
import {Camera, Matrix, Model, OrthoNorm, PerspNorm, Scene, Vector, Vertex} from "./SceneImport.js";

export default class Position
{
   #model;
   #matrix;
   #name;
   #nestedPositions;
   visible;
   debug;

   constructor(model = new Model(), matrix = Matrix.identity(), name = "", nestedPositions = new Array(), visible = true, debug = false)
   {
      if(model instanceof Model == false)
         throw new Error("Model has to be a model");
      
      if(matrix instanceof Matrix == false)
         throw new Error("Matrix has to be a Matrix");

      if(typeof name != "string")
         throw new Error("Name has to be a string");

      if(!Array.isArray(nestedPositions))
         throw new Error("Nested Positions has to be an array");

      if(typeof visible != "boolean" || typeof debug != "boolean")
         throw new Error("Visible and Debug must be booleans");

      let nestedLength = 0;
      this.#nestedPositions = new Array();
      for(let x = 0; x < nestedPositions.length; x += 1)
      {
         if(nestedPositions[x] instanceof Position == false)
         {
            this.#nestedPositions.length = nestedLength;
            throw new Error("Nested Position must be a Position");
         }
         else  
         {
            this.#nestedPositions.push(nestedPositions[x]);
            nestedLength += 1;
         }
      }

      this.#model = model;
      this.#matrix = matrix;
      this.#name = name;
      this.visible = visible;
      this.debug = debug;
   }

   static buildFromModel(model)
   {
      return new Position(model, Matrix.identity(), model.getName());
   }

   static buildFromName(name)
   {
      return new Position(new Model(), Matrix.identity(), name);
   }

   static buildFromModelName(model, name)
   {
      return new Position(model, Matrix.identity(), name);
   }

   getName()
   {
      return this.#name;
   }

   name = () => {return this.#name;}

   getModel()
   {
      return this.#model;
   }

   model = () => {return this.#model;}

   setModel(model)
   {
      if(model instanceof Model == false)
         throw new Error("Model must be a Model");

      this.#model = model;
   }

   getMatrix()
   {
      return this.#matrix;
   }

   matrix = () => {return this.#matrix;}

   setMatrix(matrix)
   {
      if(matrix instanceof Matrix == false)
         throw new Error("Matrix must be a Matrix");

      this.#matrix = matrix;

      return this.#matrix;
   }

   matrix2Identity()
   {
      this.#matrix = Matrix.identity();

      return this.#matrix;
   }

   getNestedPositions()
   {
      return this.#nestedPositions;
   }

   nestedPositions = () => {return this.#nestedPositions;}

   setNestedPosition(index, position)
   {
      if(typeof index != "number")
         throw new Error("Index must be numerical");

      if(position instanceof Position == false)
         throw new Error("Position must be a Position");

      this.#nestedPositions[index] = position;      
   }

   addNestedPosition(... pArray)
   {
      let nestedLength = this.#nestedPositions.length;
      for(let p of pArray)
      {
         if(p instanceof Position == false)
         {
            this.#nestedPositions.length = nestedLength;
            throw new Error("Can only add Positions");
         }
         else
         {
            this.#nestedPositions.push(p);
            nestedLength += 1;
         }
      }
   }

   translation(dx, dy, dz)
   {
      if(typeof dx != "number" || typeof dy != "number" || typeof dz != "number")
         throw new Error("dx, dy, and dz must be numerical");

      this.#matrix = Matrix.translate(dx, dy, dz);
   }

   toString()
   {
      let result = "";
      result += "Position: " + this.#name + "\n";
      result += "This Position's visibility is: " + this.visible + "\n";
      result += "This Position's Matrix is\n";
      result += this.#matrix.toString() + "\n";
      result += "This Position's Model is\n";
      result += (null == this.#model || undefined == this.#model) ? "null\n" : this.#model.toString();
      result += "This Position has " + this.#nestedPositions.length + " nested Positions\n";

      for (let p of this.#nestedPositions)
         result += p.toString();
      
      return result;
   }

   static main()
   {
      
      console.log("Creating p1 = new Position.");
      console.log("Creating p2 = Position.buildFromModel(new Model())");
      console.log("Creating p3 = Position.buildFromName('p2')");
      console.log("Creating p4 = Position.buildFromModelName(new Model(), 'p4')");
      const p1 = new Position();
      const p2 = Position.buildFromModel(new Model());
      const p3 = Position.buildFromName("p3");
      const p4 = Position.buildFromModelName(new Model(), "p4");

      console.log("");
      console.log("p1: ");
      console.log(p1.toString());

      
      console.log("");
      console.log("p2: ");
      console.log(p2.toString());

      
      console.log("");
      console.log("p3: ");
      console.log(p3.toString());

      
      console.log("");
      console.log("p4: ");
      console.log(p4.toString());

//    ------------------------------------------------------

      console.log("");
      console.log("p1.getName(): ");
      console.log(p1.getName());

      console.log("");
      console.log("p1.name()");
      console.log(p1.name());

      console.log("");
      console.log("p2.getName(): ");
      console.log(p2.getName());

      console.log("");
      console.log("p2.name()");
      console.log(p2.name());

      console.log("");
      console.log("p3.getName(): ");
      console.log(p3.getName());

      console.log("");
      console.log("p3.name()");
      console.log(p3.name());

      console.log("");
      console.log("p4.getName(): ");
      console.log(p4.getName());

      console.log("");
      console.log("p4.name()");
      console.log(p4.name());

//    ----------------------------------------------------
      // outputs function data instead of model.toString
      console.log("");
      console.log("p1.getModel(): ");
      console.log(p1.getModel().toString());

      console.log("");
      console.log("p1.model()");
      console.log(p1.model().toString());

      console.log("");
      console.log("p2.getModel(): ");
      console.log(p2.getModel().toString());

      console.log("");
      console.log("p2.model()");
      console.log(p2.model().toString());

      console.log("");
      console.log("p3.getModel(): ");
      console.log(p3.getModel().toString());

      console.log("");
      console.log("p3.model()");
      console.log(p3.model().toString());

      console.log("");
      console.log("p4.getModel(): ");
      console.log(p4.getModel().toString());

      console.log("");
      console.log("p4.model()");
      console.log(p4.model().toString());
//    ---------------------------------------------------

      console.log("");
      console.log("p1.setModel(new Model()): ");
      p1.setModel(new Model());
      console.log(p1.toString());

      console.log("");
      console.log("p3.setModel(new Model()): ");
      p3.setModel(new Model());
      console.log(p3.toString());

// _--------------------------------------------------

      console.log("");
      console.log("p1.getMatrix(): ");
      console.log(p1.getMatrix());

      console.log("");
      console.log("p1.matrix()");
      console.log(p1.matrix());

      console.log("");
      console.log("p2.getMatrix(): ");
      console.log(p2.getMatrix());

      console.log("");
      console.log("p2.matrix()");
      console.log(p2.matrix());

      console.log("");
      console.log("p3.getMatrix(): ");
      console.log(p3.getMatrix());

      console.log("");
      console.log("p3.matrix()");
      console.log(p3.matrix());

      console.log("");
      console.log("p4.getMatrix(): ");
      console.log(p4.getMatrix());

      console.log("");
      console.log("p4.matrix()");
      console.log(p4.matrix());

// --------------------------------------------------

      console.log("");
      console.log("p1.setMatrix(Matrix.translate(1, 1, 1)): ");
      p1.setMatrix(Matrix.translate(1, 1, 1));
      console.log(p1.toString());

      console.log("");
      console.log("p1.matrix2Identity(): ");
      p1.matrix2Identity();
      console.log(p1.toString());

// -----------------------------------------------------

      console.log("");
      console.log("p1.getNestedPositions(): ");
      console.log(p1.getNestedPositions());

      console.log("");
      console.log("p1.nestedPositions(): ");
      console.log(p1.nestedPositions());

      console.log("");
      console.log("p1.addNestedPosition(p2): ");
      p1.addNestedPosition(p2);
      console.log(p1.toString());

      console.log("");
      console.log("p1.addNestedPosition(p3, p4): ");
      p1.addNestedPosition(p3, p4);
      console.log(p1.toString());

      console.log("");
      console.log("p1.setNestedPosition(0, p4)");
      p1.setNestedPosition(0, p4);
      console.log(p1.toString());
   }
}