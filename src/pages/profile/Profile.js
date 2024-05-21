import React, { useEffect, useState } from 'react'
import "./Profile.scss"
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch } from 'react-redux'
import { SET_NAME, SET_USER } from '../../redux/features/auth/authSlice'
import Card from '../../components/card/Card'
import { SpinnerImg } from '../../components/loader/Loader'
import { getUser } from '../../services/authService'
import { Link } from 'react-router-dom'

const Profile = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log("Getting user");
        setIsLoading(true)
        async function getUserData() {
            const data = await getUser()
            console.log(data)

            setProfile(data)
            setIsLoading(false)
            await dispatch(SET_USER(data))
            await dispatch(SET_NAME(data.name))
        }
        getUserData();
    }, [dispatch])

    return (
        <div className='profile --my2'>
            {isLoading && <SpinnerImg/>}
            <>
              {!isLoading && profile === null ? (
                 <p>Algo Salio Mal , Recarge la pagina..</p>
              ) : (
                  <Card cardClass={"card --flex-dir-column"}>
                      <span className="profile-photo">
                           <img src={profile?.photo} alt="perfil usuario" />
                      </span>
                      <span className='profile-data'>
                          <p> 
                            <b>Name:</b> {profile?.name}
                          </p>
                          <p> 
                            <b>Correo:</b> {profile?.email}
                          </p>
                          <p> 
                            <b>Telefono:</b> {profile?.phone}
                          </p>
                          <p> 
                            <b>Informacion:</b> {profile?.bio}
                          </p>
                          <div>
                              <Link to="/edit-profile">
                                 <button className='--btn --btn-primary'>Editar Perfil</button>
                              </Link>
                            </div> 
                          
                          
                      </span>
                  </Card>
              )}
            </>
        </div>
    )
}

export default Profile