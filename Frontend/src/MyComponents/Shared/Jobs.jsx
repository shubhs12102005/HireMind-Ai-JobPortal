import React, { useEffect, useState } from 'react'
import FilterCard from './FilterCard'
import Job from './Job'
import Navbar from '../Main/Navbar'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Footer from '../Main/Footer'

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((state) => state.job)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])

  // useGetAllJobs()

  useEffect(() => {
    if (!allJobs) return
    let jobs = [...allJobs]

    if (searchedQuery) {
      const q = searchedQuery.toLowerCase()
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) jobs = jobs.filter(job => job.category === selectedCategory)
    if (selectedLocation) jobs = jobs.filter(job => job.location === selectedLocation)

    setFilteredJobs(jobs)
  }, [allJobs, searchedQuery, selectedCategory, selectedLocation])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="sm:flex gap-5">
          <div className="hidden sm:flex w-1/5">
            <FilterCard
              onCategoryChange={setSelectedCategory}
              onLocationChange={setSelectedLocation}
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
            />
          </div>

          <div className="sm:hidden block text-right mr-6 mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline"><Filter /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[60%] sm:w-[300px] p-4">
                <FilterCard
                  onCategoryChange={setSelectedCategory}
                  onLocationChange={setSelectedLocation}
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 h-[98vh] overflow-y-auto pb-5 w-full max-w-7xl mx-auto flex justify-center items-start">
            {filteredJobs.length === 0 ? (
              <span className="text-gray-400">No jobs found.</span>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Footer />
      </div>
    </div>
  )
}

export default Jobs
