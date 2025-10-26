import { JSX, useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Bookmark as BookmarkIcon } from '@mui/icons-material';
import { useUrlState } from 'app/hooks/useUrlState';

export const ExportButton = (): JSX.Element => {
  const { canExport, generateUrl } = useUrlState();
  const [showDialog, setShowDialog] = useState(false);

  const handleExport = () => {
    const url = generateUrl();
    if (!url) return;

    // Update the browser URL to include the hash
    window.history.pushState(null, '', url);
    
    // Show the instructions dialog
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    // Optionally clean up the URL after they close
    // window.history.pushState(null, '', window.location.pathname);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<BookmarkIcon />}
          onClick={handleExport}
          disabled={!canExport}
        >
          Save Bookmark
        </Button>
        {!canExport && (
          <Typography variant="caption" textAlign="right" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            Complete training and create a winterize sequence to export
          </Typography>
        )}
      </Box>

      <Dialog
        open={showDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Your Configuration</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Your winterize sequence and API token have been saved to the current page URL.
          </Typography>
          
          <Typography variant="body1">
            Please bookmark this page.
          </Typography>
          <ul>
            <li><Typography variant="body1"><strong>Ctrl+D</strong> (Windows/Linux)</Typography></li>
            <li><Typography variant="body1"><strong>Cmd+D</strong> (Mac)</Typography></li>
          </ul>

          <Typography variant="body1" paragraph>
            Next year, open this bookmark to instantly restore your winterize sequence with all your custom timings.
          </Typography>

          <Typography variant="body1">
            ⚠️ <strong>Security Note:</strong> This bookmark contains your Rachio API token. Keep it private and don't share it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
