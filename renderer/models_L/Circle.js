import { LineSegment, Model, Vertex } from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export default class Circle extends Model
{
    r;
    n;

    constructor(rad = 1, num = 16)
    {
        if(typeof rad != "number" || typeof num != "number")
            throw new Error("All parameters must be numerical");

        if(num < 3)
            throw new Error("N must be greater than 3");

        this.r = rad;
        this.n = num;
        const circle = Model.buildName("Circle(" + this.r + "," + this.n + ")");
    
        const deltaTheta = (2 * Math.PI)/this.n;

        for(let i = 0; i < this.n; ++i)
            circle.addVertex(new Vertex(r * Math.cos(i * deltaTheta),
                                        r * Math.sin(i * deltaTheta), 
                                        0));

        for(let i = 0; i < this.n - 1; ++i)
            circle.addPrimitive(LineSegment.buildVertex(i, i + 1));
        
        circle.addPrimitive(LineSegment.buildVertex(this.n-1, 0));
    }
}