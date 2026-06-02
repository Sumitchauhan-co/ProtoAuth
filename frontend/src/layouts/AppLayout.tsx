import Footer from '@/components/Footer';
import Container from '@/layouts/LayoutContainer';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <Container>
            <Navbar />
            <Outlet />
            <Footer />
        </Container>
    );
};

export default AppLayout;
