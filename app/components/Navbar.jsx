import React from 'react'
import ThemeLogo from './ThemeLogo'
import ThemeToggle from './ToggleDarkMode'

const Navbar = () => {
    return (
        <nav className='max-w-6xl mx-auto flex items-center justify-between py-4'>
            <ThemeLogo />
            <div className='flex items-center gap-2'>
                <ThemeToggle />
            </div>
        </nav>
    )
}

export default Navbar