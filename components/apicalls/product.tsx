import {cn} from '@/lib/utils';
import React from 'react';

const ProductContainer = ({ className, children }:{ className?: string, children?: React.ReactNode }) => {
    return (
        <div className={cn('', className)}>{children}</div>
    ) 
}

export default ProductContainer;