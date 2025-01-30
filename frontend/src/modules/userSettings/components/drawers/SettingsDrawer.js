import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import PasswordIcon from '@mui/icons-material/Password';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import AssistantIcon from '@mui/icons-material/Assistant';
import InterestsIcon from '@mui/icons-material/Interests';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import InfoIcon from '@mui/icons-material/Info';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GavelIcon from '@mui/icons-material/Gavel';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Usuário',
  },
  {
    segment: 'perfil',
    title: 'Informações do perfil',
    icon: <PersonIcon />,
  },
  {
    segment: 'privacidadeESeguranca',
    title: 'Privacidade e segurança',
    icon: <SecurityIcon />,
    children: [
      {
        segment: 'visibilidadeDoPerfil',
        title: 'Visibilidade do Perfil',
        icon: <VisibilityIcon />,
      },
      {
        segment: 'bloqueioDeUsuarios',
        title: 'Bloqueio de Usuários',
        icon: <BlockIcon />,
      },
      {
        segment: 'senha',
        title: 'Senha',
        icon: <PasswordIcon />,
      },
      {
        segment: 'notificacoes',
        title: 'Notificações',
        icon: <NotificationsIcon />,
      },
    ],
  },
  {
    segment: 'gerenciamentoDeConta',
    title: 'Gerenciamento de Conta',
    icon: <ManageAccountsIcon />,
    children: [
      {
        segment: 'deletarConta',
        title: 'Deletar Conta',
        icon: <DeleteIcon />,
      },
      {
        segment: 'alteracaoDeSenha',
        title: 'Alteração de Senha',
        icon: <LockResetIcon />,
      },
    ],
  },
  {
    segment: 'personalizacaoDeFeed',
    title: 'Personalização de feed',
    icon: <AssistantIcon />,
    children: [
      {
        segment: 'Interesses',
        title: 'Interesses',
        icon: <InterestsIcon />,
      },
    ],
  },
  {
    segment: 'acessibilidade',
    title: 'Acessibilidade',
    icon: <AccessibilityIcon />,
    children: [
      {
        segment: 'fonte',
        title: 'Fonte',
        icon: <FontDownloadIcon />,
      },
    ],
  },
  {
    segment: 'configuracoesDePostagem',
    title: 'Configurações de postagem',
    icon: <SettingsIcon />,
    children: [
      {
        segment: 'padroesDePrivacidade',
        title: 'Padrões de privacidade',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'sensibilidadeDeConteudo',
        title: 'Sensibilidade de conteúdo',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'suporteEAjuda',
    title: 'Suporte e ajuda',
    icon: <SupportAgentIcon />,
    children: [
      {
        segment: 'centralDeAjuda',
        title: 'Central de ajuda',
        icon: <InfoIcon />,
      },
      {
        segment: 'deedback',
        title: 'Feedback',
        icon: <FeedbackIcon />,
      },
      {
        segment: 'termosDeUsoEPoliticaDePrivacidade',
        title: 'Termos de uso e política de privacidade',
        icon: <GavelIcon />,
      },
    ],
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
    title: 'Configurações de Grupos',
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

  const router = useDemoRouter('/Informações do perfil');

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
