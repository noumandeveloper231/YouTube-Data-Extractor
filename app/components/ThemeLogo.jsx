'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'

const ThemeLogo = () => {
    const { theme } = useTheme();
    return (
        <Link href={'/'}>
            <div className="relative w-40 md:w-52 h-9">
                <Image
                    src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                    alt="Logo"
                    fill
                    className="object-contain"
                />
            </div>
        </Link>
    )
}

export default ThemeLogo