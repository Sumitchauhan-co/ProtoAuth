import { useEffect } from 'react';
import './App.css';
import { ThemeProvider } from './theme/ThemeProvider';
import AppRoute from './routes/AppRoute';
import useAuthStore from './store/store';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

function App() {
    const getUser = useAuthStore((state) => state.getUser);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const isVerified = searchParams.get('verified');

        if (isVerified === 'true') {
            toast.success('Email verified successfully!', {
                description: 'You can now access all features of your account.',
            });

            searchParams.delete('verified');
            setSearchParams(searchParams, { replace: true });
        } else if (isVerified === 'false') {
            toast.error('Email not verified!', {
                description: `You will be restricted for few features on your account`,
            });

            searchParams.delete('verified');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        getUser();
    }, []);

    return (
        <TooltipProvider>
            <ThemeProvider
                defaultTheme="dark"
                storageKey="vite-ui-theme"
            >
                <Toaster
                    theme="dark"
                    position="top-center"
                />
                <AppRoute />
            </ThemeProvider>
        </TooltipProvider>
    );
}

export default App;
