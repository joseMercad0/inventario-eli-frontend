import styles from "./auth.module.scss"
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";


const initialState ={
    name: "",
    email: "",
    password: "",
    password2: "",
}

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(initialState);
    const {name, email ,password ,password2} = formData;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setformData({...formData, [name]: value});
    };

    const register = async (e) => {
        e.preventDefault();

        if (!name || !email || !password){
            return toast.error("Todos los campos son requeridos")
        }
        if (password.length < 6){
            return toast.error("La Contraseña debe tener mas de 6 caracteres")
        }
        if (!validateEmail(email)){
            return toast.error("Por favor ingrese un correo valido")
        }
        if (password !== password2){
            return toast.error("Las Contraseñas no coinciden")
        }

        const userData = {
            name, email, password,
        };
        setIsLoading(true)
        try {
            const data = await registerUser(userData);
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_NAME(data.name));
            navigate("/dashboard");
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
            console.log(error.message);
        }
    };

    return <div className={`container ${styles.auth}`} >
        {isLoading && <Loader/> }
        <Card>
            <div className={styles.form}>
                <div className="--flex-center">
                    <TiUserAddOutline size={35} color="#999" />
                </div>
                <h2>Registrese</h2>
                 <form onSubmit={register}>
                    <input type="text" placeholder="Nombre" required name="name" value={name} onChange={handleInputChange}/>
                    <input type="email" placeholder="Correo" required name="email" value={email} onChange={handleInputChange}/>
                    <input type="password" placeholder="Contraseña" required name="password" value={password} onChange={handleInputChange} />
                    <input type="password" placeholder="Confirmar Contraseña" required name="password2" value={password2} onChange={handleInputChange}/>
                    <button type="submit" className="--btn --btn-primary --btn-block">Registrarse</button>
                 </form>
                 

                 <span className={styles.register}>
                    <Link to="/">Inicio</Link>
                    <p> &nbsp; Si ya tiene una Cuenta &nbsp;</p>
                    <Link to="/login">Inicie Sesion</Link>
                 </span>
            </div>
        </Card>
    </div>;

};

export default Register;