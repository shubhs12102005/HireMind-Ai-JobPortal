import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Job from './Job';

const JobsBySkill = () => {

    const userskill = useSelector((state) => state.auth?.user?.profile?.skills)
    console.log("From JobsBySkil: ", userskill);

    const [jobs, setJobs] = useState('')


    useEffect(() => {
        const fetchJobsBySkill = async () => {
            try {
                const jobs = await axios.post(
                    "http://localhost:3000/api/job/getJobsBySkill",
                    { skills: userskill },    // <-- send skills here
                    { withCredentials: true }  // <-- send cookies/JWT
                );

                console.log("From JobsBySkill.......:", jobs.data.jobs);
                setJobs(jobs.data.jobs);

            } catch (error) {
                console.log(error);
            }
        };

        fetchJobsBySkill();
    }, []);

    return (
        <div>
            {jobs && (
                <div className="w-full max-w-7xl mx-auto bg-gray-950 px-6 py-10">

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Jobs Matching Your Skills
                    </h1>

                    {/* Jobs Grid */}
                    <div className="grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3 
                    gap-6 
                    place-items-center">

                        {jobs && jobs.length > 0 ? (
                            jobs.map((job) => (
                                <Job key={job._id} job={job} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center col-span-full">
                                No jobs found
                            </p>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}


export default JobsBySkill