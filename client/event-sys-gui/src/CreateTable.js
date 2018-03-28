import React from 'react';
import { FloatText } from './FloatText'
import { Layer, Rect, Stage,Text } from 'react-konva';
import { Logger } from './Util'
import './CreateTable.css'
import Dropdown from './Dropdown'
//import MultiDropdown from './MultiDropdown'
//import Dimensions from 'react-dimensions'


const FILL_COLOR = 'brown'
const STROKE_COLOR = 'black'
const FOCUSED_STROKE_COLOR = 'blue'
const TABLE_WIDTH = 100;
const TABLE_HEIGHT = 100;
const TABLE_OFFSET = 50;
const FONT_SIZE = 48;
const FONT_STYLE = 'bold'
const ALIGN = 'center'
const TEXT_WIDTH = 100;
const TEXT_HEIGHT = 100;
const TEXT_OFFSET = 30;
const MOBILE_TABLE_WIDTH = 50;
const MOBILE_TABLE_HEIGHT = 50;
const MOBILE_TABLE_OFFSET = 25;
const MOBILE_TEXT_WIDTH = 50;
const MOBILE_TEXT_HEIGHT = 50;
const MOBILE_TEXT_OFFSET = 15;
const MOBILE_FONT_SIZE = 24;

console.log(FILL_COLOR, TABLE_HEIGHT, TABLE_WIDTH)

let Table = ({ x, y, updatePosition, updateFocused, focused, mobileView}) => {
  let stroke_color = STROKE_COLOR;
  let table_height = TABLE_HEIGHT;
  let table_width = TABLE_WIDTH;
  let table_offset = TABLE_OFFSET;

  if(focused) {
    stroke_color = FOCUSED_STROKE_COLOR;
  }

  else if(mobileView){
    table_height = MOBILE_TABLE_HEIGHT;
    table_width = MOBILE_TABLE_WIDTH;
    table_offset = MOBILE_TABLE_OFFSET;
  }

  return <Rect x={x-(table_offset)}
               y={y-(table_offset)}
               fill={FILL_COLOR}
               draggable={true}
               onDragStart={updateFocused}
               onDragEnd={updatePosition}
               width={table_width}
               height={table_height}
               stroke={stroke_color}
               perfectDrawEnabled={false} />
}

let TableText = ( {x, y, id, dragging, focused, mobileView} ) => {
  let visBool= true;
  let text_width = TEXT_WIDTH;
  let text_height = TEXT_HEIGHT;
  let table_offset = TABLE_OFFSET;
  let text_offset = TEXT_OFFSET;
  let font_size = FONT_SIZE;

  if(dragging && focused) {
    visBool = false;
  }

  else if(mobileView){
    text_width = MOBILE_TEXT_WIDTH;
    text_height = MOBILE_TEXT_HEIGHT;
    table_offset = MOBILE_TABLE_OFFSET;
    text_offset = MOBILE_TEXT_OFFSET;
    font_size = MOBILE_FONT_SIZE;
  }

  return <Text x={x-(table_offset)}
               y={y-(text_offset)}
               fontSize={font_size}
               fontStyle={FONT_STYLE}
               align={ALIGN}
               stroke={STROKE_COLOR}
               width={text_width}
               height={text_height}
               text={id}
               listening={false}
               visible={visBool}/>

}


class CreateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight,
      layouts: [],
      tapped: false,
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
    this.tapped = this.tapped.bind(this);
    this.createTable = this.createTable.bind(this);
    this.check = this.check.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.setLayouts();
  }

  check(e) {
    let form = e.target;
    if(form.layout_description.value === '') {
      this.setState({
        description_error: 'Table Description Cannot Be Empty'
      })
      return
    }
    return true;
  }

  async updateEvent(e){
    let {tables = [], layouts, selectedLayout} = this.state;
    let table_positions = [];
    let form = e.target

    for (var i = 0; i < tables.length; i++) {
      let x = tables[i].x;
      let y = tables[i].y;
      table_positions.push({x: x, y: y})
    }

    let body = {
      description: layouts[selectedLayout].description,
      tables : table_positions
    }

    Logger.log('updating table', body);
    let resp = await fetch('/admin/update_layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    Logger.log("Update Table Response", await resp.json())
    form.reset();

    this.setState({
      description_error: null,
      tables: [],
      selectedLayout: 0
    })
  }

  async createTable(e){
    e.preventDefault();
    if(!this.check(e)) {
      return;
    }
    if(this.state.editing) {
      return this.updateEvent(e);
    }
    let {tables = []} = this.state;
    let table_positions = [];
    let form = e.target

    for (var i = 0; i < tables.length; i++) {
      let x = tables[i].x;
      let y = tables[i].y;
      table_positions.push({x: x, y: y})
    }

    let body = {
      description: form.layout_description.value,
      tables : table_positions
    }

    Logger.log('creating table', body);
    let resp = await fetch('/admin/create_layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    Logger.log("Create Table Response", await resp.json())
    form.reset();

    this.setState({
      description_error: null,
      tables: [],
      selectedLayout: 0
    })
  }

  handleLayoutChange(value){
    let layouts = this.state.layouts;
    if(value != 0){
      this.setState({editing: true,
                    selectedLayout: value,
                    tables: layouts[(value-1)].tables
                    })
    }
    else{
      this.setState({editing: false,
                    selectedLayout: value,
                    tables: []
                    })
    }
  }

  async setLayouts() {
    let response = await fetch('/admin/layouts')
    response = await response.json();
    this.setState({layouts: response});
    Logger.log("Loaded Layouts", response)
  }

  buildLayoutList(){
    let layouts = this.state.layouts;
    let layoutList = [<option key="0" value="0">-select layout to edit-</option>]

     if(layouts.length !== 0) {
      for (var i = 0; i < layouts.length; i++) {
        let name = layouts[i].description;
        let id = layouts[i].id;
        layoutList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return layoutList;
  }

  updateDimensions() {
    let {containerWidth,containerHeight, tables  = []} = this.state;
    var xNew,yNew,table,before,after;
    let transformWidth =  Number(((window.innerWidth/containerWidth).toFixed(8)));
    let transformHeight = Number(((window.innerHeight/containerHeight).toFixed(8)));
    if (tables.length !== 0){
      for(var i=0; i < tables.length; i++){
        let {tables = []} = this.state;
        xNew = Number((tables[i].x*transformWidth).toFixed(4));
        yNew = Number((tables[i].y*transformHeight).toFixed(4));
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
        focused: i, dragging: true
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
      if(dragNode !== 'undefined'){
        let x = dragNode.attrs.x+(TABLE_OFFSET);
        let y = dragNode.attrs.y+(TABLE_OFFSET);
        let { tables} = this.state;

        let before = tables.slice(0, i);

        let after = tables.slice(i + 1);
        let table = { x: x, y: y }

        this.setState({
          focused: i,
          dragging: false,
          tables: [ ...before, table, ...after ]
        })
      }
    }
  }

  tapped(e){
    this.setState({
      x: e.evt.changedTouches[0].clientX,
      y: e.evt.changedTouches[0].clientY,
      tapped: true
    })
    this.handleClick(e);

  }


  mouseMove(e) {
    if((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)){
      this.setState({mobileView: true})
    }
    else{
      this.setState({mobileView: false})
    }
    this.setState({
      x: e.evt.layerX,
      y: e.evt.layerY
    })
  }

  handleClick(e) {
    if((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)){
      this.setState({mobileView: true})
    }
    let {tables = [], x, y,tapped } = this.state;
    if(!tapped){
      return;
    }
    this.setState({
      x: e.evt.layerX,
      y: e.evt.layerY
    })
    console.log(e, tables);
    let next = { x, y };

    this.setState({
      tables: [ ...tables, next ],
      focused: tables.length,
      tapped : false
    })
  }

  deleteTable(e) {
    let { focused, tables = [] } = this.state;

    if(focused === null || tables.length === 0) {
      return;
    }

    let before = [ ...tables.slice(0, focused) ];
    let after = [ ...tables.slice(focused + 1) ];

    this.setState({
      tables: [ ...before, ...after ]
    })
  }

  render() {
    let { tables = [], containerWidth, containerHeight, focused, dragging, mobileView, description_error = null, editing } = this.state;
    let {description, layout_id} = this.props;
    let children = tables.map((table, i) => <Table key={i} {...table} updatePosition={this.updatePosition(i)} updateFocused={this.updateFocused(i)} focused={focused === i} mobileView={mobileView} />)
    let children2 = tables.map((table, i) => <TableText key={i} {...table} id={i+1} dragging={dragging} focused={focused === i} mobileView={mobileView} />)
    if(description_error) {
      description_error = <div className='error'>
        {description_error}
      </div>
    }
    let editing_warning_description = null;
    if(editing) {
      editing_warning_description = <div className='warning'>
        You Cannot Change The Description Of An Existing Layout.
      </div>
    }
    if(this.state.selectedLayout) {
      layout_id = this.state.selectedLayout
    }
    let layoutOptions = this.buildLayoutList();
    let description_props = {};
    if(editing) {
      description_props.disabled = 'disabled'
    }
    let input_value = 'Create Table Layout'
    if(editing) {
      input_value = "Update Table Layout"
    }
    return <div>
      <form onSubmit={this.createTable} autoComplete="off">
        {editing_warning_description}
        {description_error}
        <div className='padding-vert'>
          <Dropdown value={layout_id} onChange={this.handleLayoutChange}>
            {layoutOptions}
          </Dropdown>
        </div>
        <FloatText name="layout_description" label="Table Layout Description:" defaultValue={description} inputProps={description_props} />
        <Stage axisX={containerWidth/70} width={containerWidth-(containerWidth/60)} height={containerHeight-(containerHeight/8)}
               visible={true} onContentClick={this.handleClick} onTap={this.tapped}
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
            {children2}
          </Layer>
        </Stage>
        <div className='form-button form-field' onClick={this.deleteTable}>Click to Delete the Last Table You Interacted With</div>
        <div className='layout_form-input'>
          <input type='submit' className='form-button' submit="create_table_layout" value={input_value} />
        </div>
      </form>
    </div>
  }
}

export default CreateTable
