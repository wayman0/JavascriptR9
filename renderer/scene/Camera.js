export default class Camera
{
    left;
    right;
    bottom;
    top;
    n;
    perspective;
    
    constructor(l = -1, r = -l, b = -1, t = -b, near = 1, persp = true)
    {
        if(typeof persp != "boolean")
            throw new Error("Perspective must be a boolean");

        if(persp)
            this.projPerspective(l, r, b, t, near);
        else
            this.projOrtho(l, r, b, t, near);
    }

    projPerspective(left = -1, right = -1 * left, bottom = -1, top = -1 * bottom, near = 1)
    {
        if( typeof left != "number"  || typeof right != "number"  ||
            typeof bottom != "number"  || typeof top != "number"  ||
            typeof near != "number" )
                throw new Error("All parameters must be numerical");

        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.n = -1 * near;

        this.perspective = true;
    }

    projPerspectiveFOVY(fovy = 90, aspect = 1, near = 1)
    {
        if(typeof fovy != "number"  || typeof aspect != "number"  || typeof near != "number" )
            throw new Error("FOVY, aspect, and near must be numerical");

        this.top = near * Math.tan((Math.PI/180)*fovy/2);
        this.bottom = -1 * this.top;
        this.right = this.top * aspect;
        this.left = -1 * this.right;
        this.n = -1 * near;
        this.perspective = true;

        // why do we call this fucntion? the only difference is the one line this.perspective = true?
        // this.projPerspective(this.left, this.right, this.bottom, this.top, this.near);
    }

    projOrtho(left = -1, right = 1, bottom = -1, top = 1, near = -1)
    {
        if( typeof left != "number"  || typeof right != "number"  ||
            typeof bottom != "number"  || typeof top != "number"  ||
            typeof near != "number" )
                throw new Error("All parameters must be numerical");

        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.n = -1 * near;

        this.perspective = false;
    }

    projOrthoFOVY(fovy = 90, aspect = 1, near = 1)
    {
        if(typeof fovy != "number" || typeof aspect != "number" || typeof near != "number")
            throw new Error("All parameters must be numerical");

        this.top = near * Math.tan((Math.PI/180)*fovy/2);
        this.bottom = -1 * this.top;
        this.right = this.top * aspect;
        this.left = -1 * this.right;
        this.n = -1 * near;
        this.perspective = false;

        // why do we call this fucntion? the only difference is the one line this.perspective = false?
        // this.projPerspective(this.left, this.right, this.bottom, this.top, this.near);
    }

    toString()
    {
        const fovy = 2 * (180 / Math.PI) * Math.atan(this.top/(-1*this.n));
        const ratio = (this.right - this.left) / (this.top - this.bottom);

        let result = "";
        result += "Camera: \n";
        result += "  perspective = " + this.perspective + "\n";
        result += "  left = "   + this.left + ", "
               +  "  right = "  + this.right + "\n"
               +  "  bottom = " + this.bottom + ", "
               +  "  top = "    + this.top + "\n"
               +  "  near = "   + -1 * this.n + "\n"
               +  "  (fovy = " + fovy
               +  ", aspect ratio = " + ratio + ")";
      
        return result;
    }

    
    static main()
    {
        console.log("Creating cam1 = new Camera()");
        const cam1 = new Camera();
        console.log("cam1: ");
        console.log(cam1.toString());

        console.log("");
        console.log("cam1.projOrtho(-2, 2, -2, 2, 2): ");
        cam1.projOrtho(-2, 2, -2, 2, 2);
        console.log(cam1.toString());

        console.log("");
        console.log("cam1.projPerspFOVY(): ")
        cam1.projPerspectiveFOVY();
        console.log(cam1.toString());

        console.log("");
        console.log("Creating cam2 = new Camera(-4, 4, -4, 4, false)");
        const cam2 = new Camera(-4, 4, -4, 4, 4, false);
        console.log("cam2: ");
        console.log(cam2.toString());

        console.log("");
        console.log("cam2.projPerspective(-3, 3, -3, 3, 3): ");
        cam2.projPerspective(-3, 3, -3, 3, 3);
        console.log(cam2.toString());

        console.log("");
        console.log("cam2.projOrthoFOVY(): ");
        cam2.projOrthoFOVY();
        console.log(cam2.toString());

    }
}