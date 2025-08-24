import React from 'react'
import Link from 'next/link'

/**
 * Renders a responsive Header component.
 * This header is designed to be placed at the top of the layout.
 */
const Header: React.FC = () => {
  return (
    <header className="bg-dark text-light p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold text-primary mb-2 md:mb-0">
          Admin Panel
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="text-light hover:text-link-hover"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/users" className="text-light hover:text-link-hover">
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="text-light hover:text-link-hover"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link href="/logout" className="text-light hover:text-link-hover">
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
