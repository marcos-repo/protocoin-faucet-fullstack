import { useState } from "react";
import { mint } from "./Web3Service";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [message, setMessage] = useState("");

  const [captcha, setCaptcha] = useState("");

  function connectMetamask() {
    if (captcha) {
      setMessage("Solicitando seus tokens. Por favor, aguarde.");

      mint()
        .then((tx) => setMessage("Tokens enviados. Tx: " + tx))
        .catch((error) =>
          setMessage(error.response ? error.response.data : error.message)
        );
    }
    else {
     setMessage("Primeiro, resolva o Captcha.");
    }
  }

  return (
    <>
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">ProtoCoin Faucet</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a
                className="nav-link fw-bold py-1 px-0 active"
                aria-current="page"
                href="#"
              >
                Home
              </a>
              <a className="nav-link fw-bold py-1 px-0" href="#">
                About
              </a>
            </nav>
          </div>
        </header>
        <main className="px-3">
          <h1>Obtenha ProtoCoins!</h1>
          <p className="lead">
            Uma vez por dia, ganhe 10.000 PTCs grátis, conectando sua Metamask
            abaixo:
          </p>
          <p className="lead">
            <a
              href="#"
              onClick={connectMetamask}
              className="btn btn-lg btn-light fw-bold border-white bg-white"
            >
              <img
                src="/assets/images/metamask.svg"
                width="48"
                alt="Metamask Logo"
              />
              Receber meus Tokens!
            </a>
          </p>
          <div style={{ display: "inline-flex" }}>
            <ReCAPTCHA
              sitekey={`${import.meta.env.VITE_RECAPTCHA_KEY}`}
              onChange={(value) => setCaptcha(value || "")}
            />
          </div>
          <p className="lead">{message}</p>
        </main>
        <footer className="mt-auto text-white-50">
          <p>
            Criado por{" "}
            <a href="https://github.com/marcos-repo" className="text-white">
              Marcos
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
