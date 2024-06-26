import styles from "./auth.module.scss"
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";


const initialState = {
    email: "",
    password: "",
}


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(initialState);
    const { email, password } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    const login = async (e) => {
        e.preventDefault()
        console.log(formData);

        if (!email || !password) {
            return toast.error("Todos los campos son requeridos");
        }
        if (!validateEmail(email)) {
            return toast.error("Por favor ingrese un correo valido");
        }
        const userData = {
            email, password,
        };
        setIsLoading(true)
        try {
            const data = await loginUser(userData);
            console.log(data);
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_NAME(data.name));
            navigate("/dashboard");
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className={`container ${styles.auth}`} >
            {isLoading && <Loader/>}
            <Card>
                <div className={styles.form}>
                    <div className="--flex-center">
                        <BiLogIn size={35} color="#999" />
                    </div>
                    <h2>Acceder</h2>
                    <form onSubmit={login}>
                        <input type="email" placeholder="Correo" required name="email" value={email} onChange={handleInputChange} />
                        <input type="password" placeholder="Contraseña" required name="password" value={password} onChange={handleInputChange} />
                        <button type="submit" className="--btn --btn-primary --btn-block">Acceder</button>
                    </form>
                    <Link to="/forgot">Olvido Contraseña?</Link>

                    <span className={styles.register}>
                        <Link to="/">Inicio</Link>
                        <p> &nbsp; No tiene una Cuenta? &nbsp;</p>
                        <Link to="/register">Registrese</Link>
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Login;