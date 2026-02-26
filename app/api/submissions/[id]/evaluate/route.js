
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Submission from "@/models/Submission";
import Event from "@/models/Event";
import { auth } from "@/lib/auth";
import { calculateWeightedScore, DEFAULT_SCORING_WEIGHTS } from "@/utils/scoring";

export async function POST(request, { params }) {
    try {
        const session = await auth();
        // Check if user is a judge or admin/organizer
        if (!session || !["judge", "admin", "organizer"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized: Judges, admins, or organizers only" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { feedback, criteriaScores } = body;

        // Verify query
        const submission = await Submission.findById(id);
        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Check if judge has already evaluated
        const existingEvaluation = submission.evaluations.find(
            (e) => e.judge.toString() === session.user.id
        );

        if (existingEvaluation) {
            return NextResponse.json({ error: "You have already evaluated this submission." }, { status: 400 });
        }

        const event = await Event.findById(submission.event).select("scoringWeights");
        const scoringWeights = event?.scoringWeights || DEFAULT_SCORING_WEIGHTS;
        const normalizedCriteriaScores = {
            innovation: Number(criteriaScores?.innovation ?? 0),
            technicalDepth: Number(criteriaScores?.technicalDepth ?? criteriaScores?.feasibility ?? criteriaScores?.execution ?? 0),
            impact: Number(criteriaScores?.impact ?? 0),
        };
        const finalScore = calculateWeightedScore(normalizedCriteriaScores, scoringWeights);

        // Add new evaluation
        submission.evaluations.push({
            judge: session.user.id,
            score: finalScore,
            feedback,
            criteriaScores: normalizedCriteriaScores,
            evaluatedAt: new Date(),
        });

        // Add judge to judgedBy list if not present
        if (!submission.judgedBy.includes(session.user.id)) {
            submission.judgedBy.push(session.user.id);
        }

        // Recalculate average score
        const totalEvaluations = submission.evaluations.length;
        const totalScore = submission.evaluations.reduce((sum, e) => sum + e.score, 0);
        submission.totalScore = totalScore;
        submission.averageScore = totalEvaluations > 0 ? totalScore / totalEvaluations : 0;

        await submission.save();

        return NextResponse.json({ message: "Evaluation submitted successfully", submission });
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
