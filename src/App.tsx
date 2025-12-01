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
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';

// Camera shutter loading spinner component
const ShutterLoader = ({ size = 60 }: { size?: number }) => (
  <Box
    component="img"
    src="/shutter-loader.png"
    alt="Loading..."
    sx={{
      width: size,
      height: size,
      animation: 'spin 1.5s linear infinite',
      filter: 'invert(1)', // Makes the black PNG white
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    }}
  />
);
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  PlayCircleOutline as PlayIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  NotificationsActive as NotificationsIcon,
  AttachMoney as ReferralIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import keycloak from './keycloak';
import { getAppsForRoles } from './appsConfig';
import type { AppConfig } from './appsConfig';
import { UnifiedSearch } from './components/search';

// Theme matching Keycloak login style - #4a90e2 blue with glassmorphism
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2', // Keycloak-matching blue
      light: '#7ab3f0',
      dark: '#2d64b4',
    },
    secondary: {
      main: '#10b981', // green accent
    },
    background: {
      default: '#0a0f1e', // dark navy
      paper: 'rgba(255, 255, 255, 0.05)', // subtle glass
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
    h5: {
      fontSize: '1.375rem',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '10pt',
    },
    body1: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5), 0 0 40px 0 rgba(74, 144, 226, 0.3)',
            background: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1e3a5f 0%, #4a90e2 50%, #1e3a5f 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(74, 144, 226, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4a90e2',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #4a90e2 0%, #2d64b4 100%)',
          boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a9ef0 0%, #3d74c4 100%)',
            boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
          },
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

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    emailNotifications: true,
    smsNotifications: false,
  });

  // Referral program state
  const [referralData, setReferralData] = useState<{
    referral_code?: string;
    notify_on_referral_conversion?: boolean;
    notify_on_payout?: boolean;
    notify_on_tier_upgrade?: boolean;
  } | null>(null);
  const [loadingReferralData, setLoadingReferralData] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Admin notification settings state
  const [adminNotifications, setAdminNotifications] = useState({
    accountSetupEnabled: true,
    referralSignupEnabled: true,
    notificationEmail: 'ryanmayiras@gmail.com',
  });
  const [loadingAdminSettings, setLoadingAdminSettings] = useState(false);
  const [savingAdminSettings, setSavingAdminSettings] = useState(false);

  // Profile photo state
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Initialize Keycloak
  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setKeycloakInitialized(true);

        if (auth) {
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);

          const name = keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || 'User';
          const email = keycloak.tokenParsed?.email || '';
          setUserName(name);

          // Pre-fill profile data from Keycloak
          const nameParts = name.split(' ');
          setProfileData(prev => ({
            ...prev,
            firstName: keycloak.tokenParsed?.given_name || nameParts[0] || '',
            lastName: keycloak.tokenParsed?.family_name || nameParts.slice(1).join(' ') || '',
            email: email,
          }));

          console.log('Keycloak authenticated successfully');
          console.log('User roles:', roles);

          // Auto-redirect logic for single-app users
          const userApps = getAppsForRoles(roles).filter(app => !app.isInternal);
          if (userApps.length === 1) {
            console.log('User has exactly 1 app, auto-redirecting to:', userApps[0].url);
            setIsRedirecting(true);
            setTimeout(() => {
              window.location.href = userApps[0].url;
            }, 1500);
          }
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
        setKeycloakInitialized(true);
      });
  }, []);

  // Fetch referral data if user has referrer/affiliate role
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!authenticated || !userRoles.some(role => ['referrer', 'affiliate'].includes(role))) {
        return;
      }

      setLoadingReferralData(true);
      try {
        const token = keycloak.token;
        const response = await fetch('https://earn.candidstudios.net/api/referrer/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.referrer) {
            setReferralData({
              referral_code: data.referrer.referral_code,
              notify_on_referral_conversion: data.referrer.notify_on_referral_conversion ?? true,
              notify_on_payout: data.referrer.notify_on_payout ?? true,
              notify_on_tier_upgrade: data.referrer.notify_on_tier_upgrade ?? true,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoadingReferralData(false);
      }
    };

    fetchReferralData();
  }, [authenticated, userRoles]);

  // Fetch admin notification settings if user is admin
  useEffect(() => {
    const fetchAdminSettings = async () => {
      if (!authenticated || !userRoles.includes('admin')) {
        return;
      }

      setLoadingAdminSettings(true);
      try {
        const response = await fetch('https://n8n.candidstudios.net/webhook/admin-settings-get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setAdminNotifications({
              accountSetupEnabled: data.settings.accountSetupEnabled ?? true,
              referralSignupEnabled: data.settings.referralSignupEnabled ?? true,
              notificationEmail: data.settings.notificationEmail || 'ryanmayiras@gmail.com',
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin settings:', error);
      } finally {
        setLoadingAdminSettings(false);
      }
    };

    fetchAdminSettings();
  }, [authenticated, userRoles]);

  const handleAdminNotificationChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminNotifications(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));
  };

  const handleSaveAdminNotifications = async () => {
    setSavingAdminSettings(true);
    try {
      const response = await fetch('https://n8n.candidstudios.net/webhook/admin-settings-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          settings: adminNotifications,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Admin notification settings saved!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to save admin settings:', error);
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    } finally {
      setSavingAdminSettings(false);
    }
  };

  // Fetch profile photo on authentication
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!authenticated || !keycloak.tokenParsed?.sub) return;

      try {
        const userId = keycloak.tokenParsed.sub;
        const response = await fetch(
          `https://upload.candidstudios.net/api/profile-photo?userId=${userId}`
        );
        const data = await response.json();
        if (data.exists && data.url) {
          setProfilePhotoUrl(data.url);
        }
      } catch (error) {
        console.error('Failed to fetch profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, [authenticated]);

  // Handle profile photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !keycloak.token) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({ open: true, message: 'Please upload a JPEG, PNG, WebP, or GIF image', severity: 'error' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Image must be less than 5MB', severity: 'error' });
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('https://upload.candidstudios.net/api/profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add cache buster to force reload
        setProfilePhotoUrl(`${data.url}?t=${Date.now()}`);
        setSnackbar({ open: true, message: 'Profile photo updated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to upload photo', severity: 'error' });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      setSnackbar({ open: true, message: 'Failed to upload photo', severity: 'error' });
    } finally {
      setUploadingPhoto(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAppClick = (app: AppConfig) => {
    if (app.isInternal && app.url === '#settings') {
      setSelectedSection('settings');
    } else if (app.url) {
      window.location.href = app.url;
    }
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const handleProfileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Save profile to backend API
    console.log('Saving profile:', profileData);
    alert('Profile saved successfully!');
  };

  const copyReferralLink = () => {
    if (referralData?.referral_code) {
      const referralLink = `https://www.candidstudios.net/contact?ref=${referralData.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setSnackbar({ open: true, message: 'Referral link copied to clipboard!', severity: 'success' });
    }
  };

  const handleReferralNotificationChange = async (field: string, value: boolean) => {
    if (!referralData) return;

    try {
      const token = keycloak.token;
      const response = await fetch('https://earn.candidstudios.net/api/referrer/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...referralData,
          [field]: value,
        }),
      });

      if (response.ok) {
        setReferralData({ ...referralData, [field]: value });
        setSnackbar({ open: true, message: 'Notification preferences updated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to update preferences', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to update referral notifications:', error);
      setSnackbar({ open: true, message: 'Failed to update preferences', severity: 'error' });
    }
  };

  const drawer = (
    <Box sx={{
      width: 250,
      background: 'linear-gradient(180deg, rgba(30, 58, 95, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      height: '100%',
      borderRight: '1px solid rgba(74, 144, 226, 0.2)',
    }}>
      <Toolbar />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setSelectedSection('dashboard')}
            selected={selectedSection === 'dashboard'}
            sx={{
              borderRadius: '12px',
              '&.Mui-selected': {
                background: 'rgba(74, 144, 226, 0.2)',
                '&:hover': { background: 'rgba(74, 144, 226, 0.3)' },
              },
              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: selectedSection === 'dashboard' ? '#4a90e2' : 'rgba(255,255,255,0.7)' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ '& .MuiTypography-root': { fontWeight: selectedSection === 'dashboard' ? 600 : 400 } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setSelectedSection('videos')}
            selected={selectedSection === 'videos'}
            sx={{
              borderRadius: '12px',
              '&.Mui-selected': {
                background: 'rgba(74, 144, 226, 0.2)',
                '&:hover': { background: 'rgba(74, 144, 226, 0.3)' },
              },
              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: selectedSection === 'videos' ? '#4a90e2' : 'rgba(255,255,255,0.7)' }}>
              <PlayIcon />
            </ListItemIcon>
            <ListItemText primary="Latest Videos" sx={{ '& .MuiTypography-root': { fontWeight: selectedSection === 'videos' ? 600 : 400 } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setSelectedSection('announcements')}
            selected={selectedSection === 'announcements'}
            sx={{
              borderRadius: '12px',
              '&.Mui-selected': {
                background: 'rgba(74, 144, 226, 0.2)',
                '&:hover': { background: 'rgba(74, 144, 226, 0.3)' },
              },
              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: selectedSection === 'announcements' ? '#4a90e2' : 'rgba(255,255,255,0.7)' }}>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Announcements" sx={{ '& .MuiTypography-root': { fontWeight: selectedSection === 'announcements' ? 600 : 400 } }} />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setSelectedSection('settings')}
            selected={selectedSection === 'settings'}
            sx={{
              borderRadius: '12px',
              '&.Mui-selected': {
                background: 'rgba(74, 144, 226, 0.2)',
                '&:hover': { background: 'rgba(74, 144, 226, 0.3)' },
              },
              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: selectedSection === 'settings' ? '#4a90e2' : 'rgba(255,255,255,0.7)' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ '& .MuiTypography-root': { fontWeight: selectedSection === 'settings' ? 600 : 400 } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Loading screen
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
            background: 'radial-gradient(circle at center, #1e3a5f 0%, #0f172a 50%, #0a0f1e 100%)',
          }}
        >
          <ShutterLoader size={60} />
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
            {/* Unified Search Bar */}
            <UnifiedSearch
              userRoles={userRoles}
              userId={keycloak.tokenParsed?.sub}
              token={keycloak.token}
            />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                Welcome back {profileData.firstName || userName.split(' ')[0] || 'there'} 👋
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {getAppsForRoles(userRoles).map((app) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={app.name}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: app.color,
                      cursor: app.url ? 'pointer' : 'default',
                      opacity: app.url ? 1 : 0.6,
                    }}
                    onClick={() => app.url && handleAppClick(app)}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          mr: 2,
                          p: 1.5,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}>
                          <Box component="span" sx={{ fontSize: 24, color: 'white', display: 'flex' }}>
                            {app.icon}
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{
                          fontWeight: 600,
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          lineHeight: 1.2,
                          color: 'white',
                        }}>
                          {app.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{
                        opacity: 0.9,
                        fontSize: '10pt',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        lineHeight: 1.5,
                        color: 'white',
                      }}>
                        {app.description}
                      </Typography>
                      {!app.url && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          sx={{
                            mt: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </CardContent>
                    {app.url && (
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {app.isInternal ? 'Open' : 'Launch'}
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        );

      case 'settings':
        return (
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton
                onClick={() => setSelectedSection('dashboard')}
                sx={{ mr: 2, color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#4a90e2' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ color: '#fff' }}>
                Profile Settings
              </Typography>
            </Box>

            {/* Profile Card */}
            <Card sx={{ mb: 4, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {/* Profile Photo with Upload */}
                <Box sx={{ position: 'relative', mr: 3 }}>
                  <input
                    type="file"
                    id="profile-photo-input"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="profile-photo-input" style={{ cursor: 'pointer' }}>
                    <Avatar
                      src={profilePhotoUrl || undefined}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#4a90e2',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          filter: 'brightness(0.8)',
                        },
                      }}
                    >
                      {!profilePhotoUrl && (profileData.firstName?.[0] || userName?.[0] || 'U')}
                    </Avatar>
                    {/* Camera overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#4a90e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255,255,255,0.9)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#357abd',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {uploadingPhoto ? (
                        <ShutterLoader size={16} />
                      ) : (
                        <CameraIcon sx={{ fontSize: 16, color: 'white' }} />
                      )}
                    </Box>
                  </label>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    {profileData.firstName} {profileData.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {profileData.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                    Click photo to change
                  </Typography>
                  <Chip
                    label={userRoles.find(r => !['uma_authorization', 'offline_access', 'default-roles-candidstudios'].includes(r)) || 'User'}
                    size="small"
                    sx={{ mt: 1, bgcolor: 'rgba(74, 144, 226, 0.2)', color: '#4a90e2' }}
                  />
                </Box>
              </Box>
            </Card>

            {/* Personal Information */}
            <Card sx={{ mb: 4, p: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={handleProfileChange('firstName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={handleProfileChange('lastName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange('email')}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-input.Mui-disabled': {
                        color: '#ffffff',
                        WebkitTextFillColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={handleProfileChange('phone')}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Address */}
            <Card sx={{ mb: 4, p: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                Address
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={profileData.address}
                    onChange={handleProfileChange('address')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={profileData.city}
                    onChange={handleProfileChange('city')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="State"
                    value={profileData.state}
                    onChange={handleProfileChange('state')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={profileData.zipCode}
                    onChange={handleProfileChange('zipCode')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={profileData.country}
                    onChange={handleProfileChange('country')}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Notifications */}
            <Card sx={{ mb: 4, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: '#4a90e2' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Notification Preferences
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.emailNotifications}
                    onChange={handleProfileChange('emailNotifications')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#4a90e2' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4a90e2' },
                    }}
                  />
                }
                label="Email Notifications"
                sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.smsNotifications}
                    onChange={handleProfileChange('smsNotifications')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#4a90e2' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4a90e2' },
                    }}
                  />
                }
                label="SMS Notifications"
                sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}
              />
            </Card>

            {/* Referral Program Settings - Only show if user has referrer/affiliate role */}
            {userRoles.some(role => ['referrer', 'affiliate'].includes(role)) && (
              <Card sx={{ mb: 4, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReferralIcon sx={{ mr: 1, color: '#4a90e2' }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Referral Program Settings
                  </Typography>
                </Box>

                {loadingReferralData ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <ShutterLoader size={40} />
                  </Box>
                ) : referralData ? (
                  <>
                    {/* Referral Code & Link */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                        Your Referral Code
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        bgcolor: 'rgba(74, 144, 226, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(74, 144, 226, 0.2)',
                      }}>
                        <Typography variant="h6" sx={{ color: '#4a90e2', fontFamily: 'monospace', flex: 1 }}>
                          {referralData.referral_code}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CopyIcon />}
                          onClick={copyReferralLink}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          Copy Link
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<OpenIcon />}
                          onClick={() => window.open('https://earn.candidstudios.net/referrer-dashboard', '_blank')}
                          sx={{
                            whiteSpace: 'nowrap',
                            borderColor: 'rgba(74, 144, 226, 0.5)',
                            color: '#4a90e2',
                            '&:hover': {
                              borderColor: '#4a90e2',
                              bgcolor: 'rgba(74, 144, 226, 0.1)',
                            },
                          }}
                        >
                          Full Dashboard
                        </Button>
                      </Box>
                    </Box>

                    {/* Referral Link Preview */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Referral Link
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          wordBreak: 'break-all',
                        }}
                      >
                        https://www.candidstudios.net/contact?ref={referralData.referral_code}
                      </Typography>
                    </Box>

                    {/* Notification Preferences */}
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, mt: 3 }}>
                      Email Notification Preferences
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={referralData.notify_on_referral_conversion ?? true}
                          onChange={(e) => handleReferralNotificationChange('notify_on_referral_conversion', e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#4a90e2' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4a90e2' },
                          }}
                        />
                      }
                      label="Referral Conversions - Get notified when someone you referred books a service"
                      sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 1 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={referralData.notify_on_payout ?? true}
                          onChange={(e) => handleReferralNotificationChange('notify_on_payout', e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#4a90e2' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4a90e2' },
                          }}
                        />
                      }
                      label="Payout Updates - Get notified when commission payouts are processed"
                      sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 1 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={referralData.notify_on_tier_upgrade ?? true}
                          onChange={(e) => handleReferralNotificationChange('notify_on_tier_upgrade', e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#4a90e2' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4a90e2' },
                          }}
                        />
                      }
                      label="Tier Upgrades - Get notified when you reach a new referral tier"
                      sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}
                    />
                  </>
                ) : (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 3 }}>
                    Unable to load referral settings
                  </Typography>
                )}
              </Card>
            )}

            {/* Admin Notification Settings - Only show if user is admin */}
            {userRoles.includes('admin') && (
              <Card sx={{ mb: 4, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ mr: 1, color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Admin Notification Settings
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                  Configure email notifications for system events. These notifications are sent to the admin email address.
                </Typography>

                {loadingAdminSettings ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <ShutterLoader size={40} />
                  </Box>
                ) : (
                  <>
                    {/* Notification Email */}
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Notification Email Address"
                        value={adminNotifications.notificationEmail}
                        onChange={handleAdminNotificationChange('notificationEmail')}
                        helperText="All admin notifications will be sent to this email"
                        sx={{ mb: 2 }}
                      />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                      Event Notifications
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminNotifications.accountSetupEnabled}
                          onChange={handleAdminNotificationChange('accountSetupEnabled')}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f59e0b' },
                          }}
                        />
                      }
                      label="Dashboard Account Setup - Get notified when someone completes their account setup"
                      sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 1 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminNotifications.referralSignupEnabled}
                          onChange={handleAdminNotificationChange('referralSignupEnabled')}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f59e0b' },
                          }}
                        />
                      }
                      label="Referral Program Signup - Get notified when someone joins the referral program"
                      sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveAdminNotifications}
                        disabled={savingAdminSettings}
                        sx={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
                        }}
                      >
                        {savingAdminSettings ? 'Saving...' : 'Save Notification Settings'}
                      </Button>
                    </Box>
                  </>
                )}
              </Card>
            )}

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                sx={{ px: 4 }}
              >
                Save Changes
              </Button>
            </Box>
          </Container>
        );

      case 'videos':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Latest Videos
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Stay updated with our latest content and tutorials.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(45, 100, 180, 0.4) 100%)', color: 'white' }}>
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
                <Card sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.4) 100%)', color: 'white' }}>
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
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Announcements
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.4) 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">New Feature Release!</Typography>
                    <Typography variant="body2" paragraph>
                      We've added new features to the Media Archive. Check it out!
                    </Typography>
                    <Typography variant="body2">
                      - Product Team
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.4) 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">Maintenance Schedule</Typography>
                    <Typography variant="body2" paragraph>
                      Scheduled maintenance for Cloud Storage on Sunday 2-4 PM EST.
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
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #1e3a5f 0%, #4a90e2 50%, #1e3a5f 100%)',
          }}
        >
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
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: '"Kumbh Sans", sans-serif',
                fontWeight: 600,
                letterSpacing: '0.5px',
                flexGrow: 1,
              }}
            >
              Candid Studios Dashboard
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
            ModalProps={{ keepMounted: true }}
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
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, border: 'none' },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 250px)` },
            background: 'radial-gradient(circle at center, #1e3a5f 0%, #0f172a 50%, #0a0f1e 100%)',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
