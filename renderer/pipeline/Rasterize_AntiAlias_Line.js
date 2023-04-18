import {rastDebug, doAntiAliasing, doGamma, logMessage, logPixel, logPixelsXAA, logPixelsYAA} from "./PipelineImport.js";
import {Model, LineSegment} from "../scene/SceneImport.js";
import {Viewport} from "../framebuffer/FramebufferImport.js";
import Color from "../color/Color.js";

export default function rasterize(model, ls, vp)
{
    const bg = Color.convert2Float(vp.bgColorVP());
  //const bg = vp.bgColorVP();//.convert2Float();
    const w = vp.width();
    const h = vp.height();

    const vIndex0 = ls.vIndexList()[0];
    const vIndex1 = ls.vIndexList()[1];
    const v0 = model.vertexList()[vIndex0];
    const v1 = model.vertexList()[vIndex1];

    const cIndex0 = ls.cIndexList()[0];
    const cIndex1 = ls.cIndexList()[1];
  //const c0 = model.colorList()[cIndex0].convert2Float().getRGBComponents();
  //const c1 = model.colorList()[cIndex1].convert2Float().getRGBComponents();
    const c0 = Color.convert2Float(model.colorList()[cIndex0]).getRGBComponents();
    const c1 = Color.convert2Float(model.colorList()[cIndex1]).getRGBComponents();
    let r0 = c0[0], g0 = c0[1], b0 = c0[2];
    let r1 = c1[0], g1 = c1[1], b1 = c1[2];

    let x0 = .5 + w/2.001 * (v0.x() + 1), x1 = .5 + w/2.001 * (v1.x() + 1);
    let y0 = .5 + h/2.001 * (v0.y() + 1), y1 = .5 + h/2.001 * (v1.y() + 1);
    
    if(rastDebug)
    {
        logMessage(("(x0_pp, y0_pp) = (%9.4f, %9.4f)", x0,y0));
        logMessage(("(x1_pp, y1_pp) = (%9.4f, %9.4f)", x1,y1));
    }

    x0 = Math.round(x0), x1 = Math.round(x1);
    y0 = Math.round(y0), y1 = Math.round(y1);

    if( (x0 == x1) && (y0 == y1))
    {
        const x0VP = Math.trunc(x0) -1;
        const y0VP = Math.trunc(y0);

        if(rastDebug)
            logPixel(x0, y0, x0VP, y0VP, r0, g0, b0, vp);

        vp.setPixelVP(x0VP, y0VP, new Color(r0, g0, b0, 255, model.colorList()[cIndex0].isFloat()));

        return;
    }

    let transposedLine = false;
    if(Math.abs(y1-y0) > Math.abs(x1-x0))
    {
        let temp0 = x0;
        x0 = y0;
        y0 = temp0;

        let temp1 = x1;
        x1 = y1;
        y1 = temp1;

        transposedLine = true;
    }

    if(x1 < x0)
    {
        let tempX = x0;
        x0 = x1;
        x1 = tempX;

        let tempY = y0;
        y0 = y1;
        y1 = tempY;

        let tempR = r0;
        let tempG = g0;
        let tempB = b0;

        r0 = r1;
        g0 = g1;
        b0 = b1;
        r1 = tempR;
        g1 = tempG;
        b1 = tempB;
    }

    const denom  =  x1 - x0;
    const      m = (y1 - y0)/denom;
    const slopeR = (r1 - r0)/denom;
    const slopeG = (g1 - g0)/denom;
    const slopeB = (b1 - b0)/denom;

    if(rastDebug)
    {
        const inverseSlope = (transposedLine) ? " (transposed, so 1/m = " + 1/m + ")" : "";
        logMessage("Slope m    = " + m + inverseSlope);
        logMessage("Slope mRed = " + slopeR);
        logMessage("Slope mGrn = " + slopeG);
        logMessage("Slope mBlu = " + slopeB);
        logMessage(("(x0_vp, y0_vp) = (%9.4f, %9.4f)", x0-1,h-y0));
        logMessage(("(x1_vp, y1_vp) = (%9.4f, %9.4f)", x1-1,h-y1));
    }

    let y = y0;

    for(let x = Math.trunc(x0); x < Math.trunc(x1); x += 1, y += m)
    {
        // how to convert to float?
        let r = Math.abs(r0 + slopeR * (x - x0));
        let g = Math.abs(g0 + slopeG * (x - x0));
        let b = Math.abs(b0 + slopeB * (x - x0));
        
        if(doAntiAliasing)
        {
            let yLow = Math.trunc(y);
            let yHi = yLow + 1;

            if(!transposedLine && y == h) yHi = h;
            if(transposedLine && y == w) yHi = w;

            const weight = (y - yLow);

            let rL = (1-wieght) * r + weight * (bg.getRed());
            let gL = (1-wieght) * g + weight * (bg.getGreen());
            let bL = (1-wieght) * b + weight * (bg.getBlue());

            let rH = weight * r + (1-weight) * (bg.getRed());
            let gH = weight * g + (1-weight) * (bg.getGreen());
            let bH = weight * b + (1-weight) * (bg.getBlue());
            
            if(doGamma)
            {
                rL = Math.pow(rL, Color.GAMMA);
                gL = Math.pow(gL, Color.GAMMA);
                bL = Math.pow(bL, Color.GAMMA);
                rH = Math.pow(rH, Color.GAMMA);
                gH = Math.pow(gH, Color.GAMMA);
                bH = Math.pow(bH, Color.GAMMA);
            }

            const isFloat = r <=1 && g<=1 && b<=1;

            if(!transposedLine)
            {
                const xVP = x-1;
                const yVPLow = h-yLow;
                const yVPHi = h-yHi;

                if(rastDebug)
                    logPixelsYAA(x, y, xVP, yVPLow, yVPHi,
                                rL, gL, bL, rH, gH, bH, vp);
                
                // have to check if the color is in int or float representation
                vp.setPixelVP(xVP, yVPLow, new Color(rL, gL, bL, isFloat? 1:255, isFloat));
                vp.setPixelVP(xVP, yVPHi,  new Color(rH, gH, bH, isFloat? 1:255, isFloat));
            }
            else
            {
                const xVPLow = yLow -1;
                const xVPHi = yHi -1;
                const yVP = h-x;

                if(rastDebug)
                    logPixelsXAA(y, x, xVPLow, xVPHi, yVP, 
                                rL, gL, bL, rH, gH, bH, vp);

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVPLow, yVP, new Color(rL, gL, bL, isFloat? 1:255, isFloat));
                vp.setPixelVP(xVPHi,  yVP, new Color(rH, gH, bH, isFloat? 1:255, isFloat));
            }
        }
        else
        {
            if(doGamma)
            {
                r = Math.pow(r, Color.GAMMA);
                g = Math.pow(g, Color.GAMMA);
                b = Math.pow(b, Color.GAMMA);
            }

            const isFloat = r<= 1 && g<= 1 && b<= 1;
            if(!transposedLine)
            {
                const xVP = x-1;
                const yVP = h-Math.trunc(Math.round(y));
                
                if(rastDebug)
                    logPixel(x, y, xVP, yVP, r, g, b, vp);

                // have to check if the color is in int or float representation
                
                vp.setPixelVP(xVP, yVP, new Color(r, g, b, isFloat? 1:255, isFloat));
            }
            else
            {
                const xVP = Math.trunc(Math.round(y)) -1;
                const yVP = h-x;

                if(rastDebug)
                    logPixel(y, x, xVP, yVP, r, g, b, vp);

                // have to check if the color is in int or float representation
                vp.setPixelVP(xVP, yVP, new Color(r, g, b, isFloat? 1:255, isFloat))
            }
        }
    }

    const isFloat = r1 <=1 && g1 <= 1 && b1 <= 1
    if(!transposedLine)
    {
        const xVP = Math.trunc(x1) - 1;
        const yVP = h - Math.trunc(y1);

        if(rastDebug)
            logPixel(x1, y1, xVP, yVP, r1, g1, b1, vp);

                // have to check if the color is in int or float representation
        vp.setPixelVP(xVP, yVP, new Color(r1, g1, b1, isFloat? 1:255, isFloat));
    }
    else
    {
        const xVP = Math.trunc(y1) - 1;
        const yVP  = h - Math.trunc(x1);

        if(rastDebug)
            logPixel(y1, x1, xVP, yVP, r1, g1, b1, vp);

                // have to check if the color is in int or float representation
        vp.setPixelVP(xVP, yVP, new Color(r1, g1, b1, isFloat? 1:255, isFloat))
    }
}