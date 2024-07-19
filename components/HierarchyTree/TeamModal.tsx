import { FormModal } from '../Common/FormModal';
import { Position } from '@/types';
import { removeSearchParam } from '@/lib/utils';
import { Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addNewTeam, editTeam } from '@/lib/features/company/companySlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

type TeamModalProps = {
    position: Position;
};

export const TeamModal = ({ position }: TeamModalProps) => {
    const { teams } = useAppSelector((state) => state.company);
    const dispatch = useAppDispatch();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <FormModal
            title={
                (searchParams.get('create') === 'team' ? 'Create' : 'Edit') +
                ' Team'
            }
            isOpen
            action={(formData, onClose) => {
                const name = formData.get('name') as string;
                if (!position.team) {
                    dispatch(addNewTeam({
                        teamName: name,
                        headPositionId: position.id,
                    }));
                } else {
                    dispatch(editTeam({
                        teamName: name,
                        position,
                    }));
                }
                onClose();
            }}
            submitButtonText="Save"
            onClose={() =>
                removeSearchParam(
                    searchParams.toString(),
                    pathname,
                    ['create', 'edit', 'id'],
                    router
                )
            }
        >
            {() => (
                <Input
                    autoFocus
                    label="Name"
                    name="name"
                    placeholder="Enter Name"
                    defaultValue={
                        position.team ? teams[position.team].name : ''
                    }
                    variant="bordered"
                />
            )}
        </FormModal>
    );
};
