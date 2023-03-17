import React from 'react';

import { DebugDraw } from '@box2d/debug-draw';
import { DrawShapes } from '@box2d/core';
import type { DebuggerContext } from '../../typings/type_helpers';

/**
 * <Brief description of the tab>
 * @author <Author Name>
 * @author <Author Name>
 */



export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: any) => true,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    const { context: { moduleContexts: { physics2D: { state: { b2world } } } } } = context;

    const canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;
      if (ctx) {
        const debugDraw = new DebugDraw(ctx);
        debugDraw.Prepare(0, 0, 1, true);
        DrawShapes(debugDraw, b2world);
        debugDraw.Finish();
      }
    }, 50);

    return (
      <div>
        <canvas ref={canvasRef}>
        </canvas>
      </div>
    );
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Physics 2D',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'build',
};
