<<<<<<< HEAD
import {Model, Vertex, Primitive, LineSegment, Point} from "../scene/SceneImport.js";
import Color from "../color/Color.js";

export let debugScene = false;
export let debugPosition = false;

let debug = debugScene || debugPosition;

export function logMessage(message)
{
    if(debug)
        console.log(message);
}

export function logVertexList(stage, model)
{
    if(debug)
    {
        let i = 0; 
        for(const v of model.vertexList)
        {
            console.log(stage + ": vIndex = " + i + ", " + v.toString() + "\n");
            i += 1;
        }
    }
}

export function logColorList(stage, model)
{
    if(debug)
    {
        let i = 0; 
        for(const c of model.colorList)
        {
            console.log(stage + ": cIndex = " + i + ", " + c.toString() + "\n");
            i += 1;
        }
    }
}

export function logPrimitiveList(stage, model)
{
    if(debug)
    {
        if(model.primitiveList.length == 0)
            console.log(stage + ": []\n");
        else
        {
            for(const p of model.primitiveList)
                console.log(stage + ": " + p.toString() + "\n");
        }
    }
}

export function logPrimitive(stage, model, p)
{
    if(debug)
    {
        console.log(stage + ": " + p.toString() + "/n");

        for(const vIndex of p.vIndexList)
        {
            const v = model.vertexList[vIndex];
            console.log("   vIndex = " + vIndex + ", " + v.toString() + "\n");
        }

        for(const cIndex of p.cIndexList)
        {
            const c = model.colorList[cIndex];
            console.log("   cIndex = " + cIndex + ", " + c.toString() + "\n");
        }
    }
}

export function logPixelMessage(clippedMessage, xpp, ypp, xvp, yvp, r, g, b, vp)
{
    if(debug)
    {
        wVP = vp.width;
        hVP = vp.height;
        xVP = vp.vp_ul_x;
        yVP = vp.vp_ul_y;
        fb = vp.getFrameBuffer();
        wFB = fb.width;
        hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%9.4f)  (x_vp=%4d, y_vp=%4d)  r=%.4f g=%.4f b=%.4f",
        wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,       ypp,         xvp,     yvp,      r,     g,     b);
        console.log(clippedMessage);
    }
}

export function logPixel(xpp, ypp, xvp, yvp, r, g, b, vp)
{
    logPixelMessage("", xpp, ypp, xvp, yvp, r, g, b, vp);
}

export function logPixelsYAA(xpp, ypp, xvp, y1vp, y2vp, r1, g1, b1, r2, g2, b2, vp)
{
    if(debug)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%4d, y_pp=%9.4f)  x_vp=%4d {y_low=%4d r=%.4f g=%.4f b=%.4f} {y_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    x_pp,     y_pp,        x_vp,     y1_vp,    r1,    g1,    b1,      y2_vp,    r2,    g2,    b2);
    }
}

export function logPixelsXAA(xpp, ypp, x1vp, x2vp, yvp, r1, g1, b1, r2, g2, b2, vp)
{
    if(debug)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%4d)  y_vp=%4d {x_low=%4d r=%.4f g=%.4f b=%.4f} {x_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    x_pp,       y_pp,      y_vp,     x1_vp,    r1,    g1,    b1,      x2_vp,    r2,    g2,    b2);
    }
}



=======
export var debugScene = false;
export var debugPosition = false;

debug = debugScene || debugPosition;

export function logMessage(message)
{
    if(debugScene || debugPosition)
        console.log(message);
}

export function logVertexList(stage, model)
{
    if(debug)
    {
        let i = 0; 
        for(const v of model.vertexList)
        {
            console.log(stage + ": vIndex = " + i + ", " + v.toString() + "\n");
            i += 1;
        }
    }
}

export function logColorList(stage, model)
{
    if(debug)
    {
        let i = 0; 
        for(const c of model.colorList)
        {
            console.log(stage + ": cIndex = " + i + ", " + c.toString() + "\n");
            i += 1;
        }
    }
}

export function logPrimitiveList(stage, model)
{
    if(debug)
    {
        if(model.primitiveList.length == 0)
            console.log(stage + ": []\n");
        else
        {
            for(const p of model.primitiveList)
                console.log(stage + ": " + p.toString() + "\n");
        }
    }
}

export function logPrimitive(stage, model, p)
{
    if(debug)
    {
        console.log(stage + ": " + p.toString() + "/n");

        for(const vIndex of p.vIndexList)
        {
            const v = model.vertexList[vIndex];
            console.log("   vIndex = " + vIndex + ", " + v.toString() + "\n");
        }

        for(const cIndex of p.cIndexList)
        {
            const c = model.colorList[cIndex];
            console.log("   cIndex = " + cIndex + ", " + c.toString() + "\n");
        }
    }
}

export function logPixelMessage(clippedMessage, xpp, ypp, xvp, yvp, r, g, b, vp)
{
    if(debug)
    {
        wVP = vp.width;
        hVP = vp.height;
        xVP = vp.vp_ul_x;
        yVP = vp.vp_ul_y;
        fb = vp.getFrameBuffer();
        wFB = fb.width;
        hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%9.4f)  (x_vp=%4d, y_vp=%4d)  r=%.4f g=%.4f b=%.4f",
        wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,       ypp,         xvp,     yvp,      r,     g,     b);
        console.log(clippedMessage);
    }
}

export function logPixel(xpp, ypp, xvp, yvp, r, g, b, vp)
{
    logPixelMessage("", xpp, ypp, xvp, yvp, r, g, b, vp);
}

export function logPixelsYAA(xpp, ypp, xvp, y1vp, y2vp, r1, g1, b1, r2, g2, b2, vp)
{
    if(debug)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%4d, y_pp=%9.4f)  x_vp=%4d {y_low=%4d r=%.4f g=%.4f b=%.4f} {y_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    x_pp,     y_pp,        x_vp,     y1_vp,    r1,    g1,    b1,      y2_vp,    r2,    g2,    b2);
    }
}

export function logPixelsXAA(xpp, ypp, x1vp, x2vp, yvp, r1, g1, b1, r2, g2, b2, vp)
{
    if(debug)
    {
        const wVP = vp.width;
        const hVP = vp.height;
        const xVP = vp.vp_ul_x;
        const yVP = vp.vp_ul_y;
        const fb = vp.getFrameBuffer();
        const wFB = fb.width;
        const hFB = fb.height;

        console.log("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%4d)  y_vp=%4d {x_low=%4d r=%.4f g=%.4f b=%.4f} {x_hi =%4d r=%.4f g=%.4f b=%.4f}\n",
                     wFB, hFB,      xVP,   yVP,   wVP, hVP,    x_pp,       y_pp,      y_vp,     x1_vp,    r1,    g1,    b1,      x2_vp,    r2,    g2,    b2);
    }
}



>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
