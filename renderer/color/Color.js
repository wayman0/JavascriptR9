/**
 * An {@code Color} is a way of storing the red, green, blue, and gamma data
 * about a color object.  It is supposed to mimic Java's Color class.
 */

export default class Color
{
    #rgb = new Array(4);
    #float = false;

    static GAMMA = 1/2.2;
    
    static black = new Color();
    static BLACK = new Color();
    static Black = new Color();

    static white = new Color(255, 255, 255);
    static WHITE = new Color(255, 255, 255);
    static White = new Color(255, 255, 255);

    static red = new Color(255, 0, 0);
    static RED = new Color(255, 0, 0);
    static Red = new Color(255, 0, 0);

    static green = new Color(0, 255, 0);
    static GREEN = new Color(0, 255, 0);
    static Green = new Color(0, 255, 0);
    
    static blue = new Color(0, 0, 255);
    static BLUE = new Color(0, 0, 255);
    static Blue = new Color(0, 0, 255);
    
    static orange = new Color(255, 127, 0);
    static ORANGE = new Color(255, 127, 0);
    static Orange = new Color(255, 127, 0);
    
    static yellow = new Color(255, 255, 0);
    static YELLOW = new Color(255, 255, 0);
    static Yellow = new Color(255, 255, 0);
    
    static pink = new Color(255, 192, 203,);
    static PINK = new Color(255, 192, 203,);
    static Pink = new Color(255, 192, 203,);
    
    static cyan = new Color(0, 255, 255);
    static CYAN = new Color(0, 255, 255);
    static Cyan = new Color(0, 255, 255);

    static magenta = new Color(255, 0, 255);
    static MAGENTA = new Color(255, 0, 255);
    static Magenta = new Color(255, 0, 255);
    
    static gray = new Color(192, 192, 192);
    static GRAY = new Color(192, 192, 192);
    static Gray = new Color(192, 192, 192);

    /**
     * Creates a new {@code Color} with the specified red, green, blue, and alpha values given.
     * Will check to make sure that the given values are within the range specified by {@code float}
     * By default alpha is set to 255 and float is set to false.  
     * If the color is supposed to be an integer representation uses Math.round() on r, g, b 
     *  
     * @param {@link Number} r the red value of the {@code Color} 
     * @param {@link Number} g the green value of the {@code Color} 
     * @param {@link Number} b the blue value of the {@code Color} 
     * @param {@link Number} a the gamma value of the {@code Color} 
     * @param {@link Boolean} float specifing whether the rgb values are integer or float.
     */
    constructor(r = 0, g = 0, b = 0, a = 255, float = false)
    {
        if(typeof r != Number || typeof g != Number || 
            typeof b != Number || typeof a != Number)
                throw new Error("All parameters must be numeric");

        if(typeof float != Boolean)
            throw new Error("float must be a boolean");

        if(float)
        {
            if(!(r >= 0 && r <= 1) || !(g >= 0 && g <= 1) || !(b >= 0 && b <= 1) || !(a >=0 && a <= 1))
                throw new Error("Float data must be between 0 and 1 inclusive");
            
            a = a/255;
        }
        else
        {
            if(!(r >= 0 && r <= 255) || !(g >= 0 && g <= 255) || !(b >= 0 && b <= 255) || !(a >= 0 && a <= 255))
                throw new Error("Int data must be between 0 and 255 inclusive");
            
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);
            a = Math.round(a);
        }
        
        this.#rgb[0] = r;
        this.#rgb[1] = g;
        this.#rgb[2] = b;
        this.#rgb[3] = a;
        this.#float = float;
    }

    /**
     * Creates a new color using the rgb, alpha, and float data of the color passed
     * 
     * @param {@code Color}  color the color whose data is to be used to create the new {@code Color}  
     * @returns a new {@code Color} that is a copy of the color passed.
     */
    static buildColor(color)
    {
        if(color instanceof Color == false)
            throw new Error("color is not of type Color");

        return this(color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha(), color.isFloat());
    }

    /**
     * Creates a new color that is the same rgb values but not the alpha value of the color passed.  
     * Insteads uses the passed alpha.  This function is supposed to create a 'stronger' or 'weaker' duplicate color.
     * NOTE: this function is NON MUTATING
     * 
     * @param {@code Color} color the rgb values to be used in the color being created 
     * @param {@link Number} alpha the alpha value for the color to be created 
     * @returns {@code Color} the 'stronger' or 'weaker' duplicate color 
     */
    static buildAlpha(color, alpha)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        if(typeof alpha != Number)
            throw new Error("Alpha is not numerical");

        if(color.isFloat())
            if(!(alpha >= 0 && alpha <= 1))
                throw new Error("Alpha is not a float");
            else
                return this(color.getRed(), color.getGreen(), color.getBlue(), alpha, color.isFloat());
        else
            if(!(alpha >= 0 && alpha <= 255))
                throw new Error("Alpha is not a 1 byte int");
            else
                return this(color.getRed(), color.getGreen(), color.getBlue(), alpha, color.isFloat());
    }

    /**
     * Creates a new color that is the weighted average of the two colors using the ratio between their Alphas.
     * formula: c1.alpha/(c1.alpha + c2.alpha)
     * this function is NON MUTATING
     * NOTE: returns a float color with alpha of 1
     * 
     * @param {@code Color} c1 the first color to be blended with  
     * @param {@code Color} c2 the second color to be blended with
     * @returns the new float representation of the blended colors with an alpha of 1
     */
    static blendColor(c1, c2)
    {
        return Color.blendColorWeight(c1, c2, c1.getAlpha()/(c1.getAlpha() + c2.getAlpha()));
    }

    /**
     * Creates a new color that is the weighted average of 
     * the two colors using the given c1Weight, the weight 
     * of the first color.  c1Weight has the default value of 1/2
     * Uses the equation: c1Weight * c1 + (1-c1Weight) * c2;
     * this function is NON MUTATING
     * NOTE: returns a float color with alpha of 1
     * 
     * @param {@code Color} c1 the first color to be blended with 
     * @param {@code Color} c2 the second color to be blended with 
     * @param {@link Number} c1Weight the weight of the first color, must be in the range [0, 1]
     * @returns 
     */
    static blendColorWeight(c1, c2, c1Weight = .5)
    {
        if(c1 instanceof Color == false || c2 instanceof Color == false)
            throw new Error("C1 and C2 are not of type color");

        if(typeof c1Weight != Number)
            throw new Error("c1Weight is not numerical");

        if(!(c1Weight >= 0 && c1Weight <= 1))
            throw new Error("c1Weight has to be in the range 0 to 1 inclusive");

        floatC1 = Color.convert2Float(c1);
        floatC2 = Color.convert2Float(c2);

        newR = c1Weight * floatC1.getRed() + (1-c1Weight) * floatC2.getRed();
        newG = c1Weight * floatC1.getGreen() + (1-c1Weight) * floatC2.getGreen();
        newB = c1Weight * floatC1.getBlue() + (1-c1Weight) * floatC2.getBlue();
        
        return this(newR, newG, newB, 1, true);
    }

    /**
     * Creates a new {@code Color} that is the float representation of the passed color.
     * NOTE: this function is NON MUTATING.  If you want to mutate the color call {@code mutate2Float()}
     * 
     * @param {@code Color} color the color whose data is to be used to create the new color
     * @returns {@code Color} the new float representation of the color passed 
     */
    static convert2Float(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        if(color.isFloat())
            return Color.buildColor(color);
        
        return (this(color.getRed()/255, color.getGreen()/255, color.getBlue()/255, color.getAlpha(), true));        
    }

    /**
     * Creates a new {@code Color} that is the integer representation of the passed Color.
     * NOTE: this function is NON MUTATING.  If you want to mutate the color call {@code mutate2Int()}
     * 
     * @param {@code Color} color the color whose data is to be used to make the new {@code Color}
     * @returns {@code Color} the new int representation of the color passed.
     */
    static convert2Int(color)
    {
        if(color instanceof Color)
            throw new Error("Color is not of type Color");
        
        if(color.isFloat() == false)
            return Color.buildColor(color);
        
        return (this(color.getRed() * 255, color.getGreen() * 255, color.getBlue() * 255), color.getAlpha() * 255);
    }

    /**
     * MUTATE the calling {@code Color} object to be the float representation of itself.
     * 
     * @returns {@code Color} the MUTATED calling color represented as a float.
     */
    mutate2Float()
    {
        if(this.isFloat() == false)
            this = new Color(this.getRed() / 255, this.getGreen() / 255, this.getBlue() /255, this.getAlpha()/255, true);
        
        return this;
    }

    /**
     * MUTATE the calling {@code Color} object to be the int representation of itself.
     * 
     * @returns {@code Color} the MUTATED calling color represented as an int
     */
    mutate2Int()
    {
        if(this.isFloat())
            this = new Color(this.getRed() * 255, this.getGreen() * 255, this.getBlue() * 255, this.getAlpha() * 255);

        return this;
    }

    getRed()
    {
        return this.#rgb[0];
    }

    getGreen()
    {
        return this.#rgb[1];
    }

    getBlue()
    {
        return this.#rgb[2];
    }

    getAlpha()
    {
        return this.#rgb[3];
    }

    setAlpha(a)
    {
        if(this.isFloat())
            if(!(a >= 0 && a <= 1))
                throw new Error("alpha is not a float");
            else    
                this.#rgb[3] = a;
        else
            if((!(a >= 0 && a <= 255)))
                throw new Error("alpha is not an int");
            else
                this.#rgb[3] = Math.round(a);    
    }

    isFloat()
    {
        return this.#float;
    }

    getRGBColorComponents()
    {
        return this.#rgb;
    }

    // Apply gamma-encoding (gamma-compression) to the colors.
    // https://www.scratchapixel.com/lessons/digital-imaging/digital-images
    // http://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/
    static applyGamma(color)
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        const newRed =   255 * Math.pow(color.getRed()/255,   Color.GAMMA);
        const newGreen = 255 * Math.pow(color.getGreen()/255, Color.GAMMA);
        const newBlue =  255 * Math.pow(color.getBlue()/255,  Color.GAMMA);
        
        return this(newRed, newGreen, newBlue);
    }

    static hexToRgba(hex)
    {
        if(hex.match(/^#[A-Fa-f0-9]{6}/))
            return new Array([parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3,5), 16), parseInt(hex.substring(5,7), 16), 255]);
        
        return new Array([0, 0, 0, 255]);
    }

    static RgbToHex(color) 
    {
        if(color instanceof Color == false)
            throw new Error("Color is not of type Color");

        return "#" + Color.intToHex(color[0]) + Color.intToHex(color[1]) + Color.intToHex(color[2]);
    }

    static intToHex(x) 
    {
        if (x < 10) 
            return "0" + x.toString(16);
        
        return x.toString(16);
    }
}