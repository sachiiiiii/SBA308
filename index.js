// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// Your goal is to analyze and transform this data such that the output of your program is an array of objects, 
// each containing the following information in the following format:
/*
{
    // the ID of the learner for which this data has been collected
    "id": number,
    // the learner’s total, weighted average, in which assignments
    // with more points_possible should be counted for more
    // e.g. a learner with 50/100 on one assignment and 190/200 on another
    // would have a weighted average score of 240/300 = 80%.
    "avg": number,
    // each assignment should have a key with its ID,
    // and the value associated with it should be the percentage that
    // the learner scored on the assignment (submission.score / points_possible)
    <assignment_id>: number,
    // if an assignment is not yet due, it should not be included in either
    // the average or the keyed dictionary of scores
}
*/

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

// This is the main function that takes the input data.
function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmission) {
    // The logic is wrapped in a try...catch block to handle potential errors.
    try {
        if (CourseInfo.id !== AssignmentGroup.course_id) {
            throw new Error("Course ID mismatch: Invalid assignment group.");
        }
        if (!Array.isArray(LearnerSubmission)) {
            throw new Error("LearnerSubmissions argument must be an array.");
        }
        // Check that CourseInfo and AssignmentGroup arguments are objects
        if (typeof CourseInfo !== "object" && CourseInfo !== null && !Array.isArray(CourseInfo)) {
            throw new Error("CourseInfo argument must be an object.");
        }
        if (typeof AssignmentGroup !== "object" && AssignmentGroup !== null && !Array.isArray(AssignmentGroup)) {
            throw new Error("AssignmentGroup argument must be an object.");
        }
        // processLearnerData() is invoked to transform the data.
        return processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmission);

    } catch (error) {
        console.error("Learner data could not be processed:", error.message);
        return []; // Return an empty array in case of an error
    }
}
function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmission) {
    const learnerScores = {};

    // First, process the learner submissions
    LearnerSubmission.forEach(submission => {
        // Find the assignment associated with this submission
        let assignment = AssignmentGroup.assignments.find(hw => hw.id === submission.assignment_id);

        if (!assignment) {
            return; // Skip if assignment not found
        }
        
        //check if assignment is due.
        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(submission.submission.submitted_at);
        const currentDate = new Date();

        if (dueDate > currentDate) {
          return; //skip if assignment is not due.
        }

        let adjustedScore = submission.submission.score;
        if (submittedDate > dueDate){
          adjustedScore = Math.max(0,score - (assignment.points_possible * 0.1));
        }

        if (!learnerScores[learner_id]) {
            learnerScores[learner_id] = { id: learner_id, avg: 0, totalPoints: 0, totalEarned: 0 };
        }

        if (assignment.points_possible === 0) {
            return; // Avoid division by zero
        }

        learnerScores[learner_id][assignment.assignment_id] = adjustedScore / assignment.points_possible;
        learnerScores[learner_id].totalPoints += assignment.points_possible;
        learnerScores[learner_id].totalEarned += adjustedScore;
    });

    // Calculate the weighted average
    const results = Object.values(learnerScores).map(learner => {
        learner.avg = learner.totalPoints > 0 ? learner.totalEarned / learner.totalPoints : 0;
        delete learner.totalPoints;
        delete learner.totalEarned;
        return learner;
    });

    return results;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);