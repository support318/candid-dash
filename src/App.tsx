import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  PlayCircleOutline as PlayIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import keycloak from './keycloak';
import { getAppsForRoles } from './appsConfig';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // blue
    },
    secondary: {
      main: '#10b981', // green
    },
    background: {
      default: '#0a0f1e', // dark gray
      paper: 'rgba(255, 255, 255, 0.03)', // subtle glass
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
    h5: {
      fontSize: '1.375rem', // 22px (reduced from default ~24px)
    },
    h6: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem', // 18px (reduced from default ~20px)
    },
    body2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '10pt',
    },
    body1: {
      fontSize: '0.875rem', // 14px (reduced from default 16px)
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '20px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.03)',
            boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5), 0 0 40px 0 rgba(59, 130, 246, 0.3)',
            background: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1e3a8a 0%, #5ca3ff 50%, #1e3a8a 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
        },
      },
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize Keycloak
  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required', // Redirect to login if not authenticated
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setKeycloakInitialized(true);

        if (auth) {
          // Get user roles from Keycloak token
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);

          // Get user name
          const name = keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || 'User';
          setUserName(name);

          console.log('Keycloak authenticated successfully');
          console.log('User roles:', roles);
          console.log('User name:', name);

          // Auto-redirect logic: if user has exactly 1 app, redirect to it
          const userApps = getAppsForRoles(roles);
          if (userApps.length === 1) {
            console.log('User has exactly 1 app, auto-redirecting to:', userApps[0].url);
            setIsRedirecting(true);
            setTimeout(() => {
              window.location.href = userApps[0].url;
            }, 1500); // Small delay to show redirect message
          }
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
        setKeycloakInitialized(true);
      });
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAppClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const drawer = (
      <Box sx={{ width: 250, background: '#1a1a1a', height: '100%' }}>
        <Toolbar />
        <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedSection('dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedSection('videos')}>
            <ListItemIcon>
              <PlayIcon />
            </ListItemIcon>
            <ListItemText primary="Latest Videos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedSection('announcements')}>
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Announcements" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Show loading screen while initializing Keycloak
  if (!keycloakInitialized || isRedirecting) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 50%, #1a1a2e 100%)',
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3, color: 'white' }}>
            {isRedirecting ? 'Redirecting to your app...' : 'Authenticating...'}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Welcome to Candid Studios Main Menu
            </Typography>
            <Typography variant="body2" paragraph>
              Your central hub for all Candid Studios applications and resources, powered by Keycloak SSO for secure access.
            </Typography>
            <Grid container spacing={3}>
              {getAppsForRoles(userRoles).map((app) => (
                <Grid item xs={12} sm={6} md={3} key={app.name} className="app-card">
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: app.color, color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)', marginRight: '10px' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          mr: 2, 
                          p: 1.5, 
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}>
                          <Box component="span" sx={{ fontSize: 16, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', display: 'flex' }}>
                            {app.icon}
                          </Box>
                        </Box>
                        <Typography variant="h6" component="div" sx={{ 
                          fontWeight: 600,
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          lineHeight: 1.2,
                        }}>
                          {app.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        opacity: 0.9,
                        fontSize: '10pt',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        lineHeight: 1.5,
                      }}>
                        {app.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        fullWidth
                        onClick={() => handleAppClick(app.url)}
                        sx={{ 
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      >
                        Launch
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        );
      case 'videos':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Latest Videos
            </Typography>
            <Typography variant="body1" paragraph>
              Stay updated with our latest content and tutorials.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">Dashboard Tutorial</Typography>
                    <Typography variant="body2">
                      Learn how to navigate and use the Candid Studios Dashboard effectively.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" sx={{ color: 'white' }}>Watch Now</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">App Integration Guide</Typography>
                    <Typography variant="body2">
                      Step-by-step guide to integrating with our applications.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" sx={{ color: 'white' }}>Watch Now</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
      case 'announcements':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Announcements
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">New Feature Release!</Typography>
                    <Typography variant="body2" paragraph>
                      We've added new features to the R2 SmartChannel. Check it out!
                    </Typography>
                    <Typography variant="body2">
                      - Product Team
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">Maintenance Schedule</Typography>
                    <Typography variant="body2" paragraph>
                      Scheduled maintenance for Nextcloud on Sunday 2-4 PM EST.
                    </Typography>
                    <Typography variant="body2">
                      - IT Team
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Welcome New Team Members!</Typography>
                    <Typography variant="body2" paragraph>
                      We're excited to have you on board. Please explore all the applications and reach out if you have any questions.
                    </Typography>
                    <Typography variant="body2">
                      - Candid Studios Team
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #7c3aed 100%)' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{
              fontFamily: '"Kumbh Sans", sans-serif',
              fontWeight: 600,
              letterSpacing: '0.5px',
              flexGrow: 1,
            }}>
              Candid Cloud
            </Typography>

            {authenticated && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {userName}
                  </Typography>
                  {userRoles.length > 0 && (
                    <Chip
                      label={userRoles.find(r => !['uma_authorization', 'offline_access', 'default-roles-candidstudios'].includes(r)) || userRoles[0]}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  )}
                </Box>
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  title="Logout"
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 250px)` }, background: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 50%, #1a1a2e 100%)', minHeight: '100vh' }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
