import { Picture } from "@/icons/Picture";

export const Placeholder = <div className="w-[250px] bg-white border border-gray-200 rounded-lg shadow-2xl ">
    <div className='h-[250px] w-[250px] bg-gray-300 items-center justify-center flex'>
        { Picture }
    </div>
    <div className={ "p-3 flex flex-col h-[120px]" }>
        <div className="h-4 bg-gray-300 rounded-full mb-6"></div>
        <div className="h-2 bg-gray-300 rounded-full mb-3"></div>
        <div className="h-2 bg-gray-300 rounded-full mb-3"></div>
        <div className="h-2 bg-gray-300 rounded-full"></div>
    </div>
</div>