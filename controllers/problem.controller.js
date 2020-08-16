const {
  Problem,
  ProblemVote,
  Testcase,
  Submission,
  sequelize,
} = require('../models');
const { Op, literal, QueryTypes } = require('sequelize');
const logger = require('../configs/logger').logger;

exports.createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    hasSolution,
    isPremium,
    testcases,
  } = req.body;
  const user = req.user;
  try {
    const problem = await Problem.create({
      title: title,
      description: description,
      difficulty: difficulty,
      hasSolution: hasSolution,
      isPremium: isPremium,
      authorId: user.id,
      authorUsername: user.username,
    });

    testcases.forEach(async (testcase) => {
      await Testcase.create({
        input: testcase.input,
        output: testcase.output,
        problemId: problem.id,
      });
    });

    return res.status(201).json({
      message: 'Create problem successfully',
      data: { problem: problem },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Cannot create problem',
      error: error.message,
    });
  }
};

exports.getProblems = async (req, res) => {
  const { difficulty, hasSolution, page } = req.query;
  let solution = '';
  if (hasSolution == 'true') {
    solution = true;
  } else if (hasSolution == 'false') {
    solution = false;
  }

  if (!page)
    return res
      .status(400)
      .json({ message: 'Cannot get the page number, please try again.' });

  const { count, rows } = await Problem.findAndCountAll({
    distinct: true,
    subQuery: false,

    attributes: [
      'id',
      'title',
      'description',
      'difficulty',
      'hasSolution',
      'is_premium',
      'authorUsername',
      [
        literal(
          `COUNT (DISTINCT(CASE WHEN Submissions.status = 'AC' THEN 1 END))`
        ),
        'AcceptCount',
      ],
      [
        literal(`COUNT (DISTINCT(CASE WHEN Submissions.id > 0 THEN 1 END))`),
        'TotalCount',
      ],
    ],

    include: [
      {
        model: Submission,
      },
    ],
    where: {
      difficulty: {
        [Op.like]: difficulty + '%',
      },
      hasSolution: {
        [Op.or]: hasSolution === '' ? [true, false] : [solution],
      },
    },
    group: ['Problem.id'],
    
  });
  return res.status(200).json({ count: count.length, problems: rows });
};
