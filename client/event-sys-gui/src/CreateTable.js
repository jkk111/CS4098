import React from 'react';
import * as R from 'ramda';
import { Layer, Rect, Stage } from 'react-konva';


class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'brown',
      height: 100,
      width: 100,
      children: [],
      x: this.props.x,
      y: this.props.y,
      mouse: {
        x: 0,
        y: 0
      },
    };
  }


    updatePosition = (e,x, y) => {
    this.setState({
      ...this.state,
      x: e.evt.dragEndNode.attrs.x,
      y: e.evt.dragEndNode.attrs.y,
    });
  }


  handleClick = (e) => {

      if (!this.state.drawingMode) return;

      const { mouse } = this.state;
      
      let drawingShape = <Rect
        x={mouse.x-50}
        y={mouse.y-50}
        width={this.state.width}
        height={this.state.height}
        stroke={'black'}
        fill={this.state.color}
        key={this.state.children.length}
        name={`shape${this.state.children.length}`}
        draggable={true}
        onDragEnd={this.updatePosition}
      />

      const { children } = this.state;
      const newChildren = R.clone(children);
      newChildren.push(drawingShape);

      this.setState({
        children: newChildren,
      });
    }

  handleMouseMove= (e) => {
    if (this.state.drawingMode) {
      // get cursor current position
      this.setState({
        mouse: {
          ...this.state.mouse,
          x: e.evt.layerX,
          y: e.evt.layerY,
        }
      });
    }
  }

  handleStartAddTableClick = (e) => {
    this.setState({
      drawingMode: true
    });
  }

  handleStopAddTableClick = (e) => {
    this.setState({
      drawingMode: false
    });
  }

  render() {
   return (
      <div>
        <div className='form-button form-field' onClick={this.handleStartAddTableClick}>Click to Start Adding Tables</div>
        <div className='form-button form-field' onClick={this.handleStopAddTableClick}>Click to Stop Adding Tables</div>
        <Stage width={window.innerWidth} height={window.innerHeight}  visible={true} onContentClick={this.handleClick} onContentMouseMove={this.handleMouseMove} drawBorder= {true}
        >
          <Layer ref='layer'>
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              stroke={'black'}
              fill ={'grey'}
            />
            {this.state.children}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default CreateTable