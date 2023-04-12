<<<<<<< HEAD
/**
      A {@code Viewport} is an inner (non-static nested) class of
      {@link FrameBuffer}. That means that a {@code Viewport} has
      access to the pixel data of its "parent" {@link FrameBuffer}.
   <p>
      A {@code Viewport} is a two-dimensional sub array of its
      "parent" {@link FrameBuffer}. A {@code Viewport} is
      represented by its upper-left-hand corner and its
      lower-right-hand corner in the {@link FrameBuffer}.
   <p>
      When you set a pixel in a {@code Viewport}, you are really
      setting a pixel in its parent {@link FrameBuffer}.
   <p>
      A {@link FrameBuffer} can have multiple {@code Viewport}s.
   <p>
      {@code Viewport} coordinates act like Java {@link java.awt.Graphics2D}
      coordinates; the positive {@code x} direction is to the right and the
      positive {@code y} direction is downward.
*/

import {FrameBuffer} from "./FramebufferImport.js";
import Color from "../color/Color.js";

export default class Viewport
{
    // Coordinates of the viewport within the framebuffer.
    #vp_ul_x;     // upper-left-hand corner
    #vp_ul_y;
    #vp_lr_x;     // lower-right-hand corner
    #vp_lr_y;
    #bgColorVP;   // the viewport's background color
    #parent;      // the parent fb that the viewport is in

    /**
     * Create a {@code Viewport} with the given upper left hand corner
     * width and height within its parent {@link FrameBuffer} and with the given background color.
     * If no background color is give the default of {@link Color}.black is used.
     * If no upper left hand corner is given then uses (0, 0) as the upper left corner in the parent {@link FrameBuffer}
     * NOTE: This constructor does not use the background color to set the pixels
     * of this {@code Viewport} If you want the pixels of this {@code Viewport} to be cleared
     * to the background color call the {@link clearVP} method
     * 
     * @param {@link Number} width the width of this {@code Viewport}
     * @param {@link Number} height the height of this {@code Viewport}
     * @param {@link FrameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is inside
     * @param {@link Number} upperLeftX upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY upper left hand y coordinate of this {@code Viewport}
     * @param {@link Color} color background {@link Color} for this {@code Viewport}
     */
    constructor(width, height, parent, upperLeftX = 0, upperLeftY = 0, color = Color.Black)
    {
        if( typeof upperLeftX != "number" || typeof upperLeftY != "number" ||
            typeof width != "number" || typeof height != "number")
                throw new Error("upperLeftX, upperLeftY, width, height must be numerical");
        
        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a FrameBuffer");

        if(color instanceof Color == false)
            color = Color.Black;

        this.setViewport(width, height, upperLeftX, upperLeftY);

        this.#bgColorVP = color;
        this.#parent = parent;

        this.clearVP(this.#bgColorVP);
    }

    /**
     * Create a {@code Viewport} that is the exact replica of its parent {@link FrameBuffer}.
     * 
     * @param {@link FrameBuffer} parent the parent {@link FrameBuffer} from which all data is taken from
     * @returns {@code Viewport} a viewport that is the exact same as its {@code parent}
     */
    static buildParent(parent)
    {
        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a FrameBuffer");

        const vp = new Viewport(parent.getWidthFB(), parent.getHeightFB(), parent, 0, 0, parent.getBackgroundColorFB());

        for(let x = 0; x < parent.getWidthFB(); x += 1)
        {
            for(let y = 0; y < parent.getHeightFB(); y += 1)
                vp.setPixelVP(x, y, parent.getPixelFB(x, y));
        }

        return vp;
    }

    /**
     * Create a {@code Viewport} that is the exact replica of the source {@link FrameBuffer} with its 
     * upper left hand corner at the specified point inside its parent {@link FrameBuffer}
     * If no upper left hand corner is given uses (0, 0) as the default upper left corner in the parent {@link FrameBuffer}
     * 
     * @param {@link FrameBuffer} source the {@link FrameBuffer} that the width, height, and pixel data is to be taken from
     * @param {@link frameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is stored within
     * @param {@link Number} upperLeftX the upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY the upper left hand y coordinate of this {@code Viewport}
     * @returns this {@code Viewport} with the specified upper left corner inside its parent and the size and pixel data of the source
     */
    static buildFB(source, parent, upperLeftX = 0, upperLeftY = 0)
    {
        if(typeof upperLeftX != "number" || typeof upperLeftY != "number")
            throw new Error("UpperLeftX and UpperleftY must be numerical.");

        if(source instanceof FrameBuffer == false)
            throw new Error("Source must be of type FrameBuffer");

        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a framebuffer");

        const vp = new Viewport(source.getWidthFB(), source.getHeightFB(), parent, upperLeftX, upperLeftY, source.getBackgroundColorFB());

        for(let x = 0; x < source.getWidthFB(); x += 1)
        {
            for(let y = 0; y < source.getHeightFB(); y += 1)
                vp.setPixelVP(x, y, source.getPixelFB(x, y));
        }

        return vp;
    }

    /**
     * Create a {@code Viewport} that is the exact replica of the source {@code Viewport} with its 
     * upper left hand corner at the specified point inside its parent {@link FrameBuffer}
     * if no upper left hand corner is given uses (0, 0) as the default upper left hand corner in the parent {@link FrameBuffer}
     * 
     * @param {@link Viewport} source the {@code Viewport} that the width height and pixel data is to be taken from
     * @param {@link FrameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is stored within 
     * @param {@link Number} upperLeftX upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY upper left hand y coordinate of this {@code Viewport}
     * @returns this {@code Viewport} with the specified upper left corner inside its parent and the size and pixel data of the source
     */
    static buildVP(source, parent, upperLeftX = 0, upperLeftY = 0)
    {
        if(typeof upperLeftX != "number" || typeof upperLeftY != "number")
            throw new Error("UpperLeftX and UpperleftY must be numerical.");

        if(source instanceof Viewport == false)
            throw new Error("Source must be of type FrameBuffer");

        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a framebuffer");

        const vp = new Viewport(source.getWidthVP(), source.getHeightVP(), parent, upperLeftX, upperLeftY, source.getBackgroundColorVP());

        for(let x = 0; x < source.getWidthVP(); x += 1)
        {
            for(let y = 0; y < source.getHeightVP(); y += 1)
                vp.setPixelVP(x, y, source.getPixelVP(x, y));
        }

        return vp;
    }

    /**
     * Mutate this {@code Viewport} into the given upper left hand corner 
     * of its parent {@link FrameBuffer} with the specified widht and height
     * if no upper left hand corner is given uses (0, 0) as the default
     * NOTE: will use Math.round() on upperLeftX and upperLeftY, width and height
     * 
     * @param {@link Number} width the width of this {@code Viewport}
     * @param {@link Number} height the height of this {@code Viewport}
     * @param {@link Number} upperLeftX horizontal coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY vertical coordinate of this {@code Viewport}
     */
    setViewport(width, height, upperLeftX = 0, upperLeftY = 0)
    {
        if(typeof width != "number" || typeof height != "number" ||
            typeof upperLeftX != "number" || typeof upperLeftY != "number")
                throw new Error("All parameters must be numerical.");

        upperLeftX = Math.round(upperLeftX);
        upperLeftY = Math.round(upperLeftY);
        width = Math.round(width);
        height = Math.round(height);

        this.#vp_ul_x = upperLeftX;
        this.#vp_ul_y = upperLeftY;
        this.#vp_lr_x = this.#vp_ul_x + width;
        this.#vp_lr_y = this.#vp_ul_y + height;
    }

    /**
     * Return a reference to the {@link FrameBuffer} that this {@code Viewport} is in
     * 
     * @returns a reference to the {@link FrameBuffer} that this {@code Viewport} is inside 
     */
    getFrameBuffer()
    {
        return this.#parent;
    }

    framebuffer = () => {return this.#parent}

    parent = () => {return this.#parent}

    /**
     * Get the Width of this {@code Viewport}
     * 
     * @returns width of this {@code Viewport} 
     */
    getWidthVP()
    {
        return this.#vp_lr_x - this.#vp_ul_x;
    }

    width = () => {return this.#vp_lr_x - this.#vp_ul_x;}

    /**
     * Get the height of this {@code Viewport}
     * @returns the height of this {@code Viewport}
     */
    getHeightVP()
    {
        return this.#vp_lr_y - this.#vp_ul_y;
    }

    height = () => {return this.#vp_lr_y - this.#vp_ul_y;}

    /**
     * Get this {@code Viewport} background color.
     * 
     * @returns this {@code Viewport} background {@link Color}
     */
    getBackgroundColorVP()
    {
        return this.#bgColorVP;
    }

    bgColorVP = () => {return this.#bgColorVP;}

    vp_ul_x = () => {return this.#vp_ul_x;}
    vp_ul_y = () => {return this.#vp_ul_y;}
    vp_lr_x = () => {return this.#vp_lr_x;}
    vp_lr_y = () => {return this.#vp_lr_y;}

    /**
     * Set this {@code Viewport} background color.
     * <p>
     * NOTE: this method does not clear the pixels of this {@code Viewport}.
     * to actually change all this {@code Viewport} pixels to the given 
     * {@link Color} use the {@link clearVP} method.
     * 
     * @param {@link Color} color this {@code Viewport} new background color
     */
    setBackgroundColorVP(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        this.#bgColorVP = color;
    }

    /**
     * Clear this {@code Viewport} using its background {@link Color}
     */
    clearVPDefault()
    {
        this.clearVP(this.getBackgroundColorVP());
    }

    /**
     * Clear this {@code Viewport} using the given {@link Color}
     * 
     * @param {@link Color} color, the color to set this {@code Viewport} pixels to 
     */
    clearVP(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        for(let x = 0; x < this.getWidthVP(); x += 1)
        {
            for(let y = 0; y < this.getHeightVP(); y += 1)
                this.setPixelVP(x, y, color);
        }
    }

    /**
     * Get the {@link Color} of the pixel with coordinates at 
     * {@code (x, y)} realtive to this {@code Viewport}
     * Note: uses Math.round() to round x and y
     * 
     * @param {@link Number} x the horizontal coordinate within this {@code Viewport}
     * @param {@link Number} y the vertical coordinate within this {@code Viewport}
     * @returns the {@link Color} of the current pixel at the specified coordinate in this {@code Viewport}
     */
    getPixelVP(x, y)
    {
        if(typeof x != "number" || typeof y != "number")
            throw new Error("X and Y must be numerical");

        x = Math.round(x);
        y = Math.round(y);

        return this.#parent.getPixelFB(this.#vp_ul_x + x, this.#vp_ul_y + y);
    }

    /**
     * Set the {@link Color} of the pixel with coordinates {@code (x, y)} within this {@code Viewport}
     * Note uses default value {@link Color}.black if no color is given
     * Note rounds x and y
     * 
     * @param {@link Number} x the horizontal coordinate within this {@code Viewport} 
     * @param {@link Number} y the vertical coordinate within this {@code Viewport}
     * @param {@link Color} color the {@link Color} that the {@code (x, y)} pixel should be set to within this {@code Viewport}
     */
    setPixelVP(x, y, color = Color.black)
    {
        if(typeof x != "number" || typeof y != "number")
            throw new Error("X and Y must be numerical");

        if(color instanceof Color == false)
            throw new Error("Color must be a Color");

        x = Math.round(x);
        y = Math.round(y);

        this.#parent.setPixelFB(this.#vp_ul_x + x, this.#vp_ul_y + y, color);
    }

    /**
     * Create a new {@link FrameBuffer} contianing the pixel data from this {@code Viewport}
     * 
     * @returns {@link FrameBuffer} holding pixel data from this {@code Viewport} 
     */
    convertVP2FB()
    {
        return(FrameBuffer.buildVP(this));
    }

    /**
         Write this {@code Viewport} to the specified PPM file.
      <p>
         <a href="https://en.wikipedia.org/wiki/Netpbm_format" target="_top">
                  https://en.wikipedia.org/wiki/Netpbm_format</a>

         @param filename  name of PPM image file to hold {@code Viewport} data
    */
    dumpVP2File(filename)
    {
        if(typeof filename != "string")
            throw new Error("Filename must be a String");

        this.#parent.dumpPixels2File(this.#vp_ul_x, this.#vp_ul_y, this.#vp_lr_x, this.#vp_lr_y, filename);
    }

    /**
      For debugging very small {@code Viewport} objects.

      @return a string representation of this {@code Viewport}
   */
    toString() 
    {
        let result = "Viewport [w = " + this.getWidthVP() + ", h = " + this.getHeightVP() + "]\n";
          
        for(let y = 0; y < this.getHeightVP(); ++y) 
        {
            for (let x = 0; x < this.getWidthVP(); ++x) 
            {
                const color = this.getPixelVP(x, y);
                result += color.getRed() + " " + color.getGreen() + " " + color.getBlue() + " " + color.getAlpha() + " | ";
            }
            result += "\n";
        }
        return result;
    } 

    static main()
    {
        const fb = new FrameBuffer(10, 10);
        
        console.log("creating vp1 = new VP(3, 3, fb = new FrameBuffer(10, 10), 4, 4, color.orange)");
        const vp1 = new Viewport(3, 3, fb, 4, 4, Color.orange);
        
        console.log("creating vp2 = VP.buildParent()");
        const vp2 = Viewport.buildParent(fb);

        console.log("creating vp3 = vP.buildFB");
        const vp3 = Viewport.buildFB(new FrameBuffer(5, 5), fb, 2, 2);

        console.log("creating vp4 = vp.buildVP");
        const vp4 = Viewport.buildVP(vp1, fb, 0, 0);

        console.log("");
        console.log("vp1.getFramebuffer()");
        console.log(vp1.getFrameBuffer().toString());

        console.log("");
        console.log("vp2.framebuffer()");
        console.log(vp2.framebuffer().toString());

        console.log("");
        console.log("vp3.parent()");
        console.log(vp3.parent().toString());

        console.log("");
        console.log("vp1.getWidthVP()");
        console.log(vp1.getWidthVP());

        console.log("");
        console.log("vp1.getHeightVP()");
        console.log(vp1.getHeightVP());

        console.log("");
        console.log("vp4.width()");
        console.log(vp4.width());

        console.log("");
        console.log("vp4.height()");
        console.log(vp4.height());

        console.log("");
        console.log("vp2.getBackGroundColorVP()");
        console.log(vp2.getBackgroundColorVP().toString());

        console.log("");
        console.log("vp3.bgColorVP()");
        console.log(vp3.bgColorVP().toString());

        console.log("");
        console.log("vp3.setBackGroundColorVP(Color.Green");
        vp3.setBackgroundColorVP(Color.Green);
        console.log(vp3.toString());

        console.log("");
        console.log("vp3.clearVPDefault()");
        vp3.clearVPDefault();
        console.log(vp3.toString());
        
        console.log("");
        console.log("vp2.setPixelVP(1, 1, Color.PINK)");
        vp2.setPixelVP(1, 1, Color.Pink);
        console.log(vp2.toString());

        console.log("");
        console.log("vp2.getPixelVP(1, 1");
        console.log(vp2.getPixelVP(1, 1).toString());

        console.log("");
        console.log("vp1.dumpVP2File(VP1.ppm)");
        vp1.dumpVP2File("VP1.ppm");

        console.log("");
        console.log("vp2.dumpVP2File(VP2.ppm)");
        vp2.dumpVP2File("VP2.ppm");

        console.log("");
        console.log("vp3.dumpVP2File(VP3.ppm)");
        vp3.dumpVP2File("VP3.ppm");

        console.log("");
        console.log("vp4.dumpVP2File(VP4.ppm)");
        vp4.dumpVP2File("VP4.ppm");

        console.log("");
        console.log("vp1.convertVP2FB()");
        console.log(vp1.convertVP2FB().toString());

    }
=======
/**
      A {@code Viewport} is an inner (non-static nested) class of
      {@link FrameBuffer}. That means that a {@code Viewport} has
      access to the pixel data of its "parent" {@link FrameBuffer}.
   <p>
      A {@code Viewport} is a two-dimensional sub array of its
      "parent" {@link FrameBuffer}. A {@code Viewport} is
      represented by its upper-left-hand corner and its
      lower-right-hand corner in the {@link FrameBuffer}.
   <p>
      When you set a pixel in a {@code Viewport}, you are really
      setting a pixel in its parent {@link FrameBuffer}.
   <p>
      A {@link FrameBuffer} can have multiple {@code Viewport}s.
   <p>
      {@code Viewport} coordinates act like Java {@link java.awt.Graphics2D}
      coordinates; the positive {@code x} direction is to the right and the
      positive {@code y} direction is downward.
*/

import FrameBuffer from "./FrameBuffer.js";
import Color from "../color/Color.js";

export default class Viewport
{
    // Coordinates of the viewport within the framebuffer.
    #vp_ul_x;     // upper-left-hand corner
    #vp_ul_y;
    #vp_lr_x;     // lower-right-hand corner
    #vp_lr_y;
    #bgColorVP;   // the viewport's background color
    #parent;      // the parent fb that the viewport is in

    /**
     * Create a {@code Viewport} with the given upper left hand corner
     * width and height within its parent {@link FrameBuffer} and with the given background color.
     * If no background color is give the default of {@link Color}.black is used.
     * If no upper left hand corner is given then uses (0, 0) as the upper left corner in the parent {@link FrameBuffer}
     * NOTE: This constructor does not use the background color to set the pixels
     * of this {@code Viewport} If you want the pixels of this {@code Viewport} to be cleared
     * to the background color call the {@link clearVP} method
     * 
     * @param {@link Number} width the width of this {@code Viewport}
     * @param {@link Number} height the height of this {@code Viewport}
     * @param {@link FrameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is inside
     * @param {@link Number} upperLeftX upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY upper left hand y coordinate of this {@code Viewport}
     * @param {@link Color} color background {@link Color} for this {@code Viewport}
     */
    constructor(width, height, parent, upperLeftX = 0, upperLeftY = 0, color = Color.Black)
    {
        if( typeof upperLeftX != Number || typeof upperLeftY != Number ||
            typeof width != Number || typeof height != number)
                throw new Error("upperLeftX, upperLeftY, width, height must be numerical");
        
        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a FrameBuffer");

        if(color instanceof Color == false)
            color = Color.Black;

        this.setViewport(width, height, upperLeftX, upperLeftY);

        this.#bgColorVP = color;
        this.#parent = parent;

        this.clearVP(this.#bgColorVP);
    }

    /**
     * Create a {@code Viewport} that is the exact replica of its parent {@link FrameBuffer}.
     * 
     * @param {@link FrameBuffer} parent the parent {@link FrameBuffer} from which all data is taken from
     * @returns {@code Viewport} a viewport that is the exact same as its {@code parent}
     */
    static buildParent(parent)
    {
        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a FrameBuffer");

        this(parent.getWidthFB(), parent.getHeightFB(), parent, 0, 0, parent.getBackgroundColorFB());

        for(let x = 0; x < parent.getWidthFB(); x += 1)
        {
            for(let y = 0; y < parent.getHeightFB(); y += 1)
                this.setPixelVP(x, y, parent.getPixelFB(x, y));
        }

        return this;
    }

    /**
     * Create a {@code Viewport} that is the exact replica of the source {@link FrameBuffer} with its 
     * upper left hand corner at the specified point inside its parent {@link FrameBuffer}
     * If no upper left hand corner is given uses (0, 0) as the default upper left corner in the parent {@link FrameBuffer}
     * 
     * @param {@link FrameBuffer} source the {@link FrameBuffer} that the width, height, and pixel data is to be taken from
     * @param {@link frameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is stored within
     * @param {@link Number} upperLeftX the upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY the upper left hand y coordinate of this {@code Viewport}
     * @returns this {@code Viewport} with the specified upper left corner inside its parent and the size and pixel data of the source
     */
    static buildFB(source, parent, upperLeftX = 0, upperLeftY = 0)
    {
        if(typeof upperLeftX != Number || typeof upperLeftY != Number)
            throw new Error("UpperLeftX and UpperleftY must be numerical.");

        if(source instanceof FrameBuffer == false)
            throw new Error("Source must be of type FrameBuffer");

        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a framebuffer");

        this(source.getWidthFB(), source.getHeightFB(), parent, upperLeftX, upperLeftY, source.getBackgroundColorFB());

        for(let x = 0; x < source.getWidthFB(); x += 1)
        {
            for(let y = 0; y < source.getHeightFB(); y += 1)
                this.setPixelVP(x, y, source.getPixelFB(x, y));
        }

        return this;
    }

    /**
     * Create a {@code Viewport} that is the exact replica of the source {@code Viewport} with its 
     * upper left hand corner at the specified point inside its parent {@link FrameBuffer}
     * if no upper left hand corner is given uses (0, 0) as the default upper left hand corner in the parent {@link FrameBuffer}
     * 
     * @param {@link Viewport} source the {@code Viewport} that the width height and pixel data is to be taken from
     * @param {@link FrameBuffer} parent the {@link FrameBuffer} that this {@code Viewport} is stored within 
     * @param {@link Number} upperLeftX upper left hand x coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY upper left hand y coordinate of this {@code Viewport}
     * @returns this {@code Viewport} with the specified upper left corner inside its parent and the size and pixel data of the source
     */
    static buildVP(source, parent, upperLeftX = 0, upperLeftY = 0)
    {
        if(typeof upperLeftX != Number || typeof upperLeftY != Number)
            throw new Error("UpperLeftX and UpperleftY must be numerical.");

        if(source instanceof Viewport == false)
            throw new Error("Source must be of type FrameBuffer");

        if(parent instanceof FrameBuffer == false)
            throw new Error("Parent is required and must be a framebuffer");

        this(source.getWidthVP(), source.getHeightVP(), parent, upperLeftX, upperLeftY, source.getBackgroundColorVP());

        for(let x = 0; x < source.getWidthVP(); x += 1)
        {
            for(let y = 0; y < source.getHeightVP(); y += 1)
                this.setPixelVP(x, y, source.getPixelVP(x, y));
        }

        return this;
    }

    /**
     * Mutate this {@code Viewport} into the given upper left hand corner 
     * of its parent {@link FrameBuffer} with the specified widht and height
     * if no upper left hand corner is given uses (0, 0) as the default
     * NOTE: will use Math.round() on upperLeftX and upperLeftY, width and height
     * 
     * @param {@link Number} width the width of this {@code Viewport}
     * @param {@link Number} height the height of this {@code Viewport}
     * @param {@link Number} upperLeftX horizontal coordinate of this {@code Viewport}
     * @param {@link Number} upperLeftY vertical coordinate of this {@code Viewport}
     */
    setViewport(width, height, upperLeftX = 0, upperLeftY = 0)
    {
        upperLeftX = Math.round(upperLeftX);
        upperLeftY = Math.round(upperLeftY);
        width = Math.round(width);
        height = Math.round(height);

        this.#vp_ul_x = upperLeftX;
        this.#vp_ul_y = upperLeftY;
        this.#vp_lr_x = this.#vp_ul_x + width;
        this.#vp_lr_y = this.#vp_ul_y + height;
    }

    /**
     * Return a reference to the {@link FrameBuffer} that this {@code Viewport} is in
     * 
     * @returns a reference to the {@link FrameBuffer} that this {@code Viewport} is inside 
     */
    getFrameBuffer()
    {
        return this.#parent;
    }

    framebuffer = () => {return this.#parent}
    parent = () => {return this.#parent}

    /**
     * Get the Width of this {@code Viewport}
     * 
     * @returns width of this {@code Viewport} 
     */
    getWidthVP()
    {
        return this.#vp_lr_x - this.#vp_ul_x;
    }

    width = () => {return this.#vp_lr_x - this.#vp_ul_x;}

    /**
     * Get the height of this {@code Viewport}
     * @returns the height of this {@code Viewport}
     */
    getHeightVP()
    {
        return vp_lr_y - vp_ul_y;
    }

    height = () => {return this.#vp_lr_y - this.#vp_ul_y;}

    /**
     * Get this {@code Viewport} background color.
     * 
     * @returns this {@code Viewport} background {@link Color}
     */
    getBackgroundColorVP()
    {
        return this.#bgColorVP;
    }

    bgColorVP = () => {return this.#bgColorVP;}

    vp_ul_x = () => {return this.#vp_ul_x;}
    vp_ul_y = () => {return this.#vp_ul_y;}
    vp_lr_x = () => {return this.#vp_lr_x;}
    vp_lr_y = () => {return this.#vp_lr_y;}

    /**
     * Set this {@code Viewport} background color.
     * <p>
     * NOTE: this method does not clear the pixels of this {@code Viewport}.
     * to actually change all this {@code Viewport} pixels to the given 
     * {@link Color} use the {@link clearVP} method.
     * 
     * @param {@link Color} color this {@code Viewport} new background color
     */
    setBackgroundColorVP(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        this.#bgColorVP = color;
    }

    /**
     * Clear this {@code Viewport} using its background {@link Color}
     */
    clearVPDefault()
    {
        this.clearVP(this.getBackgroundColorVP());
    }

    /**
     * Clear this {@code Viewport} using the given {@link Color}
     * 
     * @param {@link Color} color, the color to set this {@code Viewport} pixels to 
     */
    clearVP(color)
    {
        if(color instanceof Color)
            throw new Error("Color is not of type Color");

        for(let x = 0; x < this.getWidthVP(); x += 1)
        {
            for(let y = 0; y < this.getHeightVP(); y += 1)
                this.setPixelVP(x, y, color);
        }
    }

    /**
     * Get the {@link Color} of the pixel with coordinates at 
     * {@code (x, y)} realtive to this {@code Viewport}
     * Note: uses Math.round() to round x and y
     * 
     * @param {@link Number} x the horizontal coordinate within this {@code Viewport}
     * @param {@link Number} y the vertical coordinate within this {@code Viewport}
     * @returns the {@link Color} of the current pixel at the specified coordinate in this {@code Viewport}
     */
    getPixelVP(x, y)
    {
        if(typeof x != Number || typeof y != Number)
            throw new Error("X and Y must be numerical");

        x = Math.round(x);
        y = Math.round(y);

        return this.#parent.getPixelFB(this.#vp_ul_x + x, this.#vp_ul_y + y);
    }

    /**
     * Set the {@link Color} of the pixel with coordinates {@code (x, y)} within this {@code Viewport}
     * Note uses default value {@link Color}.black if no color is given
     * Note rounds x and y
     * 
     * @param {@link Number} x the horizontal coordinate within this {@code Viewport} 
     * @param {@link Number} y the vertical coordinate within this {@code Viewport}
     * @param {@link Color} color the {@link Color} that the {@code (x, y)} pixel should be set to within this {@code Viewport}
     */
    setPixelVP(x, y, color = Color.black)
    {
        if(typeof x != Number || typeof y != Number)
            throw new Error("X and Y must be numerical");

        if(color instanceof Color == false)
            throw new Error("Color must be a Color");

        x = Math.round(x);
        y = Math.round(y);

        this.#parent.setPixelFB(this.#vp_ul_x + x, this.#vp_ul_y + y, color);
    }

    /**
     * Create a new {@link FrameBuffer} contianing the pixel data from this {@code Viewport}
     * 
     * @returns {@link FrameBuffer} holding pixel data from this {@code Viewport} 
     */
    convertVP2FB()
    {
        return(FrameBuffer.buildVP(this));
    }

    /**
         Write this {@code Viewport} to the specified PPM file.
      <p>
         <a href="https://en.wikipedia.org/wiki/Netpbm_format" target="_top">
                  https://en.wikipedia.org/wiki/Netpbm_format</a>

         @param filename  name of PPM image file to hold {@code Viewport} data
    */
    dumpVP2File(filename)
    {
        if(filename instanceof String == false)
            throw new Error("Filename must be a String");

        this.#parent.dumpPixels2File(this.#vp_ul_x, this.#vp_ul_y, this.#vp_lr_x, this.#vp_lr_y, filename);
    }

>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}