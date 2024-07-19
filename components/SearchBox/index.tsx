import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DetailedHTMLProps, HTMLAttributes, useMemo, useState } from 'react';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';
import { SearchIcon } from './SearchIcon';
import { useAppSelector } from '@/lib/hooks';
import { createQueryString, formatDesignation } from '@/lib/utils';

interface SearchBoxProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const SearchBox = ({ className, ...props }: SearchBoxProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { positions, teams } = useAppSelector((state) => state.company);
    const filteredPositions = useMemo(() => {
        return Object.values(positions).filter(
            (position) => !!position.employee
        );
    }, [positions]);

    const [searchString, setSearchString] = useState('');
    const results = useMemo(() => {
        if (!searchString) {
            return [];
        }

        return filteredPositions.filter((position) =>
            position
                .employee!.name.toLowerCase()
                .match(searchString.toLowerCase())
        );
    }, [filteredPositions, searchString]);

    return (
        <>
            <div
                className={className + ' relative'}
                {...props}
            >
                <Input
                    label="Search"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    onClear={() => setSearchString('')}
                    isClearable
                    radius="lg"
                    placeholder="Type to search..."
                    startContent={
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
                {searchString && (
                    <Listbox className="absolute z-[999999999] bg-content2 top-[110%] rounded-xl">
                        {results.map((result) => (
                            <ListboxItem
                                key={result.id}
                                as={Link}
                                href={createQueryString(searchParams.toString(), pathname, {
                                    edit: 'employee',
                                    id: result.id,
                                })}
                            >
                                <div className="flex flex-col">
                                    <span className="text-small">
                                        {result.employee!.name}
                                    </span>
                                    <span className="text-tiny text-default-400">
                                        {formatDesignation(result, result.team ? teams[result.team] : undefined)}
                                    </span>
                                </div>
                            </ListboxItem>
                        ))}
                    </Listbox>
                )}
            </div>
        </>
    );
};
