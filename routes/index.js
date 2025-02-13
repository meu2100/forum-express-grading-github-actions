const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// ✅ 確保 `/admin` 內部的路由順序正確
router.use('/admin', authenticatedAdmin, admin)

// ✅ 使用者註冊 & 登入
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

// ✅ 使用者相關
router.get('/users/topUsers', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  userController.putUser
)

// ✅ 餐廳相關
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restController.getRestaurantDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

// ✅ 評論相關
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// ✅ 收藏 & 按讚
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// ✅ 追蹤 & 取消追蹤
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// ✅ 這條應該放在錯誤處理 middleware **之前**
router.use('/', (req, res) => res.redirect('/restaurants'))

// ✅ 錯誤處理放在最後
router.use(generalErrorHandler)

module.exports = router
