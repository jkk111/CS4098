import React from 'react';
import "./Test.css"

import pass from './pass.png'
import fail from './fail.png'

let success = <img src={pass} alt='pass'/>
let failure = <img src={fail} alt='fail'/>

let Test = ({ results = [] }) => {
  return <div className='center-flex'>
    <table className='test-results'>
      <tbody>
        {results.map((result, i) => {
          console.log(result)
          return <tr key={i}>
            <td>{result.name}</td>
            <td>{result.success ? success : failure}</td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

export default Test;