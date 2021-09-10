import Header from "./Header";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <main className="py-5">{children}</main>
    </>
  );
};

export default Layout;
