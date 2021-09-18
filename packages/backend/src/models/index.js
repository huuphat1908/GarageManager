const mongoose = require('mongoose');
const dbConfig = require('../configs/database.config');

const { initCustomer } = require('./Customer');
const { initCar } = require('./Car');
const { initCarBrand } = require('./CarBrand');
const { initReceivingForm } = require('./ReceivingForm');
const { initAccessory } = require('./Accessory');
const { initAccessoryImportForm } = require('./AccessoryImportForm');
const { initWage } = require('./Wage');
const { initRepairVoteDetail } = require('./RepairVoteDetail');
const { initRepairVote } = require('./RepairVote');
const { initBill } = require('./Bill');
const { initSale } = require('./Sale');
const { initSaleDetail } = require('./SaleDetail');
const { initAccount } = require('./Account');
const { initInventoryReport } = require('./InventoryReport');
const { initInventoryReportDetail } = require('./InventoryReportDetail');
const { initParameter } = require('./Parameter');
const { initSession } = require('./Session');

const db = {};

// Init mongoose and database URL
db.mongoose = mongoose;
db.url = dbConfig.URL;

// Init Models
db.Customer = initCustomer(mongoose);
db.Car = initCar(mongoose);
db.CarBrand = initCarBrand(mongoose);
db.ReceivingForm = initReceivingForm(mongoose);
db.Accessory = initAccessory(mongoose);
db.AccessoryImportForm = initAccessoryImportForm(mongoose);
db.Wage = initWage(mongoose);
db.RepairVote = initRepairVote(mongoose);
db.RepairVoteDetail = initRepairVoteDetail(mongoose);
db.Bill = initBill(mongoose);
db.Sale = initSale(mongoose);
db.SaleDetail = initSaleDetail(mongoose);
db.Account = initAccount(mongoose);
db.InventoryReport = initInventoryReport(mongoose);
db.InventoryReportDetail = initInventoryReportDetail(mongoose);
db.Parameter = initParameter(mongoose);
db.Session = initSession(mongoose);

module.exports = db;