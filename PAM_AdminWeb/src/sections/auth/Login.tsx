import { Stack, Typography } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import LoginLayout from '../../layouts/login';
import AuthLoginForm from './AuthLoginForm';
import AuthNewPasswordForm from './AuthNewPasswordForm';

export default function Login() {
  const { temporaryPassword } = useAuthContext();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Portal do Administrador
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1.1rem',
          }}
        >
          Acesse sua conta para gerenciar o sistema
        </Typography>
      </Stack>

      {temporaryPassword ? <AuthNewPasswordForm /> : <AuthLoginForm />}

    </LoginLayout>
  );
}
