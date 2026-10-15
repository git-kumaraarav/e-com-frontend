import { API_URL } from "./vars";

export const FetchAPI = async <T,>(trailingURL: string): Promise<T> => {

    if (!API_URL){
        throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }

    const url = new URL(API_URL + trailingURL);

    const res = await fetch(url, {
        next: {revalidate: 60} // Options: 'force-cache' (static), 'no-store' (dynamic), or next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    const result: T = await res.json();

    return result; 
}