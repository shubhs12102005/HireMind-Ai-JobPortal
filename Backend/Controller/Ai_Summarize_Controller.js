import summarizeJob from "../utils/ai.summarizeJob.js";

const SummarizeJob = async (req, res) => {
    const job = req.body.job;

    if (!job) {
        return res.status(400).json({ error: "Job object is required" });
    }

    try {
        const aiResponse = await summarizeJob(job);

        return res.status(200).json({
            success: true,
            summary: aiResponse,
        });

    } catch (err) {
        console.error("SummarizeJob Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while summarizing job",
        });
    }
};

export default SummarizeJob;