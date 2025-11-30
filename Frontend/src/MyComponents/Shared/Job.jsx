import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkMinus, MapPin, Briefcase, IndianRupee } from 'lucide-react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setSavedJobs } from '@/Redux/authSlice'
import { useDispatch } from 'react-redux'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

const Job = ({ job, unSave, onUnsave }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // States manages ai summary
    const [summary, setSummary] = useState('')  // Stores summary
    const [openAiDialog, setOpenAiDialog] = useState(false) // Dialog visibility
    const [aiLoading, setAiLoading] = useState(false)  // Manages loading state


    // Save job API call
    const saveForLater = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/job/saveForLater',
                { jobId: job._id },
                { withCredentials: true }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setSavedJobs(res.data.savedJobs))
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save job")
            console.error(err)
        }
    }

    // Unsave job API call and remove from UI by calling onUnsave
    const unSaveJob = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/job/unSaveJob',
                { jobId: job._id },
                { withCredentials: true }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setSavedJobs(res.data.savedJobs))
                if (onUnsave) onUnsave(job._id) // Remove from UI instantly
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to unsave job")
            console.error(err)
        }
    }

    // Handler to get AI summary
    const SummarizeJob = async () => {
        try {
            setOpenAiDialog(true)
            setAiLoading(true)

            const summary = await axios.post(
                'http://localhost:3000/ai/chat/get-summarize',
                { job: job },
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

    // Calculate days ago utility
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime)
        const currentTime = new Date()
        const timeDiff = currentTime - createdAt
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    }

    return (
        <div className="w-[320px] bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg 
                    hover:shadow-indigo-900/40 transition-all duration-300 group">

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    {daysAgoFunction(job?.createdAt) === 0
                        ? "Today"
                        : `${daysAgoFunction(job?.createdAt)} day(s) ago`}
                </p>

                {unSave ? (
                    <Button
                        onClick={unSaveJob}
                        variant="outline"
                        size="icon"
                        className="rounded-full border-gray-700 hover:bg-[#df1f1f]/20 text-red-400"
                    >
                        <BookmarkMinus className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={saveForLater}
                        variant="outline"
                        size="icon"
                        className="rounded-full border-gray-700 hover:bg-[#6A38C2]/20 text-gray-300"
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Company Section */}
            <div className="flex items-center gap-4 my-4">
                <div className="p-2 border border-gray-700 rounded-md">
                    <Avatar className="w-12 h-12 bg-gray-800">
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                    </Avatar>
                </div>

                <div className="w-full truncate">
                    <h2 className="text-lg font-semibold text-gray-100 truncate">
                        {job?.title}
                    </h2>
                    <p className="text-sm text-gray-400 font-medium truncate">
                        {job?.company?.name}
                    </p>
                </div>
            </div>

            {/* Job Details */}
            <div className="mt-3 space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-[#6A38C2]" />
                    <span>{job?.location}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                    <Briefcase className="w-4 h-4 text-[#6A38C2]" />
                    <span>{job?.experienceLevel} year(s) experience</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                    <IndianRupee className="w-4 h-4 text-[#6A38C2]" />
                    <span>{job?.salary} LPA</span>
                </p>
            </div>

            {/* CTA */}
            <div className='flex items-center justify-between'>
                {/* Ai Button */}
                <div className="mt-5">
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

                {/* Detail button */}
                <div className="mt-5 flex justify-end">
                    <Button
                        onClick={() => navigate(`/job/description/${job._id}`)}
                        className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-5 py-2"
                    >
                        View Details
                    </Button>
                </div>
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
    )
}

export default Job
