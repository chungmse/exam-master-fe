import { CONFIG } from 'src/config-global';
import { GenView } from 'src/sections/generator/gen';
import { DashboardContent } from 'src/layouts/dashboard';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export const metadata = { title: `Sinh đề | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ marginTop: 5 }}>
        <GenView />
      </Box>
    </DashboardContent>
  );
}
