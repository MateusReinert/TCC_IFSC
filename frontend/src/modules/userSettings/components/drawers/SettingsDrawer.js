import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Usuário',
  },
  {
    segment: 'Configurações de usuário',
    title: 'Configurações de usuário',
    icon: <SettingsIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Grupos',
  },
  {
    segment: 'Configurações de Grupos',
    title: 'congigurações de Grupos',
    icon: <SettingsIcon />,
    children: [
      {
        segment: 'Grupo 1',
        title: 'Grupo 1',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'Grupo 2',
        title: 'Grupo 2',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window} 
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Skeleton height={14} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton height={14} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Skeleton height={100} />
            </Grid>

            <Grid item xs={12}>
              <Skeleton height={150} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton height={14} />
            </Grid>

            <Grid item xs={6} sm={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Skeleton height={100} />
            </Grid>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
