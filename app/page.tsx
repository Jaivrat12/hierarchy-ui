'use client';

import { Suspense } from 'react';
import { HierarchyTree } from '@/components/HierarchyTree';
import { SearchBox } from '@/components/SearchBox';
import { useAppSelector } from '@/lib/hooks';

export default function Home() {
    const root = useAppSelector((state) => state.company.positions['root']);
	return (
        <div className="h-[100vh] overflow-x-scroll">
            <div className="mx-auto mt-12 px-4 w-fit">
                <Suspense>
                    <SearchBox
                        className="w-[480px] mb-4"
                    />
                    <HierarchyTree position={root} />
                </Suspense>
            </div>
        </div>
    );
}
