import { JSX, useState } from 'react';
import { Button, Snackbar, Alert, Tooltip } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
import { useUrlState } from 'app/hooks/useUrlState';

export const ExportButton = (): JSX.Element => {
  const { canExport, copyUrlToClipboard } = useUrlState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleExport = async () => {
    const success = await copyUrlToClipboard();
    if (success) {
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  if (!canExport) {
    return (
      <Tooltip title="Complete training and create a winterize sequence to export">
        <span>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            sx={{ float: 'right' }}
            disabled
          >
            Export Bookmark
          </Button>
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleExport}
        sx={{ float: 'right' }}
      >
        Export Bookmark
      </Button>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Bookmark URL copied to clipboard! Save it to return next year.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Failed to copy URL to clipboard
        </Alert>
      </Snackbar>
    </>
  );
};
