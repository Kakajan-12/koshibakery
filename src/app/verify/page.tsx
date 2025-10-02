import { Suspense } from 'react';
import VerifyClient from '@/components/verify/VerifyClient';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyClient />
        </Suspense>
    );
}
