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
   scene's DAG is not a new pipeline stage, so there are still five
   pipeline stages.
*/

export default class Pipeline2
{
    static DEFAULT_COLOR = Color.white;

    static scene1 = undefined;
    static scene2 = undefined;
    static scene3 = undefined;
    static scene4 = undefined;
    static scene5 = undefined;

    static renderFB(scene, fb)
    {
        if(scene instanceof Scene == false)
            throw new Error("Cannot render a non scene data type");

        if(fb instanceof FrameBuffer == false)
            throw new Error("Cannot render a scene into a non framebuffer data type");

        Pipeline2.renderFB(scene, fb.getViewport());
    }

    static render(scene, vp)
    {
        if(scene instanceof Scene == false)
            throw new Error("Cannot render a non scene data type");

        if(fb instanceof Viewport == false)
            throw new Error("Cannot render a scene into a non framebuffer data type");

     
        PipelineLogger.logMessage("\n== Begin Rendering of Scene (Pipeline 2): " + scene.getName() + " ==");
        scene1 = Scene.buildFromCameraName(scene.getCamera(), scene.getName());

        logMessage("==== 1. Begin model to view transformation of Scene ====");
        for(position of scene.getPositionList())
        {
            if(position.visible)
            {
                renderedPosition = model2view(position, Matrix.identity());
                if( (renderedPosition.getModel() != null && renderedPosition.getModel() != undefined) || !renderedPosition.getNestedPositions().length == 0)
                    scene1.addPosition(renderedPosition);
            }
            else
                PipelineLogger.logMessage("==== 1. Hidden position: " + position.getName() + " ====");
        }
            
        PipelineLogger.logMessage("==== 1. End model to view transformation of Scene ====");
        scene2 = Scene.buildFromCameraName(scene.getCamera(), scene.getName());

        PipelineLogger.logMessage("==== 2. Begin view to camera transformation of Scene ====");
        for(position of scene1.getPositionList())
            scene2.addPositioN(view2camera(position, scene.getCamera()));
        PipelineLogger.logMessage("==== 2. End view to camera transformation of scene ====");

        scene3 = Scene.buildFromCameraName(scene.getCamera(), scene.getName());
        PipelineLogger.logMessage("==== 3. Begin near plane clippinf of Scene ==== ");
        for(position of scene2.getPositionList())
            scene3.addPosition(nearClip(position, scene.getCamera()));
        PipelineLogger.logMessage("==== 3. End near plane clipping of scene ==== ");

        scene4 = Scene.buildFromCameraName(scene.getCamera(), scene.getName());
        PipelineLogger.logMessage("==== 4. Begin projection transformation of scene");
        for(position of scene3.getPositionList())
            scene4.addPosition(project(position, scene.getCamera()));
        PipelineLogger.logMessage("==== 4. End projection transformation of Scene ====");

        scene5 = Scene.buildFromCameraName(scene.getCamera(), scene.getName())
        PipelineLogger.logMessage("==== 5. Begin primitive clipping of Scene ====");
        for(position of scene4.getPositionList())
            scene5.addPosition(clip(position));
        PipelineLogger.logMessage("==== 5. End primitive clipping of Scene ====");

        PipelineLogger.logMessage("==== 6. Begin primitive rasterization of Scene ====");
        for(position of scene5.getPositioList())
            rasterize(position, vp);
        PipelineLogger.logMessage("==== 6. End primitive rasterization of Scene ====");

        PipelineLogger.logMessage("== End Rendering of Scene (Pipeline 2) ==");
    }
    
    static #model2view(position, ctm)
    {
        PipelineLogger.logMessage("==== 1. Render position: " + position.getName() + " ====");
        PipelineLogger.logMessage("---- Transformation matrix: \n" + position.getMatrix());

        ctm2 = ctm.times(position.getMatrix());

        position2 = Position.buildFromName(position.getName());

        if(position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
        {
            PipelineLogger.logMessage("====== 1. Model to view transformation of " 
                                        + position.getModel().getName() + " ======");

            CheckModel.check(position.getModel());

            if(position.getModel().getColorList().length == 0 &&
                !position.getModel().getVertexList().length == 0)
            {
                for(let i = 0; i  < position.getModel().getVertexList().length; ++ i)
                    position.getModel().addColor(Pipeline2.DEFAULT_COLOR);

                console.log("***WARNING: Added default color to model: " + position.getModel().getName() + ".");
            }
            PipelineLogger.logVertexList("0. Model    ", position.getModel());

            position2.setModel(Model2View.model2view(position, ctm2));

            PipelineLogger.logVertexList("!. View    ", position2.getModel());

            PipelineLogger.logMessage("====== 1. End Mode: " + 
                                            position2.getModel().getName() + " ======");
        }
        else
        {
            if(position.getModel() != null && position.getModel() != undefined)
                logMessage("====== 1. Hidden Model: " + position.getModel().getName() + " ======");
            else
                logMessage("====== 1. Missin Model ======");
        }

        for(let p of position.getNestedPositions())
        {
            if(p.visible)
            {
                renderedPosition = model2view(p, ctm2);

                if(renderedPosition.getModel() != null && renderedPosition.getModel() != undefined 
                    || !renderedPosition.getNestedPositions().length == 0)
                        position2.addNestedPosition(renderedPosition);
            }
            else
                PipelineLogger.logMessage("==== 1. Hidden osition: " + p.getName() + " ====");
        }

        PipelineLogger.logMessage("==== 1. End Position: " + position.getName() + " ====");

        return position2;       
    }

    static #view2camera(position, camera)
    {
        PipelineLogger.logMessage("==== 2. Render position: " + position.getName() + " ====");

        position2 = Position.buildFromName(position.getName());
        if(position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
        {
            PipelineLogger.logMessage("====== 2. Transform model: " + position.getModel().getName() + " ======");
            position2.setModel(View2Camera.view2camera(position.getModel(), camera));

            PipelineLogger.logVertexList("2. Camera   ", position2.getModel());
            PipelineLogger.logColorList("2. Camera   ", position2.getModel());
            Pipelinelogger.logPrimitiveList("2. Camera    ", position2.getModel());

            Pipelinelogger.logMessage("======= 2. End Model: " + 
                                        position2.getModel().getName() + " ======");
        }
        else
        {
            if(position.getModel() != null && position.getModel() != undefined)
                PipelineLogger.logMessage("====== 2. Hidden model: " + 
                                            position.getModel().getName() + " ======");
            else
                PipelineLogger.logMessage("====== 2. Missing model ======");
        }

        for(p of position.getNestedPositions())
            position2.addNestedPosition(view2Camera(p, camera));

        PipelineLogger.logMessage("==== 2. End position: " + position.getName() + " ====");
    }

    static #nearClip(position, camera)
    {
        Pipelinelogger.logMessage("==== 2. Render position: " + position.getName() + " ====");

        position2 = new position(position.getName());

        if(position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
        {
            PipelineLogger.logMessage("====== 3. Near_Clip model: " 
                                        + position.getModel().getName() + " ======");

            position2.setModel(NearClip.clip(position.getModel(), camera));

            Pipelinelogger.logVertexList("3. Near_Clipped  ", position2.getModel());
            Pipelinelogger.logColorList("3. Near_Clipped  ", position2.getModel());
            Pipelinelogger.logPrimitiveList("3. Near_Clipped  ", position2.getModel());

            pipelineLogger.log("====== 3. End Model: " + 
                                position2.getModel().getName() + " ======");
                            
        }
        else
        {
            if(position.getModel() != null && position.getModel() != undefined)
                PipelineLogger.logMessage("====== 3. Hidden model: " + 
                                            position.getModel().getName() + " ======");
            else
                pipelineLogger.logMessage("====== 3. Missing model ======");
        }

        for(p of position.getNestedPositions())
            position2.addNestedPosition(nearClip(p, camera));

        pipelineLogger.logMessage("==== 3. End position: " + position.getName() + " ====");

        return position2;
    }

    static #project(position, camera)
    {
        PipelineLogger.logMessage("==== 4. Render position: " + position.getName() + " ====");

        position2 = Position.buildFromName(position.getName());

        if(position.getModel() != null && position.getModel() != undefined && position.getModel().visible)
        {
            PipelineLogger.logMessage("====== 4. Project model: " + 
                                        position.getModel().getName() + " ======");
            
            position2.setModel(Projection.project(position.getModel(), camera));
            PipelineLogger.logVertexList("4. Projected", position2.getModel());
            PipelineLogger.logMessage("====== 4. end Model: " + 
                                        position2.getModel().getName() + " ======");                                
        }
        else
        {
            if(position.getModel() != null || position.getModel() != undefined)
                PipelineLogger.logMessage("====== 4. Hidden model: " + 
                                            position.getModel().getName() + " ======");
            else
                Pipelinelogger.logMessage("====== 4. Missing model ======");
        }

        for(p of position.getNestedPositions())
            position2.addNestedPosition(project(p, camera));

        PipelineLogger.logMessage("==== 4. End position: " + position.getName() + " ====");

        return position2;
    }

    
}