import styles from "./auth.module.scss"
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword, validateEmail } from "../../services/authService";


const Forgot = () => {
  const [email, setEmail] = useState("")

  const forgot = async (e) => {
    e.preventDefault()
    if (!email) {
      return toast.error("Entra un email")
    }
    if (!validateEmail(email)) {
      return toast.error("Por favor ingrese un correo valido");
    }

    const userData = {
      email,
    };

    await forgotPassword(userData);
    setEmail("");
  };

  return (
    <div className={`container ${styles.auth}`} >
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Olvido Contraseña</h2>
          <form onSubmit={forgot}>
            <input type="email" placeholder="Correo" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <button type="submit" className="--btn --btn-primary --btn-block">Enviar Correo de Recuperación</button>
            <div className={styles.links}>
              <p>
                <Link to="/">-Inicio</Link>

              </p>
              <p>
                <Link to="/login">-Acceder</Link>
              </p>
            </div>
          </form>



        </div>
      </Card>
    </div>
  )

};

export default Forgot;