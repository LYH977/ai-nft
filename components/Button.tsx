import { Spinner } from '@/icons/Spinner'
import { cx } from '@/lib/cx'
import React from 'react'


export const Button = ({ children, className, isLoading, ...props }: React.ComponentProps<'button'> & { className?: string, isLoading?: boolean }) => {
    return (
        <button className={ cx("flex flex-row justify-center items-center gap-2 bg-black enabled:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded disabled:opacity-20 disabled:cursor-not-allowed", className) } { ...props }>
            { children }
            { isLoading && Spinner }
        </button>


    )
}

