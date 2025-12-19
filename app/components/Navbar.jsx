import React from 'react'
import ThemeLogo from './ThemeLogo'
import ThemeToggle from './ToggleDarkMode'

const Navbar = () => {
    return (
        <nav className='max-w-7xl mx-auto flex flex-wrap items-center justify-between py-4'>
            <div className='px-3'>
                <ThemeLogo />
            </div>
            <div className="order-2 md:order-0 mt-4 md:mt-0 text-center text-xl text-white bg-yellow-500/20 px-4 py-1 rounded-md border border-yellow-500/50">
                🧪 Public testing — feedback welcome
            </div>
            <div className='px-3 justify-center flex items-center gap-2'>
                <ThemeToggle />
            </div>
        </nav>
    )
}

export default Navbar