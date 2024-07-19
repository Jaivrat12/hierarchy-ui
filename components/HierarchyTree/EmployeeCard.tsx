import { Card, CardBody, CardProps } from '@nextui-org/react';
import { Employee } from '@/types';

interface EmployeeCardProps extends CardProps {
    name: Employee['name'];
    designation: string;
    href?: string;
};

export const EmployeeCard = ({ name, designation, className, ...props }: EmployeeCardProps) => {
    return (
        <Card
            className={'mx-auto min-w-[200px] ' + className}
            {...props}
        >
            <CardBody className="text-center">
                <p className="text-lg font-semibold">
                    {name}
                </p>
                <p>
                    {designation}
                </p>
            </CardBody>
        </Card>
    );
}