import React, { useMemo } from 'react'
import Navbar from '../Main/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import useGetAllJobs from '@/Hooks/useGetAllJobs'

const Browse = () => {
  const { allJobs, searchedQuery } = useSelector((state) => state.job)
  useGetAllJobs()

  const filteredJobs = useMemo(() => {
    if (!allJobs) return []
    if (!searchedQuery) return allJobs
    const q = searchedQuery.toLowerCase()
    return allJobs.filter(job =>
      job.title?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    )
  }, [allJobs, searchedQuery])

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-2xl mb-8">Search Results ({filteredJobs.length})</h1>
        {filteredJobs.length === 0 ? (
          <p className="text-red-400 text-center">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center place-items-center">
            {filteredJobs.map(job => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
