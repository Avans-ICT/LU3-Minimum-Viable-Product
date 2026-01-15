function NotFound() {
    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="mb-3">Pagina niet gevonden</h2>
                <p className="text-muted mb-4">
                    De pagina die u probeert te bezoeken bestaat niet of is verplaatst.
                </p>
                <a href="/" className="btn btn-primary">
                    Terug naar de homepage
                </a>
            </div>
        </div>
    );
}

export default NotFound
