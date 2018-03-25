import React from 'react';
import { Layer, Rect, Stage } from 'react-konva';


const FILL_COLOR = 'brown'
const STROKE_COLOR = 'black'
const TABLE_WIDTH = 100;
const TABLE_HEIGHT = 100;

console.log(FILL_COLOR, TABLE_HEIGHT, TABLE_WIDTH)

let Table = ({ x, y, updatePosition }) => {
  console.log(updatePosition)
  return <Rect x={x-(TABLE_WIDTH/2)} y={y-(TABLE_HEIGHT/2)} fill={FILL_COLOR} draggable={true} onDragEnd={updatePosition}
               width={TABLE_WIDTH} height={TABLE_HEIGHT} stroke={STROKE_COLOR} />
}

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addTable: false,
      x: this.props.x,
      y: this.props.y
    };

    this.handleClick = this.handleClick.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.startAddTable = this.startAddTable.bind(this);
    this.endAddTable = this.endAddTable.bind(this);
  }

  updatePosition(i) {
    return (e) => {
      let x = e.evt.dragEndNode.attrs.x+(TABLE_WIDTH/2);
      let y = e.evt.dragEndNode.attrs.y+(TABLE_HEIGHT/2);
      let { tables } = this.state;
      let before = tables.slice(0, i);

      let after = tables.slice(i + 1);
      let table = { x: x, y: y }

      this.setState({
        tables: [ ...before, table, ...after ]
      })
    }
  }

  mouseMove(e) {
    this.setState({
      x: e.evt.layerX,
      y: e.evt.layerY
    })
  }

  handleClick(e) {
    let { addTable, tables = [], x, y } = this.state;
    if(addTable) {
      console.log(e, tables);
      let next = { x, y };

      this.setState({
        tables: [ ...tables, next ]
      })
    }
  }

  // handleClick = (e) => {

      // if (!this.state.addTable) return;

      // const { mouse } = this.state;

      // let drawingShape = <Rect
      //   x={mouse.x-50}
      //   y={mouse.y-50}
      //   width={TABLE_WIDTH}
      //   height={TABLE_HEIGHT  }
      //   stroke={'black'}
      //   fill={FILL_COLOR}
      //   key={this.state.children.length}
      //   name={`shape${this.state.children.length}`}
      //   draggable={true}
      //   onDragEnd={this.updatePosition}
      // />

      // const { children } = this.state;
      // newChildren.push(drawingShape);

      // this.setState({
      //   children: newChildren,
      // });
    // }

  startAddTable(e) {
    this.setState({
      addTable: true
    });
  }

  endAddTable(e) {
    this.setState({
      addTable: false
    });
  }

  render() {
    let { tables = [] } = this.state;
    let children = tables.map((table, i) => <Table key={i} {...table} updatePosition={this.updatePosition(i)} />)
    return <div>
      <div className='form-button form-field' onClick={this.startAddTable}>Start Adding Tables</div>
      <div className='form-button form-field' onClick={this.endAddTable}>Stop Adding Tables</div>
      <Stage width={window.innerWidth} height={window.innerHeight}
             visible={true} onContentClick={this.handleClick}
             onContentMouseMove={this.mouseMove} >
        <Layer ref='layer'>
          <Rect
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight}
            stroke={'black'}
            fill ={'grey'} />
          {children}
        </Layer>
      </Stage>
    </div>
  }
}

export default CreateTable