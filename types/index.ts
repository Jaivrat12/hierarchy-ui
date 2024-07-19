export type Role = 'ceo' | 'head' | 'leader' | 'member';
export type PositionFor = 'company' | 'engineering' | 'hr' | 'design' | 'team';

export interface Position {
    id: string;
    role: Role;
    roleFor: PositionFor;
    parent: Position['id'] | null;
    children: Position['id'][];
    employee: Employee | null;
    team?: Team['id'];
}

export interface Employee {
    name: string;
    phone: string;
    email: string;
}

export interface Team {
    id: string;
    name: string;
}

export interface Company {
    positions: Record<Position['id'], Position>;
    teams: Record<Team['id'], Team>;
}
