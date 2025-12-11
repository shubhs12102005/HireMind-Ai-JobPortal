import React, { useEffect } from 'react'
import Navbar from '../Main/Navbar'
import HeroSection from './HeroSection'
import CategoryCrousel from './CategoryCrousel'
import LatestJobs from './LatestJobs'
import Footer from '../Main/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import HowItWorks from './HowItWorks'
import JobsBySkill from './JobsBySkill'
import { setAllJobs } from '@/Redux/jobSlice'
import axios from 'axios'


const Home = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate();

  const dispatch = useDispatch()
  const { allJobs } = useSelector((state) => state.job)

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
  }, [])

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/job/get`, {
          withCredentials: true,
        })
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs))
          console.log("From getAllJobs", res.data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      }
    }
    fetchAllJobs();
  }, [])

  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoryCrousel />
      <LatestJobs />
      <HowItWorks />
      <JobsBySkill />
      <Footer />
    </>
  )
}

export default Home