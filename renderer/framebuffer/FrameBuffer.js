/*
    FrameBuffer. The MIT License.
    Copyright (c) 2022 rlkraft@pnw.edu
    See LICENSE for details.
*/

import Viewport from "./Viewport.js";
import Color from "../color/Color.js";

export default class FrameBuffer
{
    #width;
    #height;
    #bgColorFB;
    #pixelBuffer;
    #vp;

    /**
    A {@code FrameBuffer} represents a two-dimensional array of pixel data.
    The pixel data is stored as a one dimensional array in row-major order.
    The first row of data should be displayed as the top row of pixels
    in the image.
<p>
    A {@link Viewport} is a two-dimensional sub array of a {@code FrameBuffer}.
<p>
    A {@code FrameBuffer} has a default {@link Viewport}. The current {@link Viewport}
    is represented by its upper-left-hand corner and its lower-right-hand
    corner.
<p>
    {@code FrameBuffer} and {@link Viewport} coordinates act like Java
    {@link java.awt.Graphics2D} coordinates; the positive x direction is
    to the right and the positive y direction is downward.
*/

    /**
     * Construct a {@code FrameBuffer} with the width, height, and Color specified.
     * Width and height have the default value of 0, and color has the default color black
     * Will round Width and Height using the Math.round function.
     * 
     * @param {Number} width the width of the {@code FrameBuffer}
     * @param {Number} height the height of the {@code FrameBuffer}
     * @param {Color} color the background {@link Color} of the {@code FrameBuffer}
     */
    constructor(width, height, color = Color.Black)
    {
        if(typeof width != Number || typeof height != Number)
            throw new Error("Width and Height must be numerical");

        if(color instanceof Color == false)
            color = Color.Black;

        this.#width = Math.round(width);
        this.#height = Math.round(height);
        this.#bgColorFB = color;
        this.#pixelBuffer = new Array(this.#width * this.#height);
        this.#vp = Viewport.buildParent(this);

        clearFB(this.#bgColorFB);
    }

    /**
     * Creates an exact duplicate {@code FrameBuffer} out of the source {@code FrameBuffer}.
     * 
     * @param {@code FrameBuffer} source 
     * @returns this {@code FrameBuffer} object created
     */
    static buildFB(source)
    {
        if(source instanceof FrameBuffer == false)
            throw new Error("Source is not instance of FrameBuffer");

        this(source.getWidthFB(), source.getHeightFB(), source.getBackgroundColorFB());

        for(let x = 0; x < this.getWidthFB(); x += 1)
        {
            for(let y = 0; y < this.getHeightFB(); y += 1)
                this.setPixelFB(x, y, this.getPixelFB(x, y));
        }

        return this;
    }

    /**
     * Creates an exact duplicate {@code FrameBuffer} out of the source {@code Viewport}
     * 
     * @param {@link Viewport} source 
     * @returns this {@code FrameBuffer} object created
     */
    static buildVP(source)
    {
        if(source instanceof Viewport == false)
            throw new Error("Source is not instance of Viewport");

        this(source.getWidthVP(), source.getHeightVP(), source.getBackgroundColorVP());

        for(let x = 0; x < this.getWidthVP(); x += 1)
        {
            for(let y = 0; y < this.getHeightVP(); y += 1)
                this.setPixelFB(x, y, this.getPixelVP(x, y));
        }   
        
        return this;
    }

    /**
     * Get the width of this {@code FrameBuffer}
     * 
     * @returns the width of this {@code FrameBuffer}
     */
    getWidthFB()
    {
        return this.#width;
    }

    width = () => {return this.#width;}

    /**
     * Get the height of this {@code FrameBuffer}
     * 
     * @returns the height of this {@code FrameBuffer}
     */
    getHeightFB()
    {
        return this.#height;
    }

    height = () => {return this.#height;}
    
    /**
     * Get the background {@link Color} of this {@code FrameBuffer}
     * 
     * @returns the background {@link Color} of this {@code FrameBuffer}
     */
    getBackgroundColorFB()
    {
        return this.#bgColorFB;
    }

    bgColorFB = () => {return this.#bgColorFB;}

    /**
     * Set this {@code FrameBuffer} new background color.
     * <p>
     * NOTE: this does not clear the contents of the {@code FrameBuffer}.
     * to the given {@link Color}.  To actually change all the {@code FrameBuffer} 
     * pixels to the given {@link Color} call {@link clearFB()} method.
     * 
     * @param {@link Color} color: the new background color
     */
    setBackgroundColorFB(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color must be instance of Color");

        this.#bgColorFB = color;
    }

    /**
     * Get the default {@link Viewport} of this {@code FrameBuffer}
     * 
     * @returns the {@link Viewport} of this {@code FrameBuffer}
     */
    getViewport()
    {
        return this.#vp;
    }

    vp = () => {return this.#vp;}
    /**
     * Set this {@code FrameBuffer} default {@link Viewport} to be this whole this {@code FrameBuffer}
    */
    setViewportDefault()
    {
        this.setViewport(this.getWidthFB(), this.getHeightFB());
    }

    /**
     * Set the default {@link Viewport} with the given upper left hand corner, width, and height within this {@code FrameBuffer} 
     * If no upper left hand corner is given uses (0, 0) as the default upper left corner for the {@link Viewport}
     * 
     * @param {@link Number} width width of this {@code FrameBuffer} default {@link Viewport}
     * @param {@link Number} height this {@code FrameBuffer} default {@link Viewport}
     * @param {@link Number} upperLeftX upper left hand x coordinate of this {@code FrameBuffer} default {@link Viewport}
     * @param {@link Number} upperLeftY upper left hand y coordinate of this {@code FrameBuffer} default {@link Viewport}
     */
    setViewport(width, height, upperLeftX = 0, upperLeftY = 0)
    {
        if( typeof upperLeftX != Number || 
            typeof UpperLeftY != Number ||
            typeof width      != Number ||
            typeof height     != Number)
                throw new Error("All Parameters must be Numerical");

        this.#vp.setViewport(width, height, upperLeftX, upperLeftY);

    }

    /**
     * Clear this {@code FrameBuffer} using the background color of this {@code FrameBuffer}
     */
    clearFBDefault()
    {
        clearFB(this.getBackgroundColorFB());
    }
    
    /**
     * Clear this {@code FrameBuffer} using the given {@link Color}
     * 
     * @param {@link Color} color the color to set this {@code FrameBuffer} pixels to  
     */
    clearFB(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color must be a Color");

        for(let x = 0; x < this.getWidthFB(); x += 1)
        {
            for(let y = 0; y < this.getHeightFB(); y += 1)
                this.setPixelFB(x, y, color);
        }
    }

    /**
     * Get the {@link Color} of the pixel within this {@code FrameBuffer} at the given {@code (x, y)} coordinate 
     * NOTE: will round x and y using Math.round().
     * 
     * @param {@link Number} x horizontal coordinate within this {@code FrameBuffer} 
     * @param {@link Number} y vertical coordinate within this {@code FrameBuffer}
     * @returns the {@link Color} of the pixel at the given (x, y) coordinate
     */
    getPixelFB(x, y)
    {
        x = Math.round(x);
        y = Math.round(y);

        const index = y * this.getWidthFB() + x;

        if(index >= this.#pixelBuffer.length)
            throw new Error("FrameBuffer: Bad pixel coordinate " + 
                            "(" + x + ", " + y + ") " + 
                            "[w= " + this.getWidthFB() + ", h= " + this.getHeightFB() + "]");
    
        return this.#pixelBuffer[index];
    }

    /**
     * Set the {@link Color} of the pixel within this {@code FrameBuffer} at the given {@code (x, y)} coordinate
     * Note: if no color is uses by deafult uses Color.black;
     * 
     * @param {@link Number} x horizontal coordinate within this {@code FrameBuffer}
     * @param {@link Number} y vertical coordinate within this {@code FrameBuffer}
     * @param {@link Color} color that this {@code FrameBuffer} pixel  at the given {@code (x, y)} coordinate should be set to
     */
    setPixelFB(x, y, color = Color.Black)
    {
        if(typeof x != Number || typeof y != Number)
            throw new Error("X and Y must be Numerical");

        if(color instanceof Color == false)
            throw new Error("Color must be of type Color");

        x = Math.round(x);
        y = Math.round(y);

        const index = y * this.getWidthFB() + x;

        if(index >+ this.#pixelBuffer.length)
            throw new Error("FrameBuffer: Bad pixel coordinate " + 
                            "(" + x + ", " + y + ") " + 
                            "[w= " + this.getWidthFB() + ", h= " + this.getHeightFB() + "]");

    /*
        see if the given color is supposed to be blended, if so then call blending function.

        Which blending function should be called?  blendColor uses the formula c1.alpha / (c1.alpha + c2.alpha)
        while blendColorWeight just uses c1Weight * c1 + (1-c1Weight) * c2

        Should I write a new function setPixelBlend(x, y, color, weight) that would implement this if statement?

        if(color.getAlpha() != 1 || color.getAlpha != 255)
            this.#pixelBuffer[index] = Color.blendColor(color, this.#pixelBuffer.getPixelFB(x, y));
            this.#pixelBuffer[index] = Color.blendColorWeight(color, this.#pixelBuffer.getPixelFB(x, y), color.getAlpha);
        else
            this.#pixelBuffer[index] = color;
    */
   
            this.#pixelBuffer[index] = color;
    }

    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the red plane of this {@code FrameBuffer}
     * 
     * @returns {@code FrameBuffer} holding just the red pixel data from this {@code FrameBuffer}
     */
    convertRed2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for(let x = 0; x < this.getWidthFB(); x += 1)
        {
            for(let y = 0; y < this.getHeightFB(); y += 1)
            {
                origColor = this.getPixelFB(x, y);
                newColor  = new Color(origColor.getRed(), 0, 0);

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }

    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the green plane of this {@code FrameBuffer}
     * 
     * @returns {@code FrameBuffer} holding just the green pixel data from this {@code FrameBuffer}
     */
    convertGreen2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for(let x = 0; x < this.getWidthFB(); x += 1)
        {
            for(let y = 0; y < this.getHeightFB(); y += 1)
            {
                origColor = this.getPixelFB(x, y);
                newColor  = new Color(0, origColor.getGreen(), 0);

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }

    /**
     * Create a new {@code FrameBuffer} containing the pixel data from just the blue plane of this {@code FrameBuffer}
     * 
     * @returns {@code FrameBuffer} holding just the blue pixel data from this {@code FrameBuffer}
     */
    convertBlue2FB()
    {
        const newFB = FrameBuffer.buildFB(this);

        for(let x = 0; x < this.getWidthFB(); x += 1)
        {
            for(let y = 0; y < this.getHeightFB(); y += 1)
            {
                origColor = this.getPixelFB(x, y);
                newColor  = new Color(0, 0, origColor.getBlue());

                newFB.setPixelFB(x, y, newColor);
            }
        }

        return newFB;
    }

    /**
      For debugging very small {@code FrameBuffer} objects.

      @return a string representation of this {@code FrameBuffer}
   */
    toString() 
    {
        let result = "FrameBuffer [w = " + this.getWidthFB() + ", h = " + this.getHeightFB() + "]\n";
        
        for(let y = 0; y < this.getHeightFB(); ++y) 
        {
            for (let x = 0; x < this.getWidthFB(); ++x) 
            {
                const color = this.getPixelFB(x, y);
                result += color.getRed() + " " + color.getGreen() + " " + color.getBlue() + " " + color.getGamma() + " | ";
            }
            result += "\n";
        }
        return result;
    } 

    /**
    Write this {@code FrameBuffer} to the specified PPM file.
    <p>
    <a href="https://en.wikipedia.org/wiki/Netpbm_format" target="_top">
            https://en.wikipedia.org/wiki/Netpbm_format</a>

    @param filename  name of PPM image file to hold {@code FrameBuffer} data
    */
    dumpFB2File(filename) 
    {
        if(filename instanceof String == false)
            throw new Error("Filename must be a string");

        this.dumpPixels2File(0, 0, this.getWidthFB(), this.getHeightFB(), filename);
    }

    /**
    Write a rectangular sub array of pixels from this {@code FrameBuffer}
    to the specified PPM file.
    <p>
    <a href="https://en.wikipedia.org/wiki/Netpbm_format#PPM_example" target="_top">
            https://en.wikipedia.org/wiki/Netpbm_format#PPM_example</a>
    <p>
    <a href="http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c" target="_top">
      http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c</a>

    @param ul_x      upper left hand x-coordinate of pixel data rectangle
    @param ul_y      upper left hand y-coordinate of pixel data rectangle
    @param lr_x      lower right hand x-coordinate of pixel data rectangle
    @param lr_y      lower right hand y-coordinate of pixel data rectangle
    @param filename  name of PPM image file to hold pixel data
    */
    dumpPixels2File(upperLeftX, upperLeftY, lowerRightX, lowerRightY, filename) 
    {
        if( typeof upperLeftX != Number || typeof upperLeftY != Number ||
            typeof lowerRightX != Number || typeof lowerRightY != Number)
                throw new Error("upperLeftX, upperLeftY, lowerRightX, lowerRightY must be numerical");
        if(filename instanceof String == false)
            throw new Error("Filename must be a String");
            
        let pWidth  = lowerRightX - upperLeftX;
        let pHeight = lowerRightY - upperLeftY;
    
        // uses synchronous API to avoid file corruption
        import('node:fs').then(fs => 
        {
            fs.writeFileSync(filename, "P6\n" + pWidth + " " + pHeight + "\n" + 255 + "\n",
                            err => {if (err) throw err;});
        });

        let tempPB = new Uint8ClampedArray(pWidth * pHeight * 3);
        let tempIndex = 0;
        for (let y = upperLeftY; y < lowerRightY; y++) 
        {
            for (let x = upperLeftX; x < lowerRightX; x++) 
            {
                const index = y * this.getWidthFB() + x;

                tempPB[tempIndex+0] = this.pixel_buffer[index].getRed();
                tempPB[tempIndex+1] = this.pixel_buffer[index].getGreen();
                tempPB[tempIndex+2] = this.pixel_buffer[index].getBlue();
                tempIndex+=3;
            }
        }

   
        // uses synchronous API to avoid file corruption
        import('node:fs').then(fs => 
        {
            fs.appendFileSync(filename, Buffer.from(tempPB),
                     err => {if (err) throw err;});
        });
    }
}

