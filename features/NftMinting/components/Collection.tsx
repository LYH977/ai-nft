import { Card, CardProps } from '@/components/Card';
import { Spinner } from '@/icons/Spinner';

type CollectionProps = {
    ownerAddress: string;
    collection: CardProps[]
    isFetchingNft: boolean
}

export const Collection = ({ ownerAddress, collection, isFetchingNft }: CollectionProps) => {
    const shouldShowCollection = !ownerAddress
    const message = <strong className='text-red-600'><span aria-hidden>**</span>You need to connect to crypto wallet to view NFTs.<span aria-hidden>**</span></strong>

    const collectionMarkup = isFetchingNft ? Spinner : collection.map((nft: CardProps) => (<Card key={ nft.path } { ...nft } />)
    )
    return (
        <section className='p-4 flex flex-col justify-center items-center' aria-labelledby='nft-collection'>
            <h2 id='nft-collection' className='text-4xl font-extrabold'>NFT collections</h2>
            <div className='mt-4 flex flex-row justify-center items-center flex-wrap gap-16'>
                { shouldShowCollection
                    ? message
                    : collectionMarkup }
            </div>
        </section>
    )
}
