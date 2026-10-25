import CartView from '@/components/CartView';
import WishlistView from '@/components/WishlistView';
import {cn} from '@/lib/utils';
import React from 'react';

const CartPage= ({className, children}:{className?: string, children?: React.ReactNode}) => {
    
    return (
        <div className={cn("flex flex-col gap-10 ", className)}>
            <CartView></CartView>
            <div className="">
                <h2 className={cn("text-2xl font-bold tracking-tight", className)}>
                    Add from wishlist
                </h2>
                <div>
                    <WishlistView></WishlistView>
                </div>
            </div>
        </div>

    ) 
}
export default CartPage;