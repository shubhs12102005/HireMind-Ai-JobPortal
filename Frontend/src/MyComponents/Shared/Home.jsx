import React, { useEffect } from 'react'
import Navbar from '../Main/Navbar'
import HeroSection from './HeroSection'
import CategoryCrousel from './CategoryCrousel'
import LatestJobs from './LatestJobs'
import Footer from '../Main/Footer'
import useGetAllJobs from '@/Hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import HowItWorks from './HowItWorks'
import JobsBySkill from './JobsBySkill'


const Home = () => {
  // Custom Hook to get All Jobs
  useGetAllJobs();

  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
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