import { Loader2 } from 'lucide-react';

export default function Loader() {
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <Loader2 className='animate-spin w-14 h-14' />
        </div>
    );
}