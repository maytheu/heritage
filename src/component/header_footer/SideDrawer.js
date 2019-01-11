import React from 'react';
import { NavLink } from 'react-router-dom'

const SideDrawer = (props) => {
    let attachedCSS = ["sideDrawer", "close"]
    if(props.show){
        attachedCSS = ["sideDrawer", "open"]
    }
    return (
        <div className={attachedCSS.join(' ')}>
            <div onClick={props.closed}>
            <nav>
<ul className='navigationItems'>
<li className='link'><NavLink to='steps' exact activeClassName="active">Steps To Salvation</NavLink></li>
<li className='link'><NavLink to='lessons' exact activeClassName="active">Sunday School Lessons</NavLink></li>
<li className='link'><NavLink to='cgs'  exact activeClassName="active">Cgs</NavLink></li>


</ul>
            </nav>
            </div>
        </div>
    );
};

export default SideDrawer;