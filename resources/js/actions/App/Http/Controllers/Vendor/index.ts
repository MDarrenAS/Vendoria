import OnboardingController from './OnboardingController'
import DashboardController from './DashboardController'
import ProfileController from './ProfileController'
import OrderController from './OrderController'
import ReviewController from './ReviewController'
import ServiceController from './ServiceController'
import AvailabilityController from './AvailabilityController'
const Vendor = {
    OnboardingController: Object.assign(OnboardingController, OnboardingController),
DashboardController: Object.assign(DashboardController, DashboardController),
ProfileController: Object.assign(ProfileController, ProfileController),
OrderController: Object.assign(OrderController, OrderController),
ReviewController: Object.assign(ReviewController, ReviewController),
ServiceController: Object.assign(ServiceController, ServiceController),
AvailabilityController: Object.assign(AvailabilityController, AvailabilityController),
}

export default Vendor