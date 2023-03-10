export default function rasterize(model, pt, vp)
{
    const CLIPPED = " : Clipped";
    const NOT_CLIPPED = "";

    const bg = vp.bgColorVP;

    const w = vp.width;
    const h = vp.height;

    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];

    const cIndex = pt.cIndexList[0];
    const c = model.colorList[cIndex].getRGBComponents();
    r = c[0], g = c[1], b = c[2];

    if(rasterize.doGamma)
    {
        newC = (Color.applyGamma(model.colorList[cIndex])).getRGBComponents();
        
        r = newC[0];
        g = newC[1];
        b = newC[2];
    }

    x = .5 + w/2.001 * (v.x + 1);
    y = .5 + h/2.001 * (v.y + 1);

    if(rasterize.debug)
        logMessage(("(x_pp, y_pp) = (%9.4f, %9.4f)", x, y));

    x = Math.round(x);
    y = math.round(y);
    
    const radius = pt.radius;

    for(let y_ = Math.trunc(y - radius); y_ <= Math.trunc(y + radius); ++y_)
    {
        for(let x_ = Math.trunc(x - radius); x_ <= Math.trunc(x + radius); ++x_)
        {
            if(rasterize.debug)
            {
                clippedMessage;

                if(x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
                    clippedMessage = NOT_CLIPPED;
                else
                    clippedMessage = CLIPPED;

                logPixelMessage(clippedMessage, x, y, x_-1, h -y_, r, g, b, vp);

                if(x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
                    vp.setPixelVP(x_-1, h-y_, new Color(r, g, b, 255, true));
            }
        }
    }
}