import CartView from '@/components/CartView';
import {cn} from '@/lib/utils';
import React from 'react';

const CartPage= ({className, children}:{className?: string, children?: React.ReactNode}) => {
    
    return (
        <CartView></CartView>
    ) 
}
export default CartPage;