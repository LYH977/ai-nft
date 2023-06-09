import { cx } from '@/lib/cx';
import { formatAddress } from '@/utils/formatter';

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
            <div className={ cx("p-3 break-words flex flex-col", isMinted ? 'h-[150px]' : 'h-[120px]') }>
                <p className="line-clamp-1 text-xl font-bold tracking-tight text-gray-900 mb-2" title={ name }>{ name }</p>
                <p className="line-clamp-2 font-normal text-gray-700 leading-5 overflow-hidden pb-1" title={ description }> { description }  </p>

                { isMinted && <>
                    <div className='flex flex-row justify-between text-xs text-gray-400 mt-auto' >
                        <p title={ owner }>{ formatAddress(owner as string) }</p>
                        <p title={ createdAt }>{ formatter.format(new Date(createdAt as string)) }</p>
                    </div>
                </> }
            </div>
        </div>

    )

}
