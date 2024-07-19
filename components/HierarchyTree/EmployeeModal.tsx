import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
} from '@nextui-org/react';
import { FormModal } from '../Common/FormModal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    addTeamMember,
    changeTeam,
    promote,
    removeTeamMember,
    updateEmployee,
} from '@/lib/features/company/companySlice';
import {
    createQueryString,
    removeSearchParam,
    roles,
    rolesFor,
} from '@/lib/utils';
import { Position } from '@/types';

type EmployeeModalProps = {
    position: Position;
};

export const EmployeeModal = ({ position }: EmployeeModalProps) => {
    const { positions, teams } = useAppSelector((state) => state.company);
    const dispatch = useAppDispatch();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getParent = (position?: Position) => {
        if (position && position.parent !== null) {
            return positions[position.parent];
        }
    };
    const parent = getParent(position);
    const grandParent = getParent(parent);

    const childTeams = useMemo(
        () =>
            position.role === 'member'
                ? grandParent!.children
                    .map((child) => teams[positions[child].team!])
                    .filter((team) => team.id !== position.team)
                : [],
        [grandParent, position.role, position.team, positions, teams]
    );

    return (
        <FormModal
            title="Employee Details"
            isOpen
            action={(formData, onClose) => {
                dispatch(
                    updateEmployee({
                        positionId: position.id,
                        employee: {
                            name: formData.get('name') as string,
                            phone: formData.get('phone') as string,
                            email: formData.get('email') as string,
                        },
                    })
                );
                onClose();
            }}
            submitButtonText="Save"
            onClose={() => {
                removeSearchParam(
                    searchParams.toString(),
                    pathname,
                    ['edit', 'id'],
                    router
                );
            }}
        >
            {(onClose) => (
                <>
                    {roles[position.role]} of{' '}
                    {position.roleFor !== 'team'
                        ? rolesFor[position.roleFor]
                        : teams[position.team!].name}

                    <Input
                        autoFocus
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        defaultValue={position.employee?.name}
                        variant="bordered"
                        isRequired
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        placeholder="Enter Phone"
                        defaultValue={position.employee?.phone}
                        variant="bordered"
                    />
                    <Input
                        label="Email"
                        name="email"
                        placeholder="Enter Email"
                        defaultValue={position.employee?.email}
                        variant="bordered"
                    />

                    {position.parent !== null && position.employee !== null && (
                        <Button
                            onClick={() => {
                                dispatch(
                                    promote({
                                        position: position,
                                        parentId: position.parent!,
                                    })
                                );
                                onClose();
                            }}
                        >
                            Promote to {roles[positions[position.parent].role]}
                        </Button>
                    )}

                    {position.role === 'head' && (
                        <>
                            <Button
                                as={Link}
                                href={createQueryString(
                                    searchParams.toString(),
                                    pathname,
                                    {
                                        create: 'team',
                                        id: position.id,
                                    }
                                )}
                            >
                                Add New Team
                            </Button>
                        </>
                    )}

                    {position.role === 'leader' && (
                        <>
                            <Button
                                as={Link}
                                href={createQueryString(
                                    searchParams.toString(),
                                    pathname,
                                    {
                                        edit: 'team',
                                        id: position.team!,
                                    }
                                )}
                            >
                                Edit Team
                            </Button>

                            <Button onClick={() => {
                                dispatch(addTeamMember(position));
                                onClose();
                            }}>
                                Add New Member
                            </Button>
                        </>
                    )}

                    {position.role === 'member' && (
                        <>
                            {position.employee !== null && (
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Button>Change Team</Button>
                                    </DropdownTrigger>

                                    <DropdownMenu>
                                        {childTeams.map(({ id, name }) => (
                                            <DropdownItem
                                                key={id}
                                                onClick={() =>
                                                    dispatch(
                                                        changeTeam({
                                                            position: position,
                                                            teamId: id,
                                                        })
                                                    )
                                                }
                                            >
                                                {name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            )}

                            <Button
                                onClick={() => dispatch(removeTeamMember(position))}
                            >
                                Remove Member
                            </Button>
                        </>
                    )}
                </>
            )}
        </FormModal>
    );
};
