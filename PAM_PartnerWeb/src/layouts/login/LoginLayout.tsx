import { Typography, Stack } from '@mui/material';
import Logo from 'src/components/logo';
import Image from '../../components/image';
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};

export default function LoginLayout({ children, illustration, title }: Props) {
  return (
    <StyledRoot>
      <Logo
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      />

      <StyledSection>
        <Typography
          variant="h2"
          sx={{
            mb: 6,
            maxWidth: 600,
            textAlign: 'center',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4FC3F7 0%, #FF6A00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title || 'Bem-vindo ao MeuGas!'}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 10,
            maxWidth: 500,
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 400,
          }}
        >
          Conecte-se e gerencie suas entregas
        </Typography>

        <Image
          disabledEffect
          visibleByDefault
          alt="MeuGas - Portal do Parceiro"
          src={illustration || '/logo/logo.png'}
          sx={{ maxWidth: 400, filter: 'drop-shadow(0 20px 40px rgba(79, 195, 247, 0.2))' }}
        />

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
