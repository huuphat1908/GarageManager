import React from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import Header from '../../components/Header/Header';
import ReceivingCar from '../CarManager/ReceivingPage/ReceivingPage';
import CreataRepairVotesPage from '../CarManager/CreateRepairVotesPage/CreateRepairVotesPage';
import CarLookup from '../CarManager/Lookup/Lookup';
import CarBrandList from '../CarManager/CarBrandList/CarBrandList';
import CollectMoney from '../CollectMoney/CollectMoney';
import MonthlySalesReport from '../MonthlySalesReport/MonthlySalesReport';
import MonthlyInventoryReport from '../MonthlyInventoryReport/MonthlyInventoryReport';
import ImportAccessories from '../Accessory/ImportAccessories/ImportAccessories';
import AccessoryLookup from '../Accessory/Lookup/Lookup';
import WageLookup from '../Wage/Lookup/Lookup';
import ManagerAccessoryList from '../Accessory/ManagerList/ManagerList';
import ManagerWageList from '../Wage/ManagerList/ManagerList';
import Setting from '../Setting/Setting';
import ChangePassword from '../ChangePassword/ChangePassword';
import Logout from '../Logout/Logout';
import NotFound from '../NotFound/NotFound';

export default function Home() {
    return (
        <Router>
            <Header/>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/quan-ly-xe/tiep-nhan-xe" />
                    </Route>
                    <Route path="/quan-ly-xe/tiep-nhan-xe" component={ReceivingCar} />
                    <Route path="/quan-ly-xe/lap-phieu-sua-chua" component={CreataRepairVotesPage} />
                    <Route path="/quan-ly-xe/danh-sach-hieu-xe" component={CarBrandList} />
                    <Route path="/quan-ly-xe/tra-cuu-xe" component={CarLookup} />
                    <Route path="/thu-tien" component={CollectMoney} />
                    <Route path="/lap-bao-cao/doanh-thu-thang" component={MonthlySalesReport} />
                    <Route path="/lap-bao-cao/ton-phu-tung" component={MonthlyInventoryReport} />
                    <Route path="/quan-ly-phu-tung/nhap-phu-tung" component={ImportAccessories} />
                    <Route path="/quan-ly-phu-tung/tra-cuu" component={AccessoryLookup} />
                    <Route path="/quan-ly-phu-tung/tien-cong" component={WageLookup} />
                    <Route path="/quan-ly-phu-tung/danh-sach-phu-tung" component={ManagerAccessoryList} />
                    <Route path="/quan-ly-phu-tung/danh-sach-tien-cong" component={ManagerWageList} />
                    <Route path="/cai-dat" component={Setting} />
                    <Route path="/dang-xuat" component={Logout} />
                    <Route path="/doi-mat-khau" component={ChangePassword} />
                    <Route component={NotFound} />
                </Switch>
            {/* <Footer/> */}
        </Router>
    )
}
