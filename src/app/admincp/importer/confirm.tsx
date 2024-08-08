import { CONFIG } from 'src/config-global';

import { DashboardContent } from 'src/layouts/dashboard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UploadView } from 'src/sections/importer/upload';

// ----------------------------------------------------------------------

export const metadata = { title: `Nhập đề | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4">Nhập đề</Typography>
      <Box sx={{ marginTop: 5 }}>
        <UploadView />
      </Box>
    </DashboardContent>
  );
}
