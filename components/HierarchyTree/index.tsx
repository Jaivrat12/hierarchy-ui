'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeModal } from './EmployeeModal';
import { TeamModal } from './TeamModal';
import { useAppSelector } from '@/lib/hooks';
import {
    createQueryString,
    formatDesignation,
    roleToColor,
} from '@/lib/utils';
import { Position } from '@/types';

type TreeProps = {
    position: Position;
};

export const HierarchyTree = ({ position }: TreeProps) => {
    const { positions, teams } = useAppSelector((state) => state.company);
    const children = position.children.map((id) => positions[id]);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <div>
            {searchParams.get('edit') === 'employee' &&
                searchParams.get('id') === position.id && (
                    <EmployeeModal position={position} />
                )}

            {((searchParams.get('create') === 'team' &&
                searchParams.get('id') === position.id) ||
                (searchParams.get('edit') === 'team' &&
                    searchParams.get('id') === position.team)) && (
                        <TeamModal position={position} />
            )}

            <EmployeeCard
                name={position.employee?.name ?? '<Empty Position>'}
                designation={formatDesignation(position, position.team ? teams[position.team] : undefined)}
                className={roleToColor[position.role]}
                as={Link}
                href={createQueryString(searchParams.toString(), pathname, {
                    edit: 'employee',
                    id: position.id,
                })}
                isPressable
            />

            {/* Recursion */}
            <div className="mt-2 flex gap-2">
                {children.map((childPosition) => (
                    <HierarchyTree
                        key={childPosition.id}
                        position={childPosition}
                    />
                ))}
            </div>
        </div>
    );
};
