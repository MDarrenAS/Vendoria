import HomeController from './HomeController'
import VendorSearchController from './VendorSearchController'
import VendorController from './VendorController'
import ServiceController from './ServiceController'
const Public = {
    HomeController: Object.assign(HomeController, HomeController),
VendorSearchController: Object.assign(VendorSearchController, VendorSearchController),
VendorController: Object.assign(VendorController, VendorController),
ServiceController: Object.assign(ServiceController, ServiceController),
}

export default Public