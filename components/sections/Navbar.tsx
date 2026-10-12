import {cn} from '@/lib/utils';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
} from '@/components/ui/navigation-menu';

import i from '@/public/company_info.json'
import { CartonIcon, SettingsIcon, ShoppingCart, UserIcon } from 'lucide-react';
import { Input } from '../ui/input';


const Navbar = ({className, children}:{className?: string, children?: React.ReactNode}) => {
    const loggedIn = false;  

return (
    <div className={cn('sticky top-2 flex justify-between w-full ring-1 p-2 mt-2 rounded-sm gap-3', className)}>
        {/* Logo */}
        <div className="flex justify-start items-center gap-2">
            <img src={i.logo_url} alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-bold">{i.company_name}</span>
        </div>

        {/* Search */}
        <div className="flex items-center justify-center grow">
            <Input  
                type="text"
                placeholder="Search..."
            />
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center justify-end gap-4">
            <NavigationMenu>
                <NavigationMenuList>
                    {loggedIn ? (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <div className="flex items-center">
                                        <UserIcon className="mr-2" size={16} />
                                        Account
                                    </div>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/account">Manage Account</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/settings" className={navigationMenuTriggerStyle()}>
                                    <div className="flex items-center">
                                        <SettingsIcon className="mr-2" size={16} />
                                        Settings
                                    </div>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/wishlist" className={navigationMenuTriggerStyle()}>Wishlist</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/cart" className={navigationMenuTriggerStyle()}>
                                    <ShoppingCart className="mr-2" size={16} />
                                    Cart
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    ) : (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>Register</NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    </div>
    ) 
}
export default Navbar;