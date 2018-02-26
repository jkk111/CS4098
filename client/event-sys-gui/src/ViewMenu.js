import React from 'react'

let ViewMenu = ({ name, starters, mains, desserts, drinks }) => {
  starters = starters.map((starter, i) => {
    <div key={i}>
      {starter.name} {starter.description}
    </div>
  })
  mains = mains.map((main, i) => {
    <div key={i}>
      {main.name} {main.description}
    </div>
  })
  desserts = desserts.map((dessert, i) => {
    <div key={i}>
      {dessert.name} {dessert.description}
    </div>
  })
  drinks = drinks.map((drink, i) => {
    <div key={i}>
      {drink.name} {drink.description}
    </div>
  })
  <div>
    <h1>{name}</h1>
    <h2>Starters</h2>
    {starters}
    <h2>Mains</h2>
    {main}
    <h2>Deserts</h2>
    {desserts}
    <h2>Drinks</h2>
    {drinks}
  </div>
}

export default ViewMenu