/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wirefram model from a GRS file.
<p>
   GRS files are a simple file format for describing two-dimensional
   drawings made up of "polylines". The format was created for the textbook
   "Computer Graphics Using OpenGL", 3rd Ed, by Francis S Hill
   and Stephen M Kelley (see pages 61-63).
<p>
   See <a href="https://en.wikipedia.org/wiki/Polyline" target="_top">
                https://en.wikipedia.org/wiki/Polyline</a>
<p>
   The structure of a GRS file is:
   <ol>
   <li>A number of comment lines followed by a line
       starting with an asterisk, {@code '*'}.
   <li>A line containing the "extent" (bounding box)
       of the drawing given as four doubles in model
       coordinates (left, top, right, bottom).
   <li>The number of line-strips (i.e., polylines)
       in the drawing.
   <li>The list of line-strips. Each line-strip starts
       with the number of vertices in the line-strip,
       followed by the (x, y) model coordinates for
       each vertex.
   </ol>
*/
//@ts-check
import {Model, Vertex, LineSegment} from "../scene/SceneExport.js";
import format from "../../StringFormat.js";
import Color from "../color/Color.js";

export default class GRSModel extends Model
{
   /**@type {number} [left=0]   */ #left;  
   /**@type {number} [top=0]    */ #top;
   /**@type {number} [right=0]  */ #right;
   /**@type {number} [bottom=0] */ #bottom;
   /**@type {number} [numLineStrips=0] */ #numLineStrips;
   
   /**
      Create a wireframe model from the contents of an GRS file.
      @param {string} grsFile  string object containing the path for the GRS data file
   */
   constructor(grsFile)
   {
      super(undefined, undefined, undefined, "GRS Model");

      const fs = require("fs");
      let text = fs.readFileSync(grsFile, "utf8");

      console.log(text);



   }// end constructor

   static main()
   {
      const t = new GRSModel("../../assets/grs/bronto.grs");
   }
}//GRSModel
