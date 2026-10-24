import WishlistView from '@/components/WishlistView';
import {cn} from '@/lib/utils';
import React from 'react';


const WishlistPage = ({className, children}:{className?: string, children?: React.ReactNode}) => {
    return (
        <WishlistView></WishlistView>
    ) 
}
export default WishlistPage;