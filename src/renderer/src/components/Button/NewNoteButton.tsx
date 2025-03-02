import { ActionButton, ActionButtonProps } from '@/components';
import { createEmptyNoteAtom } from '@renderer/store';
import { useSetAtom } from 'jotai';
import { FaRegPlusSquare } from "react-icons/fa";

export const NewNoteButton = ({...props}: ActionButtonProps) => {
    const createEmptyNote = useSetAtom(createEmptyNoteAtom)

    const handleCreation = async () => {
        await createEmptyNote()
    }

    return (
        <ActionButton onClick={handleCreation} {...props}>
            <FaRegPlusSquare    className='w-4 h-4 text-zinc-300'/>
        </ActionButton>
    )
}