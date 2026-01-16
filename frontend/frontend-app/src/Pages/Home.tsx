import { Link } from "react-router-dom";

function Home()  {
  
    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <h1 className="fw-bold mb-0">Keuzemodule kiezen</h1>
                        <h1 className="fw-bold mb-0">Eenvoudiger</h1>
                        <h1 className="fw-bold mb-0">Duidelijker</h1>
                        <h1 className="fw-bold mb-0">Slimmer</h1>
                        <h1 className="fw-bold mb-4">Met AI</h1>
                    
                        <p className="lead">
                            Ontworpen door Avans
                        </p>
                    </div>
                </div>
                
                <div className="row mt-5 g-4">
                    <div className="col-12 col-md-6">
                        <Link to="/allmodules?showFavorites=0" type="button" className="btn btn-custom-red btn-lg w-100 p-4">
                            <strong style={{fontSize: '1.3rem'}}>Bekijk alle modules</strong>
                        </Link>
                    </div>
                    <div className="col-12 col-md-6">
                        <Link to="/recommendations" type="button" className="btn btn-custom-ai btn-lg w-100 p-4 position-relative">
                            <strong style={{fontSize: '1.3rem'}}>AI-powered suggesties</strong>
                        </Link>
                    </div>
                </div>
                
                <div className="row mt-5 g-4">
                    <div className="col-12 col-md-6">
                        <h4 className="fw-bold mb-3">Klassieke modulekeuze</h4>
                        <p>Op deze pagina kun je alle beschikbare modules rustig bekijken. Je ziet per module wat de inhoud is, wat je leert en voor wie de module bedoeld is. Door te scrollen en te vergelijken kun je zelf ontdekken welke modules aansluiten bij jouw interesses en niveau. Deze manier van kiezen geeft je volledige controle en is ideaal als je al een idee hebt van wat je wilt, of als je graag alles overzichtelijk naast elkaar ziet. Neem de tijd om de modules door te lezen en maak een keuze die het beste past bij jouw leerroute en toekomstplannen.</p>
                    </div>
                    <div className="col-12 col-md-6">
                        <h4 className="fw-bold mb-3">Slimme AI-assistentie</h4>
                        <p>Weet je nog niet precies welke module bij je past? Dan helpt onze slimme AI-assistent je op weg. Op basis van jouw interesses, niveau en doelen stelt de AI een persoonlijke top 5 van modules voor. Deze suggesties zijn bedoeld als hulpmiddel en geven je inspiratie, maar zijn geen definitieve keuzes. De AI kan zich vergissen en kent jou niet zoals jij jezelf kent. Gebruik de aanbevelingen daarom als startpunt om verder te ontdekken welke modules echt bij jou passen.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home