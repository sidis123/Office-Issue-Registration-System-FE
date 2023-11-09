import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
// eslint-disable-next-line import/order
import { createTheme, ThemeProvider } from '@mui/material/styles';


import 'src/scss/ModalTabsStyles.scss';
import { useSelector } from 'react-redux';

import  Comments  from '../comment/Comments';
import { Employee } from '../comment/Comment';

import { RootState } from 'src/store/store';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const customTabTheme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0em',
          textAlign: 'left',
          textTransform: 'none',
          color: '#000048',
          '&.Mui-selected': {
            fontWeight: 600,
            color: '#000048',
          },
        },
      },
    },
  },
});

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


// const user = useSelector((state: RootState) => state.user);

const issueIdMock = 'abdee4f9-5763-4afc-85ed-98b2fdefb35d';
const employeeMock: Employee = {
  id: 'd06cb831-9427-41ee-adcc-271f7b02d627',
  fullName: 'Sarunas Jurevicius',
  avatar: 'https://images.unsplash.com/photo-1585837146751-a44118595680?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
};



// eslint-disable-next-line react/no-multi-comp
export default function BasicTabs({ description, issueId }: { description: string, issueId: string }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ThemeProvider theme={customTabTheme}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab {...a11yProps(0)} label="Details" />
            <Tab {...a11yProps(1)} label={`Comments (${0})`}/>
            <Tab {...a11yProps(2)} label="Activity log" />
        </Tabs>
       </ThemeProvider>
      </Box>
      <CustomTabPanel value={value} index={0}>
       <Typography className="Description">
         Description
       </Typography>
       <Typography className="ActualDescription">
        {description}
       </Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Comments issueId={issueId} currentUser={employeeMock} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Busimi Logai
      </CustomTabPanel>
    </Box>
  );
}

