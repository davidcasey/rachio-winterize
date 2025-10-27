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
            Complete training and create a winterize sequence to save
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
            Your winterize setup has been saved into this page's URL. We never store any of your data. This means your Rachio API token and custom sequence are safe and only used while you're here.
          </Typography>
          <Typography variant="body1">
            To easily pick up where you left off next year, bookmark this page:
          </Typography>
          <ul>
            <li><Typography variant="body1">Mac: Press <strong>Cmd+D</strong></Typography></li>
            <li><Typography variant="body1">Windows/Linux: Press <strong>Ctrl+D</strong></Typography></li>
          </ul>
          <Typography variant="body1" paragraph>
            When you open that bookmark next time, your entire winterize sequence and custom timings will be restored automatically.
          </Typography>
          <Typography variant="body1">
            ⚠️ <strong>Security Note:</strong> Your bookmark contains your Rachio API token. Keep it private and don't share it.
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
