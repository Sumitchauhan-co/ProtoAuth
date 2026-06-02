import React from 'react';

const LayoutContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-screen max-w-screen relative bg-white dark:bg-background text-foreground font-sans antialiased transition-colors duration-200 selection:bg-primary selection:text-primary-foreground">
            {children}
        </div>
    );
};

export default LayoutContainer;
