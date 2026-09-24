import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// color="secondary" mirrors the Navbar's navy so header and footer bookend the page.
// Contact details are demo placeholders — same spirit as the fake login token.
function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "secondary.main", color: "white", pt: 4, pb: 2.5 }}>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              SmartCart Pro
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.5 }}>
              Your one-stop shop for everything you need.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="inherit" aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Quick Links
            </Typography>
            <Stack spacing={0.75}>
              <MuiLink component={Link} to="/" color="inherit" underline="hover" variant="body2">
                Home
              </MuiLink>
              <MuiLink component={Link} to="/products" color="inherit" underline="hover" variant="body2">
                Products
              </MuiLink>
              <MuiLink component={Link} to="/cart" color="inherit" underline="hover" variant="body2">
                Cart
              </MuiLink>
              <MuiLink component={Link} to="/login" color="inherit" underline="hover" variant="body2">
                Login
              </MuiLink>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Customer Support
            </Typography>
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <MuiLink href="tel:+919876543210" color="inherit" underline="hover" variant="body2">
                  +91 9876543210
                </MuiLink>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" />
                <MuiLink
                  href="mailto:support@smartcartpro.com"
                  color="inherit"
                  underline="hover"
                  variant="body2"
                >
                  support@smartcartpro.com
                </MuiLink>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Mon–Sat, 9:00 AM – 6:00 PM
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.15)" }} />

        <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8 }}>
          © {new Date().getFullYear()} SmartCart Pro. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
