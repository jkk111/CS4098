import React from 'react';

import { Layer, Rect, Stage } from 'react-konva';
//import Dimensions from 'react-dimensions'


const FILL_COLOR = 'brown'
const STROKE_COLOR = 'black'
const FOCUSED_STROKE_COLOR = 'blue'
const TABLE_WIDTH = 100;
const TABLE_HEIGHT = 100;

console.log(FILL_COLOR, TABLE_HEIGHT, TABLE_WIDTH)

let Table = ({ x, y, updatePosition, updateFocused, focused }) => {
  let stroke_color = STROKE_COLOR;

  if(focused) {
    stroke_color = FOCUSED_STROKE_COLOR;
  }

  return <Rect x={x-(TABLE_WIDTH/2)}
               y={y-(TABLE_HEIGHT/2)}
               fill={FILL_COLOR}
               draggable={true}
               onDragStart={updateFocused}
               onDragEnd={updatePosition}
               onTouchStart={updateFocused}
               onTouchEnd={updatePosition}
               width={TABLE_WIDTH}
               height={TABLE_HEIGHT}
               stroke={stroke_color}
               perfectDrawEnabled={false} />
}

class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight, // This isn't right we shouldn't be using the window size
      x: this.props.x,
      y: this.props.y
    };

    this.handleClick = this.handleClick.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.deleteTable = this.deleteTable.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.updateFocused = this.updateFocused.bind(this);
    this.clearFocused = this.clearFocused.bind(this);
  }

  updateDimensions() {
  	let {containerWidth,containerHeight, tables  = []} = this.state;
  	var xNew,yNew,table,before,after;
  	let transformWidth =  Number(((window.innerWidth/containerWidth).toFixed(6)));
		let transformHeight = Number(((window.innerHeight/containerHeight).toFixed(6)));
		var before, after;
  	if (tables.length !== 0){
  		for(var i=0; i < tables.length; i++){
  			let {tables = []} = this.state;
	      xNew = Number((tables[i].x*transformWidth).toFixed(2));
	      yNew = Number((tables[i].y*transformHeight).toFixed(2));
	  	  before = tables.slice(0, i);
	  	  after = tables.slice(i + 1);
      	table = { x: xNew, y: yNew }
	  	  this.setState({tables: [ ...before, table, ...after ]})
	  	}
  	}

  	this.setState({
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateFocused(i) {
    return (e) => {
      this.setState({
        focused: i
      })
    }
  }

  clearFocused() {
    this.setState({
      focused: null
    })
  }

  updatePosition(i) {
    return (e) => {
      console.log(e.evt);
      let dragNode = e.evt.dragEndNode;

      let x = dragNode.attrs.x+(TABLE_WIDTH/2);
      let y = dragNode.attrs.y+(TABLE_HEIGHT/2);
      let { tables} = this.state;

      let before = tables.slice(0, i);

      let after = tables.slice(i + 1);
      let table = { x: x, y: y }

      this.setState({
        focused: i,
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
    let {tables = [], x, y } = this.state;
    console.log(e, tables);
    let next = { x, y };

    this.setState({
      tables: [ ...tables, next ],
      focused: tables.length
    })
  }

  deleteTable(e) {
    let { focused, tables } = this.state;

    if(focused === null) {
      return;
    }

    let before = [ ...tables.slice(0, focused) ];
    let after = [ ...tables.slice(focused + 1) ];

    this.setState({
      tables: [ ...before, ...after ]
    })
  }

  render() {
    let { tables = [], containerWidth, containerHeight, focused } = this.state;
    let children = tables.map((table, i) => <Table key={i} {...table} updatePosition={this.updatePosition(i)} updateFocused={this.updateFocused(i)} focused={focused === i} />)
    return <div>
      <Stage axisX={containerWidth/70} width={containerWidth-(containerWidth/60)} height={containerHeight-(containerHeight/8)}
             visible={true} onContentClick={this.handleClick} onTap={this.handleClick}
             onContentMouseMove={this.mouseMove} >
        <Layer axisX={containerWidth/70} ref='layer' batchDraw={true}>
          <Rect
            x={containerWidth/120}
            y={containerHeight/120}
            width={containerWidth-(containerWidth/38)}
            height={containerHeight-(containerHeight/7)}
            stroke={'black'}
            fill ={'grey'}
            perfectDrawEnabled={false}
            listening={false} />
          {children}
        </Layer>
      </Stage>
      <div className='form-button form-field' onClick={this.deleteTable}>Click to Delete the Last Table You Interacted With</div>
    </div>
  }
}

export default CreateTable