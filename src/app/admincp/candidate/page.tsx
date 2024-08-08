import { CONFIG } from 'src/config-global';
import { MceView } from 'src/sections/candidate/mce';
import { DashboardContent } from 'src/layouts/dashboard';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export const metadata = { title: `Dự thi | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ marginTop: 5 }}>
        <MceView />
      </Box>
    </DashboardContent>
  );
}
