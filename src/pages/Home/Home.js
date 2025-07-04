import React from 'react';
import { TbCircleLetterE } from "react-icons/tb";
import { Link } from 'react-router-dom';
import './Home.scss';
import heroImg from '../../assets/inv-img.png';
import { ShowOnLogin, ShowOnLogout } from '../../components/protect/HiddenLink';


const Home = () => {
    return (
        <div className='home'>
            <nav className='container --flex-between'>
                <div className='logo'>
                    <TbCircleLetterE size={35} />
                </div>
                <ul className='home-links'>
                    <ShowOnLogout>
                        <li>
                            <Link to='/register'>Register</Link>
                        </li>
                    </ShowOnLogout>
                    <ShowOnLogout>

                        <li>
                            <button className='--btn --btn-primary'>

                                <Link to='/login'>Login</Link>
                            </button>
                        </li>
                    </ShowOnLogout>
                    <ShowOnLogin>
                    <li>
                        <button className='--btn --btn-primary'>

                            <Link to='/dashboard'>Dashboard</Link>
                        </button>
                    </li>
                    </ShowOnLogin>

                </ul>
            </nav>
            {/*HERO SECTION */}
            <section className='container hero'>
                <div className='hero-text'>
                    <h2>Inventario {"&"} Control de Stock </h2>
                    <p>Sistema de inventario para controlar y gestionar productos.
                        en el almacén en tiempo real e integrado para realizar
                        será más fácil desarrollar su negocio.</p>
                    <div className='hero-buttons'>
                        <button className='--btn --btn-secondary'>

                            <Link to='/dashboard'>Free Trial 1 Moth</Link>
                        </button>
                    </div>
                    <div className='--flex-start'>
                        <NumberText num="14k" text="Empresas usan" />
                        <NumberText num="23k" text="Usuario Activos" />
                        <NumberText num="500+" text="Partners" />
                    </div>
                </div>
                <div className='hero-image'>
                    <img src={heroImg} alt='Inventario' />
                </div>
            </section>
        </div>
    );
};

const NumberText = ({ num, text }) => {
    return (
        <div className='--mr'>
            <h3 className='--color-white'>{num}</h3>
            <p className='--color-white'>{text}</p>
        </div>
    )
};

export default Home;
