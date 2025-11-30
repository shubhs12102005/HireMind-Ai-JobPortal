import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button';
import { setRelatedJobs, setSingleJob } from '@/Redux/jobSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { IoBagAddOutline } from "react-icons/io5";
import { PiClockClockwiseBold } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { Bookmark, BookmarkMinus, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


import Job from './Job';
import { setSavedJobs } from '@/Redux/authSlice';

const JobDescription = () => {
    // State to track if job is saved or not
    const [isSaved, setIsSaved] = useState(false);

    const params = useParams();
    const jobId = params.id;

    const dispatch = useDispatch();
    const { singleJob } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const auth = useSelector((state) => state.auth);

    // States manages ai summary
    const [summary, setSummary] = useState('')  // Stores summary
    const [openAiDialog, setOpenAiDialog] = useState(false) // Dialog visibility
    const [aiLoading, setAiLoading] = useState(false)  // Manages loading state

    const checkApplied = (applications) => {
        return applications.some(application =>
            application.applicant === user?._id || application.applicant?._id === user?._id
        );
    };

    const isIntiallyApplied = checkApplied(singleJob?.applications || []);
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [relatedJobs, setRelatedJobs] = useState([])

    // Handler to Apply for the job
    const handleApply = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/application/apply/${jobId}`, { withCredentials: true })
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success("Successfully applied for the job");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in applying job");
        }
    }

    // Save for later job
    const saveForLater = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/job/saveForLater",
                { jobId },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setSavedJobs(res.data.savedJobs));
                setIsSaved(true);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save job");
        }
    };

    // Unsave job
    const unSaveJob = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/job/unSaveJob",
                { jobId },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setSavedJobs(res.data.savedJobs));
                setIsSaved(false);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to unsave job");
        }
    };

    // Handler to get AI summary
    const SummarizeJob = async () => {
        try {
            setOpenAiDialog(true)
            setAiLoading(true)

            const summary = await axios.post(
                'http://localhost:3000/ai/chat/get-summarize',
                { job: singleJob },
                { withCredentials: true }
            );

            if (summary.data?.success) {
                setSummary(summary.data.summary);
            } else {
                toast.error("Failed to get summary from AI");
            }
        } catch (error) {
            console.log(error.response.data.message);
            toast.error("Failed to get summary from AI")
        } finally {
            setAiLoading(false)        // hide loader, show result
        }
    }

    // UseEffect to fetch single job and related jobs
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/job/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(checkApplied(res.data.job.applications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        const fetchRelatedJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/job/get/relatedjob/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setRelatedJobs(res.data.relatedJobs));
                    setRelatedJobs(res.data.relatedJobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
        fetchRelatedJobs();
    }, [jobId, dispatch, user?._id]);

    // UseEffect to check if job is saved
    useEffect(() => {
        if (auth?.savedJobs?.includes(jobId)) {
            setIsSaved(true);
        }
    }, [auth?.savedJobs, jobId]);

    // Handler that claculates days ago
    const getWeeksAgo = (dateString) => {
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffInMs = now - createdAt;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInDays < 7) {
            return diffInDays === 0 ? "Today" : `${diffInDays} day(s) ago`;
        } else {
            const weeks = Math.floor(diffInDays / 7);
            return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        }
    };

    return (
        <div className='bg-gray-900 text-gray-200'>
            <div className="min-h-screen flex flex-col items-center justify-start">
                <div className='max-w-4xl w-full'>

                    {/* Job Description Card */}
                    <div className='my-10 bg-gray-800 border border-gray-700 rounded-2xl p-8'>

                        {/* Header */}
                        <div className='bg-gray-700 p-5 rounded'>
                            <h1 className='font-bold text-2xl text-center text-white'>
                                {singleJob?.title}
                            </h1>
                        </div>

                        {/* Name & company logo */}
                        <div className='mt-5 flex justify-between'>
                            <div>
                                <h1 className='text-lg font-semibold text-white'>{singleJob?.title}</h1>
                                <h2 className='text-md font-bold text-gray-400'>{singleJob?.company?.name}</h2>
                            </div>
                            <div>
                                <img
                                    className='w-[70px] h-[70px]'
                                    src={singleJob?.company?.logo}
                                    alt={`${singleJob?.company?.name} Logo`}
                                />

                                <Button
                                    onClick={isSaved ? unSaveJob : saveForLater}
                                    variant="outline"
                                    className={`ml-4 flex items-center mt-4 gap-2 border-gray-600 
                                   ${isSaved ? "text-red-400 hover:bg-red-600/20" : "text-gray-300 hover:bg-[#6A38C2]/20"}`}
                                >
                                    {isSaved ? (
                                        <>
                                            <BookmarkMinus className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Location */}
                        <div className='flex gap-1 items-center mt-3 text-gray-400'>
                            <CiLocationOn />
                            <p>{singleJob?.location}</p>
                        </div>

                        {/* Details */}
                        <div className='mt-5 flex gap-18 text-gray-400'>
                            <div>
                                <div className='flex items-center gap-1 font-semibold'>
                                    <CiMoneyBill />
                                    <p>CTC (Annual)</p>
                                </div>
                                <p>{singleJob?.salary}</p>
                            </div>
                            <div>
                                <div className='flex items-center gap-1 font-semibold'>
                                    <IoBagAddOutline />
                                    <p>Experience</p>
                                </div>
                                <p>{singleJob?.experienceLevel} year(s)</p>
                            </div>
                        </div>

                        {/* Job posted Date / Ai Summarize  */}
                        <div className='flex items-center justify-between gap-2 mt-4'>
                            {/* Job posted Date Badge */}
                            <div>
                                <Badge className={'bg-gray-700 px-4 py-1 text-gray-400'} variant="ghost">
                                    <h1 className='text-md flex items-center'>
                                        <PiClockClockwiseBold className='text-lg mr-1' />
                                        Posted
                                        <span className='ml-1 font-normal text-gray-400'>
                                            {getWeeksAgo(singleJob?.createdAt)}
                                        </span>
                                    </h1>
                                </Badge>
                            </div>

                            {/* Ai Button */}
                            <div className="">
                                <Button
                                    onClick={SummarizeJob}
                                    className="relative px-5 py-2 flex items-center gap-2 bg-[#020617] hover:bg-[#020617] text-slate-100 font-medium
                                border border-indigo-500/40 shadow-[0_0_14px_rgba(79,70,229,0.45)] transition-all duration-200 rounded-full
                                ">
                                    <span className="absolute inset-0 rounded-full bg-indigo-500/15 blur-md pointer-events-none" />
                                    <Sparkles className="w-4 h-4 text-indigo-300" />
                                    <span className="text-sm tracking-wide">Ask AI</span>
                                </Button>
                            </div>

                            {/* AI Summary Dialog */}
                            <Dialog open={openAiDialog} onOpenChange={setOpenAiDialog}>
                                <DialogContent className="sm:max-w-[500px] bg-gray-900 text-gray-100">
                                    {/* Header */}
                                    <DialogHeader>
                                        <DialogTitle>AI Job Summary</DialogTitle>
                                    </DialogHeader>

                                    {aiLoading ? (
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <div className="h-8 w-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                            <p className="mt-3 text-sm text-gray-400">
                                                Generating summary, please wait...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm text-gray-200 whitespace-pre-line">
                                            {summary || "No summary available."}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* No of applicants */}
                        <div className='flex items-center justify-between gap-2 mt-4'>
                            <h1 className='text-md flex items-center font-semibold text-gray-400'>
                                <GoPeople className='text-xl mr-1' />
                                <span className='ml-1 '>
                                    {singleJob?.applications.length} Applicants
                                </span>
                            </h1>

                            {/* Apply button */}
                            <Button
                                onClick={isApplied ? null : handleApply}
                                disabled={isApplied}
                                className={`px-8 py-6 rounded-lg ${isApplied
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-[#3394ee] hover:bg-[#1c69ce]'
                                    }`}>
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </div>

                        {/* Job Description */}
                        <hr className='border-gray-600 my-8' />
                        <h1 className='font-semibold text-lg text-white'>About the Job</h1>

                        {/* Responsibilities */}
                        <div className='my-4 font-semibold text-gray-300'>
                            <h1 className='mb-4'>Key Responsibilities :</h1>
                            <div className='font-normal text-gray-400'>
                                {singleJob?.responsibilities.map((req, index) => (
                                    <p key={index}>{index + 1}. {req}</p>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className='mt-8 font-semibold text-gray-300'>
                            <h1 className='mb-4'>Skill(s) Required :</h1>
                            <div className='flex flex-wrap gap-2'>
                                {singleJob?.skills.map((skill, index) => (
                                    <Badge key={index} className={'bg-[#6A38C2] text-gray-900'}>
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className='my-4 font-semibold text-gray-300'>
                            <h1 className='mb-4'>Other Requirements :</h1>
                            <div className='font-normal text-gray-400'>
                                {singleJob?.requirements.map((req, index) => (
                                    <p key={index}>{index + 1}. {req}</p>
                                ))}
                            </div>
                        </div>

                        {/* Salary */}
                        <div className='my-4'>
                            <h1 className='text-lg font-semibold text-gray-300'>Salary :</h1>
                            <h1 className='text-gray-200'>Annual CTC: {singleJob?.salary} LPA</h1>
                        </div>

                        {/* Number of Openings */}
                        <div className='my-4'>
                            <h1 className='text-lg font-semibold text-gray-300'>Number of Openings :</h1>
                            <h1 className='text-gray-200'>{singleJob?.position}</h1>
                        </div>

                        {/* About Company */}
                        <div>
                            <h1 className='text-lg font-semibold text-gray-200'>
                                About {singleJob?.company?.name}
                            </h1>
                            <p className='text-gray-400'>{singleJob?.company?.description}</p>
                        </div>

                        <hr className='border-gray-600 my-8' />

                        {/* Related Jobs */}
                        <h1 className='text-white font-bold mb-4'>Related Jobs</h1>
                        <div className='flex flex-wrap gap-4'>
                            {relatedJobs.length > 0 ? (
                                relatedJobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))
                            ) : (
                                <p className="text-gray-500">No related jobs found.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default JobDescription
