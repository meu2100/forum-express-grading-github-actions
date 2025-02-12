const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      console.log(data)
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true
    }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant not found')
      restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    }).catch(err => next(err))
  },
  getRestaurantDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant not found')
      return res.render('dashboards', { restaurant })
    }).catch(err => next(err))
  }
}
module.exports = restaurantController
