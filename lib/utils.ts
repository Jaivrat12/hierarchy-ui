import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Company, Position, PositionFor, Role, Team } from '@/types';

export const roles: Record<Role, string> = {
    ceo: 'CEO',
    head: 'Head',
    leader: 'Team Leader',
    member: 'Team Member',
};

export const roleToColor: Record<Role, string> = {
    ceo: 'bg-violet-700',
    head: 'bg-rose-700',
    leader: 'bg-yellow-700',
    member: 'bg-teal-700',
};

export const rolesFor: Record<PositionFor, string> = {
    company: 'Company',
    engineering: 'Engineering',
    design: 'Design',
    hr: 'HR',
    team: 'Team',
};

export function createQueryString(
    searchParams: string,
    pathname: string,
    query: Record<string, string>
) {
    const params = new URLSearchParams(searchParams);
    Object.entries(query).forEach(([name, value]) => {
        params.set(name, value);
    });
    return pathname + '?' + params.toString();
}

export function removeSearchParam(
    searchParams: string,
    pathname: string,
    names: string[],
    router: AppRouterInstance
) {
    const params = new URLSearchParams(searchParams.toString());
    names.forEach((name) => params.delete(name));
    router.replace(`${pathname}?${params}`);
}

export function getDescendants(
    position: Position,
    positions: Company['positions']
): Position[] {
    return position.children.flatMap((child) => {
        const childPosition = positions[child];
        return [childPosition, ...getDescendants(childPosition, positions)];
    });
}

export function formatDesignation(position: Position, team?: Team): string {
    return (
        `${roles[position.role]} of ` +
        (position.roleFor !== 'team'
            ? rolesFor[position.roleFor]
            : team!.name)
    );
}
