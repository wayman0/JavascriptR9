/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

import Model from "../Model";

/**
   This is a library of static methods that
   add color shading to a {@link Model}.
*/

export default class ModelShading
{
    static setColor(model, color)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a Model");

        if(color instanceof Color == false)
            throw new Error("Color must be a Color");

        if(model.getColorList().length == 0)
            for(let i = 0; i < model.getVertexList().length; i += 1)
                model.addColor(c);
        else
            for(let i = 0; i < model.getColorList().length; i += 1)
                model.getColorList()[i] = c;
    }           

    static setRandomColor(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a Model");

        if(model.getColorList().length == 0)
            for(let i = 0; i < model.getVertexList().length; i += 1)
                model.addColor(ModelShading.randomColor());
        else
            for(let i = 0; i < model.getColorList().length; i += 1)
                model.getColorList()[i] = ModelShading.randomColor();
    }

    static setRandomVertexColor(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a Model");

        model.getColorList.length = 0;

        for(let i = 0; i < model.getVertexList().length; i += 1)
            model.addColor(ModelShading.randomColor());

        for(let p of model.getPrimitiveList())
        {
            for(let i = 0; i < p.getVertexIndexList(); i += 1)
                p.getColorIndexList()[i] = p.getVertexIndexList[i];
        }
    }

    static setRandomPrimitiveColor(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a model");

        model.getColorList().length = 0; 
        let cIndex = 0; 

        for(let p of model.getPrimitiveList())
        {
            model.addColor(ModelShading.randomColor());
            for(let i = 0; i < p.getColorIndexList().length; i += 1)
                p.getColorIndexList()[i] = cIndex;

            ++cIndex;
        }
    }

    static setRainbowPrimitiveColors(model)
    {
        if(model instanceof Model == false)
            throw new Error("Model must be a Model");
        
        model.getColorList().length = 0; 
        let cIndex = 0;

        for (let p of model.getPrimitiveList())
        {
            for (let i = 0; i < p.getColorIndexList().length; ++i)
            {
                model.addColor(ModelShading.randomColor());
                p.getColorIndexList()[i] = cIndex;
                ++cIndex;
            }
        }
    }

    static randomColor()
    {
        let r = Math.random();
        let g = Math.random();
        let b = Math.random();

        return new Color(r, g, b);
    }

}