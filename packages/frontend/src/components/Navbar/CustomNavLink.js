import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default function CustomNavLink({ label, to , activeOnlyWhenExact }) {
    return (
        <Route path={ to } exact={ activeOnlyWhenExact } children={({ match })=>{
            var active = match ? true : false;
            return (
                <Nav.Link as={ Link } to={ to } active={active}>{ label }</Nav.Link>
            )
        }} />
    )
}
