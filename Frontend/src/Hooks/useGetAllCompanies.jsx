import { setCompanies } from '@/Redux/companySlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const getAllCompanies = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/company/get`, {withCredentials:true});
                console.log(res);
                
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                } 
            } catch (error) {
                console.log(error);
            }
        }
        getAllCompanies();
    }, [])
}

export default useGetAllCompanies