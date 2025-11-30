import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs } from '@/Redux/jobSlice'
import axios from 'axios'

const useGetAllJobs = () => {
    const dispatch = useDispatch()
    const { allJobs } = useSelector((state) => state.job)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/job/get', {
                    withCredentials: true,
                })
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs))
                }
            } catch (error) {
                console.error('Error fetching jobs:', error)
            }
        }

        // Fetch only once (no dependency on search query)
        if (!allJobs || allJobs.length === 0) {
            fetchJobs()
        }
    }, [dispatch, allJobs])
}

export default useGetAllJobs
