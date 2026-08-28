import Link from 'next/link';
import {Button} from '../../components/ui/button';

export default function ForbiddenPage(){
    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">
                   403- Access Forbidden
                </h1>
                <h2 className="mt-4 text-xl font-semibold">
                    You do not have permission to access this page.
                </h2>
                <Button className="mt-6">
                    <Link href="/login" className="text-white">
                        Go to Login First
                    
                    </Link>

                </Button>
                
            </div>

        </main>
    )
}