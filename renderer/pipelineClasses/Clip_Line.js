<<<<<<< HEAD
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link LineSegment} that sticks out of the
   view rectangle in the image plane. Interpolate {@link Vertex}
   color from any clipped off {@code Vertex} to the new {@code Vertex}.
<p>
   This clipping algorithm is a simplification of the Liang-Barsky
   Parametric Line Clipping algorithm.
<p>
   This algorithm assumes that all {@code Vertex} objects have been
   projected onto the {@link renderer.scene.Camera}'s image plane,
   {@code z = -1}. This algorithm also assumes that the camera's view
   rectangle in the image plane is
   <pre>{@code
      -1 <= x <= +1  and
      -1 <= y <= +1.
   }</pre>
<p>
   If a line segment's projected vertex has an {@code x} or {@code y}
   coordinate with absolute value greater than 1, then that vertex
   "sticks out" of the view rectangle. This algorithm will clip the
   line segment so that both of the line segment's vertices are within
   the view rectangle.
<p>
   Here is an outline of the clipping algorithm.
<p>
   Recursively process each line segment, using the following steps.
<p>
     1) Test if the line segment no longer needs to be clipped, i.e.,
        both of its vertices are within the view rectangle. If this is
        the case, then return true.
        <pre>{@code
               x=-1        x=+1
                 |          |
                 |          |
             ----+----------+----- y = +1
                 |     v1   |
                 |    /     |
                 |   /      |
                 |  /       |
                 | v0       |
             ----+----------+----- y = -1
                 |          |
                 |          |
        }</pre>
<p>
     2) Test if the line segment should be "trivially rejected". A line
        segment is "trivially rejected" if it is on the wrong side of any
        of the four lines that bound the view rectangle (i.e., the four
        lines {@code x = 1}, {@code x = -1}, {@code y = 1}, {@code y = -1}).
        If so, then return {@code false} (so the line segment will not be
        rasterized into the framebuffer).
<p>
        Notice that a line like the following one is trivially rejected
        because it is on the "wrong" side of the line {@code x = 1}.
        <pre>{@code
                           x=1
                            |            v1
                            |            /
                 +----------+           /
                 |          |          /
                 |          |         /
                 |          |        /
                 |          |       /
                 |          |      /
                 +----------+     /
                            |    /
                            |  v0
        }</pre>
        But the following line is NOT trivially rejected because, even
        though it is completely outside of the view rectangle, this line
        is not entirely on the wrong side of any one of the four lines
        {@code x = 1}, {@code x = -1}, {@code y = 1}, or {@code y = -1}.
        The line below will get clipped at least one time (either on the
        line {@code x = 1} or the line {@code y = -1}) before it is
        (recursively) a candidate for "trivial rejection". Notice that
        the line below could even be clipped twice, first on {@code y = 1},
        then on {@code x = 1}, before it can be trivially rejected (by
        being on the wrong side of {@code y = -1}).
        <pre>{@code
                           x=1
                            |          v1
                            |         /
                 +----------+        /
                 |          |       /
                 |          |      /
                 |          |     /
                 |          |    /
                 |          |   /
                 +----------+  /
                            | /
                            |/
                            /
                           /|
                          / |
                        v0
        }</pre>
<p>
     3) If the line segment has been neither accepted nor rejected, then
        it needs to be clipped. So we test the line segment against each
        of the four clipping lines, {@code x = 1}, {@code x = -1},
        {@code y = 1}, and {@code y = -1}, to determine if the line segment
        crosses one of those lines. We clip the line segment against the
        first line which we find that it crosses. Then we recursively clip
        the resulting clipped line segment. Notice that we only clip against
        the first clipping line which the segment is found to cross. We do
        not continue to test against the other clipping lines. This is
        because it may be the case, after just one clip, that the line
        segment is now a candidate for trivial accept or reject. So rather
        than test the line segment against several more clipping lines
        (which may be useless tests) it is more efficient to recursively
        clip the line segment, which will then start with the trivial accept
        or reject tests.
<p>
        When we clip a line segment against a clipping line, it is always
        the case that one endpoint of the line segment is on the "right"
        side of the clipping line and the other endpoint is on the "wrong"
        side of the clipping line. In the following picture, assume that
        {@code v0} is on the "wrong" side of the clipping line ({@code x = 1})
        and {@code v1} is on the "right" side. So {@code v0} needs to be
        clipped off the line segment and replaced by a new vertex.
        <pre>{@code
                             x=1
                         v1   |
                           \  |
                            \ |
                             \|
                              \
                              |\
                              | \
                              |  \
                              |   v0
        }</pre>
        Represent points {@code p(t)} on the line segment between {@code v0}
        and {@code v1} with the following parametric equation.
        <pre>{@code
                  p(t) = (1-t) * v0 + t * v1  with  0 <= t <= 1
        }</pre>
        Notice that this equation parameterizes the line segment starting
        with {@code v0} at {@code t=0} (on the "wrong side") and ending
        with {@code v1} at {@code t=1} (on the "right side"). We need to
        find the value of {@code t} when the line segment crosses the
        clipping line {@code x = 1}. Let {@code v0 = (x0, y0)} and let
        {@code v1 = (x1, y1)}. Then the above parametric equation becomes
        the two component equations
        <pre>{@code
                 x(t) = (1-t) * x0 + t * x1,
                 y(t) = (1-t) * y0 + t * y1,  with  0 <= t <= 1.
        }</pre>
        Since the clipping line in this example is {@code x = 1}, we need
        to solve the equation {@code x(t) = 1} for {@code t}. So we need
        to solve
        <pre>{@code
                  1 = (1-t) * x0 + t * x1
        }</pre>
        for {@code t}. Here are a few algebra steps.
        <pre>{@code
                  1 = x0 - t * x0 + t * x1
                  1 = x0 + t * (x1 - x0)
                  1 - x0 = t * (x1 - x0)
                       t = (1 - x0)/(x1 - x0)
        }</pre>
        We get similar equations for {@code t} if we clip against the other
        clipping lines ({@code x = -1}, {@code y = 1}, or {@code y = -1})
        and we assume that {@code v0} is on the "wrong side" and {@code v1}
        is on the "right side".
<p>
        Let {@code t0} denote the above value for {@code t}. With this value
        for {@code t}, we can compute the y-coordinate of the new vertex
        {@code p(t0)} that replaces {@code v0}.
        <pre>{@code
                             x=1
                        v1    |
                          \   |
                           \  |
                            \ |
                              p(t0)=(1, y(t0))
                              |
                              |
                              |
         }</pre>
         Here is the algebra.
         <pre>{@code
                  y(t0) = (1-t0) * y0 + t0 * y1
                        = y0 + t0 * (y1 - y0)
                        = y0 + (1 - x0)*((y1 - y0)/(x1 - x0))
         }</pre>
         Finally, the new line segment between {@code v1} and the new
         vertex {@code p(t0)} is recursively clipped so that it can be
         checked to see if it should be trivially accepted, trivially
         rejected, or clipped again.
*/

export default class Clip_Line
{
    static clip(model, ls)
    {
        vIndex0 = ls.getVertexIndexList()[0];
        vIndex1 = ls.getVertexIndexList()[1];
        vertex0 = model.getVertexList()[vIndex0];
        vertex1 = model.getVertexList()[vIndex1];

        x0 = vertex0.x; y0 = vertex0.y;
        x1 = vertex1.x; y1 = vertex1.y;

        if(!(Math.abs(x0) > 1 || 
             Math.abs(y0) > 1 ||
             Math.abs(x1) > 1 ||
             Math.abs(y1) > 1))
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Trivial Accept.");

            return ls;
        }
        else if((x0 > 1  && x1 > 1) ||
                (x0 < -1 && x1 < -1) ||
                (y0 > 1  && y1 > 1) ||
                (y0 < -1 && y1 < -1))
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Trivial Delet.");
                
            return undefined;
        }
        else
            return this.clip(model, Clip_Line.#clipOneTime(model, ls));
    }

    static #clipOneTime(model, ls)
    {
        vIndex0 = ls.getVertexIndexList()[0];
        vIndex1 = ls.getVertexIndexList()[1];
        vertex0 = model.getVertexList()[vIndex0];
        vertex1 = model.getVertexList()[vIndex1];

        x0 = vertex0.x; y0 = vertex0.y;
        x1 = vertex1.x; y1 = vertex1.y;

        equation = "";
        vOutside;
        vOx; vOy;
        vIx; vIy;
        t;
        x;
        y;
        vIndexNew;

        if(x0 > 1)
        {
            equation = "x = +1";
            vOutside = 0;
            vOx = x0; vOy = y0;
            vIx = x1; vIy = y1;

            t = (1-vOx) / (vIx - vOx);
            x = 1;
            y = (1-t) * vOy + t * vIy;
        }
        else if(x1 > 1)
        {
            equation = "x = +1";
            vOutside = 1;
            vIx = x0; vIy = y1;
            t = (1-vOx) / (vIx - vOx);
            x = 1;
            y = (1-t) * vOy + t * vIy;
        }
        else if (x0 < -1)
        {
            equation = "x = -1";
            vOutside = 0;
            vOx = x0; vOy = y0;
            vIx = x1; vIy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;
            y = (1-t) * vOy + t * vIy;
        }
        else if(x1 < -1)
        {
            equation = "x = -1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;  // prevent rounding errors
            y = (1 - t) * vOy + t * vIy;
        }
        else if (y0 > 1)  // ls crosses the line y = 1
        {
            equation = "y = +1";
            vOutside = 0;
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = 1;  // prevent rounding errors
        }
        else if (y1 > 1)  // ls crosses the line y = 1
        {
            equation = "y = +1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = 1;  // prevent rounding errors
        }
        else if (y0 < -1)  // ls crosses the line y = -1
        {
            equation = "y = -1";
            vOutside = 0;
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = -1;  // prevent rounding errors
        }
        else // if (y1 < -1)  // ls crosses the line y = -1
        {
            equation = "y = -1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = -1;  // prevent rounding errors
        }

        newVertex = new Vertex(x, y, 0);
        vIndexNew = model.getVertexList().length;
        model.addVertex(newVertex);

        cIndexI = ls.getColorIndexList()[1-vOutside];
        cIndexO = ls.getColorIndexList()[vOutside];
        cI = model.getColorList()[cIndexI].getRGBColorComponents();
        cO = model.getColorList()[cIndexO].getRGBColorComponents();

        // since t is already a float we dont need to cast it
        if(t > 1)
            t_ = 1/t;
        else
            t_ = t;

        // this looks like blending code, 
        // can we just use a blend function in
        // the color class?
        r = (1-t_) * c0[0] + t_ * cI[0];
        g = (1-t_) * c0[1] + t_ * cI[1];
        b = (1-t_) * c0[2] + t_ * cI[2];

        newColor = new Color(r, g, b);
        cIndexNew = model.getColorList.length();
        model.addColor(newColor);
        
        if(Clip.debug)
        {
            if(0 == vOutside)
                vOut = "v0";
            else
                vOut = "v1";

            PipelineLogger.logMessage("--Clip off " + vOut + " at " + equation);
            PipelineLogger.logMessage("-- t = " + t);
            PipelineLogger.logMessage("-- <x_i, y_i> = <" + vIx + ", " + vIy + ">");
            PipelineLogger.logMessage("-- <x_o, y_o> = <" + vOx + ", " + vIy + ">");
            PipelineLogger.logMessage("-- <x_c, y_c> = <" + x   + ", " + y   + ">");
            PipelineLogger.logMessage("-- <r_i, g_i, b_i> = <" + 
                                            cI[0] + ", " + cI[1] + ", " + cI[2] + ">");
            PipelineLogger.logMessage("-- <r_o, g_o, b_o> = <" + 
                                            cO[0] + ", " + cO[1] + ", " + cO[2] + ">");
            PipelineLogger.logMessage("-- <r_c, g_c, b_c> = <" + 
                                            r + ", " + g + ", " + b + ">");

        }

        if(1 == vOutside)
            newLS = new LineSegment(vIndex0, vIndexNew,
                                    cIndexI, cIndexNew);
        else
            newLS = new LineSegment(vIndexNew, vIndex1, 
                                    cIndexNew, cIndexI);

        return newLS;
    }    
=======
/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Clip a (projected) {@link LineSegment} that sticks out of the
   view rectangle in the image plane. Interpolate {@link Vertex}
   color from any clipped off {@code Vertex} to the new {@code Vertex}.
<p>
   This clipping algorithm is a simplification of the Liang-Barsky
   Parametric Line Clipping algorithm.
<p>
   This algorithm assumes that all {@code Vertex} objects have been
   projected onto the {@link renderer.scene.Camera}'s image plane,
   {@code z = -1}. This algorithm also assumes that the camera's view
   rectangle in the image plane is
   <pre>{@code
      -1 <= x <= +1  and
      -1 <= y <= +1.
   }</pre>
<p>
   If a line segment's projected vertex has an {@code x} or {@code y}
   coordinate with absolute value greater than 1, then that vertex
   "sticks out" of the view rectangle. This algorithm will clip the
   line segment so that both of the line segment's vertices are within
   the view rectangle.
<p>
   Here is an outline of the clipping algorithm.
<p>
   Recursively process each line segment, using the following steps.
<p>
     1) Test if the line segment no longer needs to be clipped, i.e.,
        both of its vertices are within the view rectangle. If this is
        the case, then return true.
        <pre>{@code
               x=-1        x=+1
                 |          |
                 |          |
             ----+----------+----- y = +1
                 |     v1   |
                 |    /     |
                 |   /      |
                 |  /       |
                 | v0       |
             ----+----------+----- y = -1
                 |          |
                 |          |
        }</pre>
<p>
     2) Test if the line segment should be "trivially rejected". A line
        segment is "trivially rejected" if it is on the wrong side of any
        of the four lines that bound the view rectangle (i.e., the four
        lines {@code x = 1}, {@code x = -1}, {@code y = 1}, {@code y = -1}).
        If so, then return {@code false} (so the line segment will not be
        rasterized into the framebuffer).
<p>
        Notice that a line like the following one is trivially rejected
        because it is on the "wrong" side of the line {@code x = 1}.
        <pre>{@code
                           x=1
                            |            v1
                            |            /
                 +----------+           /
                 |          |          /
                 |          |         /
                 |          |        /
                 |          |       /
                 |          |      /
                 +----------+     /
                            |    /
                            |  v0
        }</pre>
        But the following line is NOT trivially rejected because, even
        though it is completely outside of the view rectangle, this line
        is not entirely on the wrong side of any one of the four lines
        {@code x = 1}, {@code x = -1}, {@code y = 1}, or {@code y = -1}.
        The line below will get clipped at least one time (either on the
        line {@code x = 1} or the line {@code y = -1}) before it is
        (recursively) a candidate for "trivial rejection". Notice that
        the line below could even be clipped twice, first on {@code y = 1},
        then on {@code x = 1}, before it can be trivially rejected (by
        being on the wrong side of {@code y = -1}).
        <pre>{@code
                           x=1
                            |          v1
                            |         /
                 +----------+        /
                 |          |       /
                 |          |      /
                 |          |     /
                 |          |    /
                 |          |   /
                 +----------+  /
                            | /
                            |/
                            /
                           /|
                          / |
                        v0
        }</pre>
<p>
     3) If the line segment has been neither accepted nor rejected, then
        it needs to be clipped. So we test the line segment against each
        of the four clipping lines, {@code x = 1}, {@code x = -1},
        {@code y = 1}, and {@code y = -1}, to determine if the line segment
        crosses one of those lines. We clip the line segment against the
        first line which we find that it crosses. Then we recursively clip
        the resulting clipped line segment. Notice that we only clip against
        the first clipping line which the segment is found to cross. We do
        not continue to test against the other clipping lines. This is
        because it may be the case, after just one clip, that the line
        segment is now a candidate for trivial accept or reject. So rather
        than test the line segment against several more clipping lines
        (which may be useless tests) it is more efficient to recursively
        clip the line segment, which will then start with the trivial accept
        or reject tests.
<p>
        When we clip a line segment against a clipping line, it is always
        the case that one endpoint of the line segment is on the "right"
        side of the clipping line and the other endpoint is on the "wrong"
        side of the clipping line. In the following picture, assume that
        {@code v0} is on the "wrong" side of the clipping line ({@code x = 1})
        and {@code v1} is on the "right" side. So {@code v0} needs to be
        clipped off the line segment and replaced by a new vertex.
        <pre>{@code
                             x=1
                         v1   |
                           \  |
                            \ |
                             \|
                              \
                              |\
                              | \
                              |  \
                              |   v0
        }</pre>
        Represent points {@code p(t)} on the line segment between {@code v0}
        and {@code v1} with the following parametric equation.
        <pre>{@code
                  p(t) = (1-t) * v0 + t * v1  with  0 <= t <= 1
        }</pre>
        Notice that this equation parameterizes the line segment starting
        with {@code v0} at {@code t=0} (on the "wrong side") and ending
        with {@code v1} at {@code t=1} (on the "right side"). We need to
        find the value of {@code t} when the line segment crosses the
        clipping line {@code x = 1}. Let {@code v0 = (x0, y0)} and let
        {@code v1 = (x1, y1)}. Then the above parametric equation becomes
        the two component equations
        <pre>{@code
                 x(t) = (1-t) * x0 + t * x1,
                 y(t) = (1-t) * y0 + t * y1,  with  0 <= t <= 1.
        }</pre>
        Since the clipping line in this example is {@code x = 1}, we need
        to solve the equation {@code x(t) = 1} for {@code t}. So we need
        to solve
        <pre>{@code
                  1 = (1-t) * x0 + t * x1
        }</pre>
        for {@code t}. Here are a few algebra steps.
        <pre>{@code
                  1 = x0 - t * x0 + t * x1
                  1 = x0 + t * (x1 - x0)
                  1 - x0 = t * (x1 - x0)
                       t = (1 - x0)/(x1 - x0)
        }</pre>
        We get similar equations for {@code t} if we clip against the other
        clipping lines ({@code x = -1}, {@code y = 1}, or {@code y = -1})
        and we assume that {@code v0} is on the "wrong side" and {@code v1}
        is on the "right side".
<p>
        Let {@code t0} denote the above value for {@code t}. With this value
        for {@code t}, we can compute the y-coordinate of the new vertex
        {@code p(t0)} that replaces {@code v0}.
        <pre>{@code
                             x=1
                        v1    |
                          \   |
                           \  |
                            \ |
                              p(t0)=(1, y(t0))
                              |
                              |
                              |
         }</pre>
         Here is the algebra.
         <pre>{@code
                  y(t0) = (1-t0) * y0 + t0 * y1
                        = y0 + t0 * (y1 - y0)
                        = y0 + (1 - x0)*((y1 - y0)/(x1 - x0))
         }</pre>
         Finally, the new line segment between {@code v1} and the new
         vertex {@code p(t0)} is recursively clipped so that it can be
         checked to see if it should be trivially accepted, trivially
         rejected, or clipped again.
*/

export default class Clip_Line
{
    static clip(model, ls)
    {
        vIndex0 = ls.getVertexIndexList()[0];
        vIndex1 = ls.getVertexIndexList()[1];
        vertex0 = model.getVertexList()[vIndex0];
        vertex1 = model.getVertexList()[vIndex1];

        x0 = vertex0.x; y0 = vertex0.y;
        x1 = vertex1.x; y1 = vertex1.y;

        if(!(Math.abs(x0) > 1 || 
             Math.abs(y0) > 1 ||
             Math.abs(x1) > 1 ||
             Math.abs(y1) > 1))
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Trivial Accept.");

            return ls;
        }
        else if((x0 > 1  && x1 > 1) ||
                (x0 < -1 && x1 < -1) ||
                (y0 > 1  && y1 > 1) ||
                (y0 < -1 && y1 < -1))
        {
            if(Clip.debug)
                PipelineLogger.logMessage("--Trivial Delet.");
                
            return undefined;
        }
        else
            return this.clip(model, Clip_Line.#clipOneTime(model, ls));
    }

    static #clipOneTime(model, ls)
    {
        vIndex0 = ls.getVertexIndexList()[0];
        vIndex1 = ls.getVertexIndexList()[1];
        vertex0 = model.getVertexList()[vIndex0];
        vertex1 = model.getVertexList()[vIndex1];

        x0 = vertex0.x; y0 = vertex0.y;
        x1 = vertex1.x; y1 = vertex1.y;

        equation = "";
        vOutside;
        vOx; vOy;
        vIx; vIy;
        t;
        x;
        y;
        vIndexNew;

        if(x0 > 1)
        {
            equation = "x = +1";
            vOutside = 0;
            vOx = x0; vOy = y0;
            vIx = x1; vIy = y1;

            t = (1-vOx) / (vIx - vOx);
            x = 1;
            y = (1-t) * vOy + t * vIy;
        }
        else if(x1 > 1)
        {
            equation = "x = +1";
            vOutside = 1;
            vIx = x0; vIy = y1;
            t = (1-vOx) / (vIx - vOx);
            x = 1;
            y = (1-t) * vOy + t * vIy;
        }
        else if (x0 < -1)
        {
            equation = "x = -1";
            vOutside = 0;
            vOx = x0; vOy = y0;
            vIx = x1; vIy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;
            y = (1-t) * vOy + t * vIy;
        }
        else if(x1 < -1)
        {
            equation = "x = -1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;  // prevent rounding errors
            y = (1 - t) * vOy + t * vIy;
        }
        else if (y0 > 1)  // ls crosses the line y = 1
        {
            equation = "y = +1";
            vOutside = 0;
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = 1;  // prevent rounding errors
        }
        else if (y1 > 1)  // ls crosses the line y = 1
        {
            equation = "y = +1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = 1;  // prevent rounding errors
        }
        else if (y0 < -1)  // ls crosses the line y = -1
        {
            equation = "y = -1";
            vOutside = 0;
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = -1;  // prevent rounding errors
        }
        else // if (y1 < -1)  // ls crosses the line y = -1
        {
            equation = "y = -1";
            vOutside = 1;
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1 - t) * vOx + t * vIx;
            y = -1;  // prevent rounding errors
        }

        newVertex = new Vertex(x, y, 0);
        vIndexNew = model.getVertexList().length;
        model.addVertex(newVertex);

        cIndexI = ls.getColorIndexList()[1-vOutside];
        cIndexO = ls.getColorIndexList()[vOutside];
        cI = model.getColorList()[cIndexI].getRGBColorComponents();
        cO = model.getColorList()[cIndexO].getRGBColorComponents();

        // since t is already a float we dont need to cast it
        if(t > 1)
            t_ = 1/t;
        else
            t_ = t;

        // this looks like blending code, 
        // can we just use a blend function in
        // the color class?
        r = (1-t_) * c0[0] + t_ * cI[0];
        g = (1-t_) * c0[1] + t_ * cI[1];
        b = (1-t_) * c0[2] + t_ * cI[2];

        newColor = new Color(r, g, b);
        cIndexNew = model.getColorList.length();
        model.addColor(newColor);
        
        if(Clip.debug)
        {
            if(0 == vOutside)
                vOut = "v0";
            else
                vOut = "v1";

            PipelineLogger.logMessage("--Clip off " + vOut + " at " + equation);
            PipelineLogger.logMessage("-- t = " + t);
            PipelineLogger.logMessage("-- <x_i, y_i> = <" + vIx + ", " + vIy + ">");
            PipelineLogger.logMessage("-- <x_o, y_o> = <" + vOx + ", " + vIy + ">");
            PipelineLogger.logMessage("-- <x_c, y_c> = <" + x   + ", " + y   + ">");
            PipelineLogger.logMessage("-- <r_i, g_i, b_i> = <" + 
                                            cI[0] + ", " + cI[1] + ", " + cI[2] + ">");
            PipelineLogger.logMessage("-- <r_o, g_o, b_o> = <" + 
                                            cO[0] + ", " + cO[1] + ", " + cO[2] + ">");
            PipelineLogger.logMessage("-- <r_c, g_c, b_c> = <" + 
                                            r + ", " + g + ", " + b + ">");

        }

        if(1 == vOutside)
            newLS = new LineSegment(vIndex0, vIndexNew,
                                    cIndexI, cIndexNew);
        else
            newLS = new LineSegment(vIndexNew, vIndex1, 
                                    cIndexNew, cIndexI);

        return newLS;
    }    
>>>>>>> f18eccc9d44d49cd6196c7d07c30815826c751f9
}