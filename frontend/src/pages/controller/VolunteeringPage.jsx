import  React, {useEffect, useState,useReducer} from 'react';
import { getVolunteerDetails, getVolunteers } from '../../services/volunteeringService';
import { VolunteeringWindow } from '../../Windows/VolunteeringWindow';
import { Footer } from '../../components/Controller/Footer';
import { LanguageBar } from '../../components/Controller/LanguageBar';
import { HeaderBar } from '../../components/Controller/HeaderBar';
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const intialState = { 
    volunteers: [],
};

const reducer = (state, action) => {
    let updatedVolunteers; 
    switch (action.type) {
        case 'Volunteers_Loaded':
            return { ...state, volunteers: action.payload };
        case 'Select_Volunteer':
            updatedVolunteers = state.volunteers.map(volunteer =>
                volunteer.id === action.payload.id ? action.payload : volunteer
            );
            return { ...state, volunteers: updatedVolunteers };
        default:
            return state;
    }
};

export const VolunteeringPage = () => {

    const [state,dispatch] = useReducer(reducer, intialState);
    const {volunteers} = state;
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [filteredVolunteers, setFilteredVolunteers] = useState({
        western:[],
        eastern:[],
        northern: [],
        southern: [],
        northWestern:[],
        northCentral: [],
        central:[],
        uva:[],
        sabaragamuwa:[],
    });
    useEffect(() => {
        const loadVolunteers = getVolunteers();
        console.log("Volunteers",volunteers);
        loadVolunteers.then(volunteers => {
            const western = volunteers.filter(volunteer => volunteer.province = "Weatern");
            const southern = volunteers.filter(volunteer => volunteer.province = "Southern");
            const eastern = volunteers.filter(volunteer => volunteer.province = "Eastern");
            const northWestern = volunteers.filter(volunteer => volunteer.province = "North Western");
            const northCentral = volunteers.filter(volunteer => volunteer.province = "North Central");
            const northern = volunteers.filter(volunteer => volunteer.province = "Northern");
            const central = volunteers.filter(volunteer => volunteer.province = "Central");
            const uva = volunteers.filter(volunteer => volunteer.province = "Uva");
            const sabaragamuwa = volunteers.filter(volunteer => volunteer.province = "Sabaragamuwa");

            dispatch({ type: 'Volunteers_Loaded', payload: loadVolunteers });
            setFilteredVolunteers({
                western:western,
                eastern:eastern,
                northern: northern,
                southern: southern,
                northWestern: northWestern,
                northCentral: northCentral,
                central:central,
                uva:uva,
                sabaragamuwa:sabaragamuwa,

            });
        });

    },   
    []);

    const handleProvinceClick = (province) => {
        setSelectedProvince(selectedProvince === province ? null : province);
    };

    const handleCardClick = async(volunteer) => {
        setSelectedVolunteer(volunteer);
        //const getVolunteer = await getVolunteerDetails(volunteer.id);
    };

    return(
        <div>
            <LanguageBar/>
            <HeaderBar/>
            <div>
                {selectedVolunteer?(
                    <VolunteeringWindow
                        volunteerID={selectedVolunteer.id}
                        fullName={selectedVolunteer.fullName}
                        age={selectedVolunteer.age}
                        nicNumber={selectedVolunteer.nicNumber}
                        email={selectedVolunteer.email}
                        phoneNumber={selectedVolunteer.phoneNumber}
                        address={selectedVolunteer.address}
                        skills={selectedVolunteer.skills}
                        motivation={selectedVolunteer.motivation}
                        experience={selectedVolunteer.experience} 
                    />

                ):(
                    <div className='p-10'>
                        <h1 className='text-center text-[2rem] text-ControllerPrim font-bold font-mono p-5'>Volunteers by Province</h1>
                        {Object.keys(filteredVolunteers).map(province => (
                            <div key={province}  className=' px-5 py-2 my-2 mx-20 text-[1.2rem] text-[white]  bg-slate-400 shadow-md rounded justify-center items-center text-center'>
                                <div className='flex flex-row text-center items-center justify-between text-[1.5rem] font-bold text-slate-900'>
                                    {province.charAt(0).toUpperCase() + province.slice(1)}
                                    <button className='focus:outline-none ' onClick={() => handleProvinceClick(province)}>
                                        {selectedProvince === province ? (
                                            <IoIosArrowDropupCircle className='w-10 h-10'/>
                                        ) : (
                                            <IoIosArrowDropdownCircle className='w-10 h-10'/>
                                        )}
                                    </button>
                                </div>
                            
                                {selectedProvince === province && (
                                    <div>
                                        <table className='flex-col w-full'>
                                            <thead className='bg-slate-600'>
                                                <tr className='text-white'>
                                                    <th className='p-2'>Name</th>
                                                    <th className='p-2'>Age</th>
                                                    <th className='p-2'>Address</th>
                                                    <th className='p-2'>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredVolunteers[province].map(volunteer =>(
                                                    <tr key={volunteer.id} onClick={() => handleCardClick(volunteer)} className='bg-slate-500  gap-10 hover:bg-secondary hover:text-black'>
                                                        <td>{volunteer.fullName}</td>
                                                        <td>{volunteer.age}</td>
                                                        <td>{volunteer.address}</td>
                                                        <td>{volunteer.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                )}

            </div>
            <Footer/>

        </div>
    );
};