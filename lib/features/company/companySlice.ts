import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Company, Employee, Position, Role, Team } from '@/types';

const addTeamChild = (
    tree: Company,
    role: Role,
    team: Team['id'],
    employee: Employee | null = null,
    positionId?: Position['id']
) => {
    const id = uuidv4();
    tree.positions[id] = {
        id,
        role,
        roleFor: 'team',
        parent: positionId ?? null,
        children: [],
        employee,
        team,
    };
    if (positionId) {
        tree.positions[positionId].children.push(id);
    }
    return tree.positions[id];
};

const initialState: Company = {
    positions: {
        root: {
            id: 'root',
            role: 'ceo',
            roleFor: 'company',
            parent: null,
            children: ['1', '2', '3'],
            employee: {
                name: 'Beckham Yoder',
                phone: '',
                email: '',
            },
        },
        '1': {
            id: '1',
            role: 'head',
            roleFor: 'engineering',
            parent: 'root',
            children: [],
            employee: {
                name: 'Robin Ryan',
                phone: '',
                email: '',
            },
        },
        '2': {
            id: '2',
            role: 'head',
            roleFor: 'design',
            parent: 'root',
            children: [],
            employee: {
                name: 'Eden Marsh',
                phone: '',
                email: '',
            },
        },
        '3': {
            id: '3',
            role: 'head',
            roleFor: 'hr',
            parent: 'root',
            children: [],
            employee: {
                name: 'Kaia Rose',
                phone: '',
                email: '',
            },
        },
    },
    teams: {},
};

export interface PromotePayload {
    position: Position;
    parentId: Position['id'];
}

export interface AddNewTeamPayload {
    teamName: Position['id'];
    headPositionId: Position['id'];
}

export interface EditTeamPayload {
    position: Position;
    teamName: string;
}

export interface ChangeTeamPayload {
    position: Position;
    teamId: Team['id'];
}

export interface UpdateEmployeePayload {
    positionId: Position['id'];
    employee: Employee;
}

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        promote: (state, action: PayloadAction<PromotePayload>) => {
            const { parentId, position } = action.payload;
            state.positions[parentId].employee = position.employee;
            state.positions[position.id].employee = null;
        },
        addNewTeam: (state, action: PayloadAction<AddNewTeamPayload>) => {
            const { teamName, headPositionId } = action.payload;
            const teamId = uuidv4();
            state.teams[teamId] = {
                id: teamId,
                name: teamName,
            };
            const leader = addTeamChild(
                state,
                'leader',
                teamId,
                null,
                headPositionId
            );
            addTeamChild(state, 'member', teamId, null, leader.id);
        },
        editTeam: (state, action: PayloadAction<EditTeamPayload>) => {
            const { position, teamName } = action.payload;
            if (!position.team) {
                return;
            }
            state.teams[position.team].name = teamName;
        },
        addTeamMember: (state, action: PayloadAction<Position>) => {
            const position = action.payload;
            addTeamChild(state, 'member', position.team!, null, position.id);
        },
        removeTeamMember: (state, action: PayloadAction<Position>) => {
            const position = action.payload;
            if (!position.parent) {
                return;
            }

            const teamLead = state.positions[position.parent];
            if (teamLead.children.length < 2) {
                addTeamChild(state, 'member', position.team!, null, teamLead.id);
            }

            state.positions[teamLead.id].children = teamLead.children.filter(
                (id) => id !== position.id
            );
            delete state.positions[position.id];
        },
        changeTeam: (state, action: PayloadAction<ChangeTeamPayload>) => {
            const { position, teamId } = action.payload;
            if (!position.parent) {
                return;
            }
            const parent = state.positions[position.parent];
            if (!parent || !parent.parent) {
                return;
            }

            const oldTeamLead = state.positions[position.parent];
            if (oldTeamLead.children.length < 2) {
                addTeamChild(state, 'member', position.team!, null, oldTeamLead.id);
            }

            const grandParent = state.positions[parent.parent];
            const newTeamLead = grandParent.children
                .map((child) => state.positions[child])
                .find(({ team }) => team === teamId);
            if (!newTeamLead) {
                return;
            }

            const { employee } = position;
            state.positions[position.parent].children = oldTeamLead.children.filter(
                (id) => id !== position.id
            );
            delete state.positions[position.id];
            addTeamChild(state, 'member', teamId, employee, newTeamLead.id);
        },
        updateEmployee: (state, action: PayloadAction<UpdateEmployeePayload>) => {
            const { positionId, employee } = action.payload;
            state.positions[positionId].employee = employee;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateEmployee,
    promote,
    addNewTeam,
    editTeam,
    addTeamMember,
    removeTeamMember,
    changeTeam,
} = companySlice.actions;
const companyReducer = companySlice.reducer;
export default companyReducer;
