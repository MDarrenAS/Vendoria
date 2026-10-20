import Public from './Public'
import Customer from './Customer'
import Vendor from './Vendor'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Public: Object.assign(Public, Public),
Customer: Object.assign(Customer, Customer),
Vendor: Object.assign(Vendor, Vendor),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers