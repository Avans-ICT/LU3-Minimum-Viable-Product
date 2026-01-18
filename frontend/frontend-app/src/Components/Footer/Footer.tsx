const Footer = () => {
  return (
    <footer className="mt-auto py-4" style={{ backgroundColor: '#c5202b' }}>
      <div className="container">
        <div className="row">
          <div className="col text-center text-white">
            <p className="mb-0">&copy; {new Date().getFullYear()} Avans Hogeschool. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;