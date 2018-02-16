
const enabled = true;

let stringify = (arg) => {
  let type = typeof arg
  console.log(type, arg)
  switch(type) {
    case 'object':
      return JSON.stringify(arg, null, '  ')
    default:
      return (arg.toString ? arg.toString() : (arg + ''))
  }
}

let output = (label, args, label_col = '', arg_col = '') => {
  if(enabled) {
    if(typeof label !== 'string')
      throw new Error('Expected Type String')
    label = `%c[${label}]`;
    console.log(label, args)
    args = `%c${args.map((arg) => stringify(arg)).join(', \n')}`;

    console.log(`${label} ${args}`, label_col, arg_col);
  }
}

const LOG_LABEL = 'color: blue'
const LOG_ARG = ''

let log = (label, ...args) => output(label, args || [], LOG_LABEL, LOG_ARG);

export default {
  log
}

export {
  log
}