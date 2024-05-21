import React, { useState } from 'react'
import "./Contact.scss"
import Card from '../../components/card/Card'
import { FaPhoneAlt, FaEnvelope, FaTwitter } from 'react-icons/fa'
import { GoLocation } from 'react-icons/go'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BACKEND_URL } from '../../services/authService'

const Contact = () => {
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const data = {
        subject,
        message
    }

    const sendEmail = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${BACKEND_URL}/api/contactus`, data)
            setSubject("")
            setMessage("")
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }
    return <div className='contact'>
        <h3 className='--mt'>Contactanos</h3>
        <div className='section'>
            <form onSubmit={sendEmail}>
                <Card cardClass="card">
                    <label>Asunto</label>
                    <input type='text' name='subject' placeholder='Titulo del Asunto' required value={subject} onChange={(e) => setSubject(e.target.value)} />
                    <label>Mensaje</label>
                    <textarea cols='30' rows='10' name='message' required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    <button className='--btn --btn-primary'>Enviar Mensaje</button>
                </Card>
            </form>
            <div className='details'>
                <Card cardClass={"card2"}>
                    <h3>Información de Contacto</h3>
                    <p>Puedes contactarnos mediante otros medios</p>
                    <div className="icons">
                        <span>
                            <FaPhoneAlt />
                            <p>51966253521</p>
                        </span>
                        <span>
                            <FaEnvelope />
                            <p>jose.mercado.c@tecsup.edu.pe</p>
                        </span>
                        <span>
                            <GoLocation />
                            <p>Arequipa, Perú</p>
                        </span>
                        <span>
                            <FaTwitter />
                            <p>@Jm12Arts</p>
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    </div>
}

export default Contact