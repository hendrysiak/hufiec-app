import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface InputFileUploadProps {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function InputFileUpload({ file, setFile }: InputFileUploadProps) {
    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Wgraj plik
            <VisuallyHiddenInput type="file" onChange={(e) => {
                if (e.target.files) {
                    setFile(e.target.files[0]);
                }
            }} />
        </Button>
    );
}