import { Company } from '@/types';

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

const KEY = 'redux';
export function loadState(): Company {
    try {
        const serializedState = localStorage.getItem(KEY);
        if (!serializedState) return initialState;
        return JSON.parse(serializedState);
    } catch (e) {
        return initialState;
    }
}

export async function saveState(state: Company) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY, serializedState);
    } catch (e) {
        console.error(e);
    }
}