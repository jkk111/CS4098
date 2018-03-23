import React from 'react';
import * as R from 'ramda';
import { Layer, Rect, Stage,} from 'react-konva';


class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'brown',
      height: 100,
      width: 100,
      children: [],
    };
  }


  handleClick = (e) => {

      
      let drawingShape = <Rect
        x={0}
        y={0}
        width={this.state.width}
        height={this.state.height}
        stroke={'black'}
        fill={this.state.color}
        key={this.state.children.length}
        name={`shape${this.state.children.length}`}
        draggable={true}
      />

      const { children } = this.state;
      const newChildren = R.clone(children);
      newChildren.push(drawingShape);

      this.setState({
        children: newChildren,
      });
    }


  render() {
   return (
      <div>
        <div className='form-button form-field' onClick={this.handleClick}>Add Table</div>
        <Stage width={window.innerWidth-100} height={window.innerHeight-100}
        >
          <Layer ref='layer'>
            {this.state.children}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default CreateTable