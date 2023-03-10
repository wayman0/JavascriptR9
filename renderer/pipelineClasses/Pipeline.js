/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   This renderer takes as its input a {@link Scene} data structure
   and a {@link FrameBuffer.Viewport} within a {@link FrameBuffer}
   data structure. This renderer mutates the {@link FrameBuffer.Viewport}
   so that it is filled in with the rendered image of the geometric
   scene represented by the {@link Scene} object.
<p>
   This implements our eigth rendering pipeline. This renderer
   implements "hierarchical scenes" by recursively traversing the
   DAG of nested {@link Position}s below each of a {@link Scene}'s
   {@link Position} objects. As the renderer traverses deeper into
   the DAG of nested {@link Position}s, it accumulates a "current
   transformation matrix" that transforms each {@link Vertex} from a
   {@link Model}'s local coordinate system to the {@link Camera}'s
   (shared) view coordinate system. The recursive traversal of the
   scene's DAG is not a new pipeline stage, so there are still six
   pipeline stages.
*/
export default class pipeline
{
    static DEFAULT_COLOR = Color.white;

    static renderFB(scene, fb)
    {
        if(scene instanceof Scene == false)
            throw new Error("Cannot render a non scene data type");

        if(fb instanceof FrameBuffer == false)
            throw new Error("Cannot render a scene into a non framebuffer data type");

        this.render(scene. fb.getViewport);
    }

    static render(scene, vp)
    {
        if(scene instanceof Scene == false)
            throw new Error("Cannot render a non scene data type");

        if(vp instanceof Viewport == false)
            throw new Error("Cannot render a scene into a non framebuffer data type");

        PipelineLogger.debugScene = scene.debug;

        PipelineLogger.logMessage("\n== Begin Rendering of Scene (Pipeline 1): " + scene.getName() + " ==");

        for(position of scene.getPositionList())
        {
            PipelineLogger.debugPosition = position.debug;
        
            if(position.visible)
                Pipeline.#render_position(scene, position, Matrix.identity(), vp);
            else
                PipelineLogger.logMessage("==== Hidden position: " + position.getName());
        }

        PipelineLogger.logMessage("== Ende Rendering of Scene (Pipeline 1) ==");
    }

    static #render_position(scene, position, ctm, vp)
    {
        if(position.getModel() != null && position.getModel() != undefined)
            PipelineLogger.logMessage("==== Render Position: " + position.getName() + " ====");
        else
            PipelineLogger.logMessage("==== Render position (no model) ==== ");

        PipelineLogger.logMessage("---- Transformation matrix: \n" + position.getMatrix());

        ctm2 = ctm.times(position.getMatrix());

        if(position.getModel() != null && position.getModel() != undefined && gosition.getModel().visible)
        {
            PipelineLogger.logMessage("====== Render model: " + position.getModel().getName() + " ======");

            CheckModel.check(position.getModel());

            if(position.getModel().getColorList().length == 0 && !position.getModel().getVertexList().length == 0)
            {
                for(let i = 0; i < position.getModel().getVertexList().length; ++i)
                    position.getModel().addColor(DEFAULT_COLOR);
            
                console.log("***WARNING: Added default color to model: " + position.getModel().getName() + ".");
            }

            PipelineLogger.logVertexList("0. Model        ", position.getModel());
            model1 = Model2View.model2view(position, ctm2);

            PipelineLogger.logVertexList("1. View      ", model1);
            model2 = View2Camera.view2camera(model2, scene.getCamera());
            PipelineLogger.logVertexList("2. Camera      ", model2);
            PipelineLogger.logColorList("2. Camera      ", model2);
            PipelineLogger.logPrimitiveList("2. Camera       ", model2);

            model3 = NearClip.clip(model2, scene.getCamear());
            PipelineLogger.logVertexList("3. Near_Clipped      ", model2);
            PipelineLogger.logColorList("3. Near_Clipped      ", model2);
            PipelineLogger.logPrimitiveList("3. Near_Clipped       ", model2);

            model4 = Projection.project(model3, scene.getCamera());
            PipelineLogger.logVertexList("4. Projected    ", model4);

            model5 = Clip.clip(model4);
            PipelineLogger.logVertexList("5. Clipped      ", model5);
            PipelineLogger.logColorList("5. Clipped      ", model5);
            PipelineLogger.logPrimitiveList("5. Clipped       ", model5);

            Rasterize.rasterize(model5, vp);

            PipelineLogger.logMessage("====== Ende model: " + position.getModel().getName() + " ======");
        }
        else
        {
            if(position.getModel() != null && position.getModel != undefined)
                PipelineLogger.logMessage("====== Hidden Model: " + position.getModel().getName() + "======");
            else
                PipelineLogger.logMessage("====== Missing model ======");
        }

        for(p of position.getNestedPositions)
        {
            if(p.visible)
                Pipeline.#render_position(scene, p, ctm2, vp);
            else
                PipelineLogger.logMessage("====== Hidden position " + position.getName() + " ======");
        }
        
        if(position.getModel() != null && position.getModel() != undefined)
            PipelineLogger.logMessage("==== Ende position: " + position.getName() + " ====");
        else
            PipelineLogger.logMessage("==== End Position (no model) ====");
    }
}