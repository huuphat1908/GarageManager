const CarBrandRouter = require('./CarBrand');
const CarRouter = require('./Car');
const AccessoryRouter = require('./Accessory');
const ReceivingFormRouter = require('./ReceivingForm');
const WageRouter = require('./Wage');
const RepairVoteRouter = require('./RepairVote');
const CustomerRouter = require('./Customer');
const AccountRouter = require('./Account');
const ParameterRouter = require('./Parameter');
const BillRouter = require('./Bill');
const AccessoryImportFormRouter = require('./AccessoryImportForm');
const SaleRouter = require('./Sale');
const InventoryReportRouter = require('./InventoryReport');

const { checkAuthentication, checkAdmin } = require('../middlewares/authentication');

module.exports = function(app) {
  app.use('/api/car-brands', checkAuthentication, CarBrandRouter);
  app.use('/api/cars', checkAuthentication, CarRouter);
  app.use('/api/receiving-forms', checkAuthentication, ReceivingFormRouter);
  app.use('/api/wages', checkAuthentication, WageRouter);
  app.use('/api/repair-votes', checkAuthentication, RepairVoteRouter);
  app.use('/api/customers', checkAuthentication, CustomerRouter);
  app.use('/api/accounts', AccountRouter);
  app.use('/api/parameters', checkAuthentication, ParameterRouter);
  app.use('/api/bills', checkAuthentication, BillRouter);
  app.use('/api/accessories', checkAuthentication, AccessoryRouter);
  app.use('/api/accessory-import-forms', checkAuthentication, checkAdmin, AccessoryImportFormRouter);
  app.use('/api/sales', checkAuthentication, checkAdmin, SaleRouter);
  app.use('/api/inventory-reports', checkAuthentication, checkAdmin, InventoryReportRouter);
}