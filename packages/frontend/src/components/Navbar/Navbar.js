import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import CustomNavLink from './CustomNavLink';
import CustomDropdownNavLink from './CustomDropdownNavLink';
import CustomDropdownItem from './CustomDropdownItem';
import './Navbar.css'

export default function CustomNavbar() {
  let username = sessionStorage.getItem('username');

  const displayUsername = () => {
    return(
      <span>
        <i className="fa fa-user-circle mr-2" aria-hidden="true"></i>
        {username}
      </span>
    )
  }

  const displayCreateReportOnlyAdmin = () => {
    if(sessionStorage.getItem('role') === 'Admin') {
      return (
        <CustomDropdownNavLink to="/lap-bao-cao" activeOnlyWhenExact={true} title={"Lập báo cáo"}  menuvariant="dark">    
            <CustomDropdownItem to="/lap-bao-cao/ton-phu-tung" activeOnlyWhenExact={true} label={"Lập báo cáo tồn phụ tùng"} />
            <CustomDropdownItem to="/lap-bao-cao/doanh-thu-thang" activeOnlyWhenExact={true} label={"Lập báo cáo doanh thu tháng"} />
        </CustomDropdownNavLink>
      )
    }
  }

  const displayAccessoriesOnlyAdmin = () => {
    if(sessionStorage.getItem('role')  === 'Admin') {
      return (
        <>
          <CustomDropdownItem to="/quan-ly-phu-tung/nhap-phu-tung" activeOnlyWhenExact={true} label={"Nhập vật tư phụ tùng"} />
        </>
      )
    }
  }

  const displaySettingOnlyAdmin = () => {
    if(sessionStorage.getItem('role')  === 'Admin') {
      return (
        <CustomNavLink to="/cai-dat" activeOnlyWhenExact={true} label={"Cài đặt"} />
      )
    }
  }

  const displayCarBrandOnlyAdmin = () => {
    if(sessionStorage.getItem('role') === 'Admin') {
      return (
        <CustomDropdownItem to="/quan-ly-xe/danh-sach-hieu-xe" activeOnlyWhenExact={false} label={"Danh sách hiệu xe"} />
      )
    }
  }


  return (
    <Navbar className="navbar--custom" variant="dark" bg="dark" expand="lg">
  <Container>
    <Navbar.Toggle aria-controls="navbar-dark-example" />
    <Navbar.Collapse id="navbar-dark-example">
      <Nav className="nav--collapse">
        <CustomDropdownNavLink to="/quan-ly-xe" activeOnlyWhenExact={false} title="Quản lý xe" menuvariant="dark">
          <CustomDropdownItem to="/quan-ly-xe/tiep-nhan-xe" activeOnlyWhenExact={false} label="Tiếp nhận xe" />
          <CustomDropdownItem to="/quan-ly-xe/lap-phieu-sua-chua" activeOnlyWhenExact={false} label={"Lập phiếu sửa chữa"} />
          <CustomDropdownItem to="/quan-ly-xe/tra-cuu-xe" activeOnlyWhenExact={false} label={"Tra cứu xe"} />
          { displayCarBrandOnlyAdmin() }
        </CustomDropdownNavLink>

        <CustomNavLink to="/thu-tien" activeOnlyWhenExact={false} label={"Thu tiền"} />

        <CustomDropdownNavLink to="/quan-ly-phu-tung" activeOnlyWhenExact={false} title="Quản lý phụ tùng" menuvariant="dark">
           {displayAccessoriesOnlyAdmin() }
          <CustomDropdownItem to="/quan-ly-phu-tung/danh-sach-phu-tung" activeOnlyWhenExact={true} label={"Danh sách phụ tùng"} />
          <CustomDropdownItem to="/quan-ly-phu-tung/danh-sach-tien-cong" activeOnlyWhenExact={true} label={"Danh sách tiền công"} />
        </CustomDropdownNavLink>

        { displayCreateReportOnlyAdmin() }

        { displaySettingOnlyAdmin() }

      </Nav>
      <Nav className="ml-auto">
      <CustomDropdownNavLink to="/tai-khoan" activeOnlyWhenExact={true} title={displayUsername()} menuvariant="dark"> 
        <CustomDropdownItem to="/doi-mat-khau" activeOnlyWhenExact={true} label={"Đổi mật khẩu"} />
        <CustomDropdownItem to="/dang-xuat" activeOnlyWhenExact={true} label={"Đăng xuất"} />
      </CustomDropdownNavLink>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
  )
}
