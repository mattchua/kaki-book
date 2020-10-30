import React from 'react'
import { Link } from 'react-router-dom'

function NavigationBar ()
{
    return (
        <div className='topNav'>
            <Link to="/">KakiBook</Link>
            <Link to="/users">Users</Link>
        </div>
    )
}

export default NavigationBar