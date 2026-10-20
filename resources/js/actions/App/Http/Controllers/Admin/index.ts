import DashboardController from './DashboardController'
import VendorController from './VendorController'
import CategoryController from './CategoryController'
import OrderController from './OrderController'
import ReviewController from './ReviewController'
import UserController from './UserController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
VendorController: Object.assign(VendorController, VendorController),
CategoryController: Object.assign(CategoryController, CategoryController),
OrderController: Object.assign(OrderController, OrderController),
ReviewController: Object.assign(ReviewController, ReviewController),
UserController: Object.assign(UserController, UserController),
}

export default Admin