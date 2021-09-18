import React from 'react';
import { Route } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

export default function CustomDropdownNavLink({ to, title,  activeOnlyWhenExact, menuvariant, children,}) {
    return (
        <Route path={ to } children={({ match })=>{
            return (
                <Route path={ to } exact={ activeOnlyWhenExact } children={({ match })=>{
                    var active = match ? true : false;
                    return (
                        <NavDropdown active={active} title={ title } menuvariant={ menuvariant }>
                            {children}
                        </NavDropdown>
                    )
                }} />
            )
        }} />
    )
};
