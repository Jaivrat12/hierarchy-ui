import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Modal as NextUiModal } from '@nextui-org/react';
import { type ReactNode } from 'react';

type ModalProps = {
    title: ReactNode;
    isOpen: boolean;
    onClose: () => any;
    // eslint-disable-next-line no-unused-vars
    action: (formData: FormData, onClose: () => void) => void;
    // eslint-disable-next-line no-unused-vars
    children: (onClose: () => void) => ReactNode;
    submitButtonText: string;
};

export const FormModal = ({ title, isOpen, onClose, action, children, submitButtonText }: ModalProps) => {
    return (
        <NextUiModal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{title}</ModalHeader>

                        <form action={(formData) => action(formData, onClose)}>
                            <ModalBody>
                                {children(onClose)}
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    type="submit"
                                    color="primary"
                                >
                                    {submitButtonText}
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </NextUiModal>
    );
};
