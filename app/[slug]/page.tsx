import {cn} from '@/lib/utils';
import React from 'react';
const ListingPage = ({className, children}:{className?: string, children?: React.ReactNode}) => {
return (
<div className={cn('', className)}>{children}</div>
) 
}
export default ListingPage;