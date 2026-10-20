import OrderDraftController from './OrderDraftController'
import OrderController from './OrderController'
import ReviewController from './ReviewController'
import NotificationController from './NotificationController'
const Customer = {
    OrderDraftController: Object.assign(OrderDraftController, OrderDraftController),
OrderController: Object.assign(OrderController, OrderController),
ReviewController: Object.assign(ReviewController, ReviewController),
NotificationController: Object.assign(NotificationController, NotificationController),
}

export default Customer