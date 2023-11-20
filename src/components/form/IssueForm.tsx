import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import * as Yup from 'yup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import StyledButton from '../StyledButton/StyledButton';
import {
    Alert,
    Autocomplete,
    Button,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TextField
} from '@mui/material';
import {useEffect, useState} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import {Office} from '../../models/OfficeModel';
import {fetchAllOffices} from '../../api/OfficeApi';
import {saveIssue} from '../../api/issueAPI';
import {Editor} from "@tinymce/tinymce-react";
import FileDropField from "../formFields/FileDropField";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import WideDisabledField from '../formFields/WideDisabledField';
import {COLORS} from '../../values/colors';
import StyledTextField from '../formFields/StyledTextField';

const issueValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'minimal short summary size is 10 letters')
        .max(150, 'maximal short summary size is 150 letters'),
    description: Yup.string()
        .min(10, 'minimal description size is 10 letters')
        .max(250, 'maximal short summary size is 150 letters')
        .required('Description is required'),
    office: Yup.string().required('Office select is required'),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const labelColor = { color: '#6B706D' };

const IssueForm = ({ open, close }) => {
    const [officesLoading, setOfficesLoading] = useState(true);
    const [offices, setOffices] = useState<Office[]>([]);
    const [showError, setError] = useState('');
    console.log(offices);
    const user = useSelector((state:RootState) => state.user.user);
    const[selectedOfficeId, setSelectedOfficeId] = useState('')

    const getSelectedOfficeId =(officeName:string) => {
        const selectedOffice = offices.find((o) => o.name === officeName )
        if (selectedOffice){
            setSelectedOfficeId(selectedOffice.id);
            console.log('officeId:', selectedOffice.id);
        } else {
            setSelectedOfficeId('');
        }
    };


    useEffect(() => {
        console.log(selectedOfficeId);

    }, [selectedOfficeId]);


    useEffect(() => {
        fetchAllOffices()
            .then((offices) => setOffices(offices))
            .catch((err) => setError(err))
            .finally(() => setOfficesLoading(false));
    }, []);

    useEffect(() => {
        console.log(selectedOfficeId);

    }, [selectedOfficeId]);

    const onSaveIssue = (values: { name: any; description: any; office: any; attachments: any; }, helpers: { resetForm: () => void; setSubmitting: (arg0: boolean) => void; }) => {
        getSelectedOfficeId(values.office)
        console.log('values:',values);
        saveIssue({
            name: values.name,
            description: values.description,
            officeId: selectedOfficeId,
            employeeId: user?.id

        })
            .then((response) => {
                close();
            })
            .catch(({ response }) => setError(response.data.reason))
            .finally(() => {helpers.setSubmitting(false)
                helpers.resetForm();});
    };

    return(
        <>
            { officesLoading? <CircularProgress/> : <Formik
                initialValues={{
                    name: '',
                    description: '',
                    office: user?.country.name,
                    attachments: 'https://www.indraconsulting.com/wp-content/uploads/2011/11/problem-solution-1024x775.jpg',
                }}
                onSubmit={onSaveIssue}
                validationSchema={issueValidationSchema}
            >

                { ({values, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting, setFieldValue}) => (
                    <form onSubmit={handleSubmit} id={'issueForm'} >
                        {
                            <BootstrapDialog onClose={close} aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth={'md'}  >
                                <DialogTitle variant ='h4' sx={{ m: 3, p: 2 }} id="customized-dialog-title">
                                    <Typography variant="h4" gutterBottom sx={{ color: 'var(--primary-color)' }}>
                                        Report issue:
                                    </Typography>
                                    { showError && <Alert severity="error">ISSUE REPORT FAILED!</Alert> }
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={close}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <DialogContent sx={{ width: '95%', height: '850px', m: 3, p: 2  }}>
                                    <Stack spacing={2} direction="column">
                                        <Typography variant="h5" style={{ color: 'grey', paddingBottom: '5px' }}>
                                            Short description
                                        </Typography>
                                        <StyledTextField
                                            error={touched.name && !!errors.name}
                                            errorMessage="Please input your street."
                                            id="name"
                                            name="name"
                                            type="text"
                                        />

                                        <Typography variant="h5" style={{ color: 'grey', paddingBottom: '5px' }}>
                                            Description
                                        </Typography>
                                        <Field name='description'>
                                            {({ field, meta }) => (
                                                <div>
                                                    <Editor
                                                        id='article_body'
                                                        apiKey='t3fy06mhh684wsiszfxq9iy61vn9kbe5gx98l8vynn7617hx'
                                                        initialValue='Write...'
                                                        init={{
                                                            menubar: false,
                                                            plugins: "list code hr",
                                                            toolbar: "bold italic strikethrough bullist numlist ",
                                                        }}
                                                        onEditorChange={(e) => {
                                                            const fixedText=e.replace(/^<p\/p>$/, '');
                                                            handleChange({target:{name:'description', value: fixedText}});
                                                        }}
                                                        textareaName='description'
                                                        onChange={field.onChange}
                                                        onBlur={field.onBlur}
                                                        value={values.description}
                                                    />
                                                </div>)}
                                        </Field>

                                        <Typography variant="h5" style={{ color: 'grey', paddingBottom: '5px' }}>
                                            Office
                                        </Typography>
                                        <FormControl   >
                                            <Field
                                                                                                id={'office'}
                                                name={'office'}
                                                as={Select}
                                                style={{
                                                    width: '300px',
                                                    fontSize: '14px',
                                                    paddingLeft: '3px',
                                                    height: '40px',
                                                    color: COLORS.blue,
                                                    borderRadius: '6px',
                                                    borderColor: COLORS.lighterGray,
                                                    outlineColor: COLORS.blue,
                                                    outlineWidth: '4px',
                                                    boxShadow: 'none'
                                                }}
                                                onChange={event => setFieldValue('office', event.target.value)
                                                }
                                            >
                                                {offices.map((o) =>
                                                    <MenuItem key={o.id} value={o.name}>{o.name}</MenuItem>
                                                )}
                                            </Field>
                                        </FormControl>
                                        <Divider />
                                        <label style={labelColor}>Attachments</label>
                                        <Field name = 'attachments' as = {FileDropField} sx ={{width: '100%'}}/>

                                    </Stack>
                                </DialogContent>
                                <Divider />
                                <DialogActions>
                                    {isSubmitting ? (
                                        <CircularProgress />
                                    ) : (
                                        <>
                                            <StyledButton buttonSize={'medium'} buttonType={'secondary'} type={'button'} onClick={close}>
                                                Cancel
                                            </StyledButton>
                                            <Button
                                                sx={{ backgroundColor: '#0E166E',
                                                    width: '158px',
                                                    height: '38px',
                                                    fontSize: '14px',
                                                    borderRadius: '30px',
                                                    color: 'white',}}
                                                type={'submit'} form={'issueForm'}>
                                                Report issue
                                            </Button>
                                        </>
                                    )}
                                </DialogActions>
                            </BootstrapDialog>
                        }
                    </form>
                )}
            </Formik>
            }
        </>
    );
};

export default IssueForm;
