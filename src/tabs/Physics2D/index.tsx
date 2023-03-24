import React from 'react';


import type { DebuggerContext } from '../../typings/type_helpers';
import DebugDrawCanvas from './DebugDrawCanvas';

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
  toSpawn: () => true,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    const { context: { moduleContexts: { physics2D: { state: { world } } } } } = context;

    return (
      <div>
        <DebugDrawCanvas world={world}/>
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
  iconName: 'wind',
};