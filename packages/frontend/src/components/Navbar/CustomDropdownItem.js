import React from 'react';
import { Route, Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

export default function CustomDropdownItem({ label, to , activeOnlyWhenExact }) {
    

    return (
        <Route path={ to } exact={ activeOnlyWhenExact } children={({ match })=>{
            var active = match ? true : false;
            return (
                <NavDropdown.Item as={ Link } to={to} active={active}>{ label }</NavDropdown.Item>
            )
        }} />
    )
}