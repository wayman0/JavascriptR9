/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   We use two steps to transform the camera's orthographic view volume
   into the standard orthographic view volume. The first step translates
   the  current view volume so that its center line is the z-axis. The
   second step scales the translated view volume so that it intersects
   the plane {@code z = 0} with corners {@code (-1, -1, 0)} and
   {@code (+1, +1, 0)}.
<p>
   This matrix translates the camera's view volume so that the translated
   view volume will be centered on the z-axis.
   <pre>{@code
     [ 1  0  0  -(r+l)/2 ]
     [ 0  1  0  -(t+b)/2 ]
     [ 0  0  1      0    ]
     [ 0  0  0      1    ]
   }</pre>
   This matrix scales the translated view volume so that it will
   be 2 units wide and 2 units tall at the view plane {@code z = 0}.
   <pre>{@code
     [ 2/(r-l)    0    0  0 ]
     [   0     2/(t-b) 0  0 ]
     [   0        0    1  0 ]
     [   0        0    0  1 ]
   }</pre>
   The matrix product looks like this.
   <pre>{@code
     [ 1  0  0  -(r+l)/2 ]   [ 2/(r-l)    0    0  0 ]
     [ 0  1  0  -(t+b)/2 ] = [   0     2/(t-b) 0  0 ]
     [ 0  0  1      0    ]   [   0        0    1  0 ]
     [ 0  0  0      1    ]   [   0        0    0  1 ]

          [ 2/(r-l)    0    0  -(r+l)/2 ]
        = [   0     2/(t-b) 0  -(t+b)/2 ]
          [   0        0    1      0    ]
          [   0        0    0      1    ]
   }</pre>
   This product matrix transforms the camera's orthographic view
   volume into the standard (normalized) orthographic view volume
   whose intersection with the view plane, {@code z = 0}, has
   {@code left = -1}, {@code right = +1}, {@code bottom = -1},
   and {@code top = +1}.
*/

import Matrix from "./Matrix.js";
export default class OrthographicNormalizeMatrix
{
    static build(l, r, b, t)
    {
        if( typeof l != Number || typeof r != Number ||
            typeof b != Number || typeof t != Number)
                throw new Error("L, B, R, T must be numerical");

        m1, m2;
        m1 = Matrix.buildFromColumns(
            new Vector(  1.0,      0.0,    0.0, 0.0),
            new Vector(  0.0,      1.0,    0.0, 0.0),
            new Vector(  0.0,      0.0,    1.0, 0.0),
            new Vector(-(r+l)/2, -(t+b)/2, 0.0, 1.0));

        m2 = Matrix.buildFromColumns(
            new Vector(2/(r-l),   0.0,   0.0, 0.0),
            new Vector(   0.0,  2/(t-b), 0.0, 0.0),
            new Vector(   0.0,    0.0,   1.0, 0.0),
            new Vector(   0.0,    0.0,   0.0, 1.0));

        return m2.times(m1);
    }

}
