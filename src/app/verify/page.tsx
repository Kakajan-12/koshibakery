import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import VerifyClient from '@/components/verify/VerifyClient';

export default function Page() {
    return (
        <Suspense fallback={
            <div className="mt-24 my-container mx-auto" aria-busy="true" aria-label="Verifying email">
                <div className="container mx-auto px-4 pt-6 pb-16">
                    <div className="mx-auto max-w-2xl rounded-3xl main-block-color px-6 py-16 flex flex-col items-center gap-5">
                        <Skeleton className="h-20 w-20 rounded-full"/>
                        <Skeleton className="h-8 w-72 max-w-full"/>
                    </div>
                </div>
            </div>
        }>
            <VerifyClient />
        </Suspense>
    );
}
