import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import DrawerToolbar from './DrawerToolbar';
import { fetchIssueDetails } from 'src/api/DetailApi';

import IssueDetails from './IssueDetails';
import { deleteIssueById } from 'src/api/IssueDeleteApi';

const initialDetails = {
  name: 'Loading...',
  description: 'Loading...',
  status: 'Loading...',
  rating: 0,
  dateCreated: 'Loading...',
  employeeName: 'Loading...',
  employeeAvatar: '',
  officeName: 'Loading...',
  officeId: '',
  employeeId: '',
};
export default function IssueDrawer({
  wrapperSetDaitailsOpen,
  issueDetailsOpen,
  issueId,
  handleVoteCount,
  voteCount,
  wasVoted,
  isError,
  setError,
  isVoted,
  setVoted,
}) {
  const [issueDetailData, setIssueDetailData] = useState(initialDetails);
  const handleDrawerOpen = () => {
    fetchIssueDetails(issueId).then((data) => {
      if (data != null) {
        setIssueDetailData(data);
      }
    });
  };
  useEffect(() => {
    if (issueDetailsOpen) {
      handleDrawerOpen();
    }
  }, [issueDetailsOpen]);

  return (
    <div>
      <React.Fragment key={'right'}>
        <Drawer anchor={'right'} open={issueDetailsOpen} onClose={() => wrapperSetDaitailsOpen(false)}>
          <DrawerToolbar
            issueId={issueId}
            title={issueDetailData.name}
            wrapperSetDaitailsOpen={wrapperSetDaitailsOpen}
            employeeId={issueDetailData.employeeId}
          />
          <Box sx={{ width: 660, margin: 5 }}>
            <IssueDetails
              id={issueId}
              title={issueDetailData.name}
              description={issueDetailData.description}
              reportedBy={issueDetailData.employeeName}
              reportedByAvatar={issueDetailData.employeeAvatar}
              reported={issueDetailData.dateCreated}
              status={issueDetailData.status}
              upvotes={voteCount}
              office={issueDetailData.officeName}
              officeId={issueDetailData.officeId}
              employeeId={issueDetailData.employeeId}
              handleVoteCount={handleVoteCount}
              wasVoted={wasVoted}
              isError={isError}
              setError={setError}
              isVoted={isVoted}
              setVoted={setVoted}
              wrapperSetDaitailsOpen={wrapperSetDaitailsOpen}
            />
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
