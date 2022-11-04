import React from "react";
import { Link } from "react-router-dom";
import s from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={s.divFondoLanding}>
      <h1 className={s.h1Lading}>Welcome to Videogame Center</h1>
      <div>
        <Link to="/home">
          <button className={s.btnLanding}>Start</button>
        </Link>
      </div>
    </div>
  );
}
