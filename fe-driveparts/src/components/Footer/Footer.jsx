import React from "react"
import "./Footer.css"
import 'bootstrap/dist/css/bootstrap.min.css'

const Footer = () => {
  return (
    <footer className="custom-footer bg-dark text-white py-4">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <a href="/" className="footer-link me-3">
              Disclaimer
            </a>
            <a href="/" className="footer-link me-3">
              Privacy Policy
            </a>
            <a href="/" className="footer-link">
              Cookie Policy
            </a>
          </div>

          <div className="col-12 col-md-6 text-center text-md-end">
            <span>
              2025 © All Rights Reserved. Powered by{" "}
              <a
                href="/" className="footer-link">
                Ghenzo
              </a>{" "}
              VAT ID 00000000000
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
