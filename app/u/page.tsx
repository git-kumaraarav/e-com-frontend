import {cn} from '@/lib/utils';
import React from 'react';
const itemSlugView = ({className, children}:{className?: string, children?: React.ReactNode}) => {
    return (
        <div className={cn('', className)}>
            <h1>Item Page</h1>
            {children}</div>
    ) 
}
export default itemSlugView;