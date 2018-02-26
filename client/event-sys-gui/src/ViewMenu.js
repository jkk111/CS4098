import React from 'react'

let ViewMenu = ({ name = '', starters = [], mains = [], desserts = [], drinks = [] }) => {
  starters = starters.map((starter, i) => {
    return <div key={i}>
      {starter.name} {starter.description} {starter.allergens}
    </div>
  })
  mains = mains.map((main, i) => {
    return <div key={i}>
      {main.name} {main.description} {main.allergens}
    </div>
  })
  desserts = desserts.map((dessert, i) => {
    return <div key={i}>
      {dessert.name} {dessert.description} {dessert.allergens}
    </div>
  })
  drinks = drinks.map((drink, i) => {
    return <div key={i}>
      {drink.name} {drink.description} {drink.allergens}
    </div>
  })
  return <div>
    <h1>{name}</h1>
    <h2>Starters</h2>
    {starters}
    <h2>Mains</h2>
    {mains}
    <h2>Deserts</h2>
    {desserts}
    <h2>Drinks</h2>
    {drinks}
  </div>
}

export default ViewMenu