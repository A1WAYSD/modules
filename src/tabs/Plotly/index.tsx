import React from 'react';
import { DrawnPlot } from '../../bundles/plotly/plotly';
import { DebuggerContext } from '../../typings/type_helpers';
import Modal from '../common/modal_div';

type Props = {
  children?: never
  className?: string
  debuggerContext: any
};

type State = {
  modalOpen: boolean
  selectedPlot: any | null
};

class Plotly extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedPlot: null,
    };
  }

  handleOpen = (selectedPlot: DrawnPlot) => {
    this.setState({
      modalOpen: true,
      selectedPlot,
    });
  };

  public render() {
    const { context: { moduleContexts: { plotly: { state: { drawnPlots } } } } } = this.props.debuggerContext;

    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          height={'20rem'}
          width={'20rem'}
          handleClose={() => this.setState({ modalOpen: false })}
        >
          <div
            id='modalDiv'
            ref={() => {
              if (this.state.selectedPlot) {
                this.state.selectedPlot.draw('modalDiv');
              }
            }}
            style={{ height: '20rem', width: '20rem' }}
          ></div>
        </Modal>
        {
          drawnPlots.map((drawnPlot: any, id:number) => {
            const divId = `plotDiv${id}`;
            return (
              <>
                <div onClick={() => this.handleOpen(drawnPlot)}>Click here to open Modal</div>
                <div
                  id={divId}
                  ref={() => {
                    drawnPlot.draw(divId);
                  }}
                ></div>
              </>
            );
          })
        }

      </div>
    );
  }
}

export default {
  toSpawn(context: DebuggerContext) {
    const drawnPlots = context.context?.moduleContexts?.plotly.state.drawnPlots;
    return drawnPlots.length > 0;
  },
  body: (debuggerContext: any) => <Plotly debuggerContext={debuggerContext} />,
  label: 'Plotly Test Tab',
  iconName: 'scatter-plot',
};
