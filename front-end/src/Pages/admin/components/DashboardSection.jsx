const DashboardSection = ({ title, children }) => {
    return (
        <section className="mb-10">
            {title && (
                <h2 className="text-sm font-medium text-gray-300 mb-4">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
};

export default DashboardSection;
