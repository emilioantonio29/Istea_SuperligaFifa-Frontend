import React, {useState, useContext, useEffect} from "react";
import Swal from "sweetalert2";
import { getOpenTournamentsPlayer } from "../../utils/hooks/general-axios";
import '../tournament-admin/containers-tournamentadmin.scss';
import { UserGlobalContextMemorySpace } from "../../contexts/user-contex";
import {BiLabel} from 'react-icons/bi';
import {BiErrorCircle} from 'react-icons/bi';
import {BiFileFind} from 'react-icons/bi';
import CommonSpacer from "../../components/common/spacer";
import { nameValidator, spaceValidator } from "../../utils/hooks/regex-validator";
import Overlay from "../../components/overlay";

const TournamentBuscadorContainer = () => {

    const {logout} = useContext(UserGlobalContextMemorySpace);

    const [loader, setLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [tournamentArray, setTournamentArray] = useState([]);
    const [buscador, setBuscador] = useState("");


    const getPlayerOpenTournaments = async (token) => {

        setLoader(true)
        let res = await getOpenTournamentsPlayer(token, "all")

        // console.log("res", res.data)

        if(res.status == 200){
            setTournamentArray(res.data.tournaments)
            setLoader(false);

        }else if(res.response.data.error.expired){
            logout();
            await Swal.fire({
                allowOutsideClick: false,
                icon: 'info',
                title: '<h5 style="color: #B88CB8">¡Tu sesión expiró!</h5>',
                text: "Por favor inicia sesión nuevamente.",
                confirmButtonColor: '#B88CB8',
                confirmButtonText: 'Continuar'
            })
        }else{
            setLoader(false);
            setErrorMsg("• Ocurrió un error al crear el torneo, por favor intenta en unos minutos.")
        }

    }

    const handleFindTournament = async (event) =>{
        event.preventDefault();
    }

    useEffect(()=>{
        //Mount: 
        let token = localStorage.getItem("superligaenc");

        getPlayerOpenTournaments(token)
    
        return () =>{
        //Unmount
    
        }
    }, [])

    return (  
        <>
            {loader ? <Overlay/>:null}
            <div className="d-flex flex-column align-items-center" style={{minHeight: "40vh", marginTop: "10vh", marginBottom: "5vh"}}>
                <form className="" onSubmit={handleFindTournament} style={{width: "50vw"}}>
                    <div className="form-group form-group-login d-flex justify-content-center">
                        {/* <input 
                            maxLength={15}
                            onChange={(e)=> 
                                setBuscador((!nombre ? nameValidator(e.target.value)  
                                : spaceValidator(e.target.value)))}  
                            value={buscador} 
                            type="text" 
                            className="form-control input-login" 
                            placeholder="Busca un torneo por nombre"
                        /> */}
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Busca un torneo por nombre" aria-label="Busca un torneo por nombre" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button"><BiFileFind size='35px' style={{color: "purple", fontWeight: "bolder"}}/></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="d-flex flex-column">
                    <CommonSpacer marginBottom="40px"/>
                    {loader ? 
                        <div style={{paddingTop: "10vh"}} className="d-flex flex-row justify-content-center">
                            <span style={{height: "25px", width: "25px"}} className="spinner-grow spinner-grow-sm"></span>
                            <span style={{height: "25px", width: "25px"}} className="spinner-grow spinner-grow-sm"></span>
                            <span style={{height: "25px", width: "25px"}} className="spinner-grow spinner-grow-sm"></span>
                        </div>
                    :
                        <>
                            {errorMsg ? 
                                <>
                                    <div style={{paddingTop: "10vh"}}>
                                        <p style={{color: "#B88CB8", textAlign:"center", fontSize: "18px", fontWeight: "bold"}}>{errorMsg}</p>
                                    </div>
                                </>
                                :
                                <>
                                    {tournamentArray ? 
                                    <>
                                        <div className="d-flex row justify-content-center" style={{paddingLeft: "20px", paddingRight: "20px"}}>
                                            {tournamentArray.length > 0 ? 
                                            <>
                                                {tournamentArray.map((data, index)=>{
                                                    return(
                                                        <div class="card card-tournamentadmin" key={index}>
                                                            <div class="card-body">
                                                                <div className="d-flex flex-column" style={{width: "100%"}}>
                                                                    <h5 class="card-title">{data.nombre} </h5>
                                                                    <h6 class="card-subtitle mb-2 text-muted">{data.owner}</h6>
                                                                    {data.cerrado ?
                                                                        <p><span><BiLabel size='14px' style={{color: "red", fontWeight: "bolder"}}/></span> cerrado</p>
                                                                        :
                                                                        data.cerrado == false && data.torneoid == "" ?
                                                                        <p><span><BiLabel size='14px' style={{color: "purple", fontWeight: "bolder"}}/></span> pendiente</p>
                                                                        :
                                                                        data.cerrado == false && data.torneoid !== "" ?
                                                                        <p><span><BiLabel size='14px' style={{color: "green", fontWeight: "bolder"}}/></span> en curso</p>
                                                                        :
                                                                        <p><span><BiErrorCircle size='14px' style={{color: "red", fontWeight: "bolder"}}/></span> error</p>
                                                                    }
                                                                </div>
                                                                <h6 class="card-subtitle mb-2 text-muted"><span style={{fontWeight: "bolder"}}>Liga: </span>{data.liga}</h6>
                                                                <h6 class="card-subtitle mb-2 text-muted"><span style={{fontWeight: "bolder"}}>Jugadores: </span>{data.cantidadjugadores}</h6>
                                                                {/* <p class="card-text">Lorem Ipsum description.</p> */}
                                                                <CommonSpacer marginBottom="20px"/>
                                                                <div className="d-flex justify-content-center">
                                                                    <button className="btn btn-cardtournament">Inscribirse</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                            :
                                            <>
                                                <div style={{paddingTop: "10vh"}}>
                                                    <p style={{color: "#B88CB8", textAlign:"center", fontSize: "18px", fontWeight: "bold"}}>• No se encontraron torneos disponibles para inscripción.</p>
                                                </div>
                                            </>
                                            }
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div style={{paddingTop: "10vh"}}>
                                            <p style={{color: "#B88CB8", textAlign:"center", fontSize: "18px", fontWeight: "bold"}}>• Ocurrió un error al crear el torneo, por favor intenta en unos minutos.</p>
                                        </div>
                                    </>
                                    }
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default TournamentBuscadorContainer;