import { cx } from '@/lib/cx';
import { bigbase64 } from '@/public/mock/bigBase64';
import { formatAddress } from '@/utils/formatter';
import React from 'react'

export type CardProps = {
    description: string
    name: string;
    path: string;
    createdAt?: string
    owner?: string

}

const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })

export const Card = ({ path, name, owner, description, createdAt, ...imgProps }: CardProps & React.ComponentProps<'img'>) => {
    const isMinted = Boolean(createdAt)
    return (

        <div className="w-[250px] bg-white border border-gray-200 rounded-lg shadow-2xl ">
            <img className="rounded-t-lg" src={ path } alt={ description } height={ 250 } width={ 250 } { ...imgProps } />
            <div className={ cx("p-3 break-words flex flex-col justify-between", isMinted ? 'h-[150px]' : 'h-[120px]') }>
                <p className="line-clamp-1 text-xl font-bold tracking-tight text-gray-900" title={ name }>{ name }</p>
                <p className="line-clamp-2 font-normal text-gray-700 leading-5 pb-2 overflow-hidden" title={ description }> { description }</p>

                { isMinted && <>
                    <div className='flex flex-row justify-between text-xs text-gray-400' >
                        <p title={ owner }>Owner: { formatAddress(owner as string) }</p>
                        <p title={ createdAt }>Created at { formatter.format(new Date(createdAt as string)) }</p>
                    </div>
                </> }
            </div>
        </div>

    )

}
