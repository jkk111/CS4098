import React from 'react';

import { Layer, Rect, Stage } from 'react-konva';
//import Dimensions from 'react-dimensions'


const FILL_COLOR = 'brown'
const STROKE_COLOR = 'black'
const TABLE_WIDTH = 100;
const TABLE_HEIGHT = 100;

console.log(FILL_COLOR, TABLE_HEIGHT, TABLE_WIDTH)

let Table = ({ x, y, updatePosition, updateFocused }) => {
  console.log(updatePosition)
  return <Rect x={x-(TABLE_WIDTH/2)} y={y-(TABLE_HEIGHT/2)} fill={FILL_COLOR} draggable={true} onDragStart={updateFocused} onDragEnd={updatePosition}
               onTouchStart={updateFocused} onTouchEnd={updatePosition} width={TABLE_WIDTH} height={TABLE_HEIGHT} stroke={STROKE_COLOR} perfectDrawEnabled={false} />
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
  	/*
  	let {containerWidth,containerHeight, tables  = []} = this.state;
  	if (tables.length !== 0){
  		for(var i=0; i < tables.length; i++){
	  	  let transformWidth =  Number(((window.innerWidth/containerWidth).toFixed(8)));
		  	let transformHeight = Number(((window.innerHeight/containerHeight).toFixed(8)));
	      let table = tables.map(x => x*transformWidth);
	  	  table = tables.map(y=> y*transformHeight);
	  	  this.setState({tables :[table]});	
  		}
  	}
  	*/
  	//let {containerWidth, containerHeight} = Dimensions.get('screen')
  	this.setState({
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight});
	//			   tables :[table]});
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


      //console.log(deleteTable)
      // Rethink this
     //  if(deleteTable) {
  	  //   let before = tables.slice(0, i);
  	  //   let after = tables.slice(i + 1);
  	  //   this.setState({
  	  //     tables: [ ...before, ...after ]
  	  //   })
  	  // }
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
/*
  addTable(e) {
  	let{addTable} =this.state
    if(!addTable){
	  this.setState({
	    addTable: true
	  });
	}
  	else{
      this.setState({
  	    addTable: false
  	  });
  	}
  }
  <div className='form-button form-field' onClick={this.addTable}>Click to Start/Stop Adding Tables(Click Anywhere to Add)</div>
*/
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
    	//{this.props.containerWidth}
      //containerHeight={this.props.containerHeight}
  render() {
    let { tables = [],containerWidth,containerHeight } = this.state;
    let children = tables.map((table, i) => <Table key={i} {...table} updatePosition={this.updatePosition(i)} updateFocused={this.updateFocused(i)} />)
    return <div>
      <Stage width={containerWidth-(containerWidth/60)} height={containerHeight-(containerHeight/8)}
             visible={true} onContentClick={this.handleClick} onTap={this.handleClick}
             onContentMouseMove={this.mouseMove} >
        <Layer ref='layer' batchDraw={true}>
          <Rect
            x={containerWidth/70}
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