import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import Course from "../models/Course.js";
import Content from "../models/Content.js";
import Enrollment from "../models/Enrollment.js";
import Discussion from "../models/Discussion.js";
import Quiz from "../models/Quiz.js";
const router = express.Router();
router.post(
  "/register",
  [
    body("username", "Username is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({ username, email, password });

      const salt = await bcrypt.genSalt(13);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { user: { id: user.id, role: user.role } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post(
  "/courses",
  auth,
  authorize(["teacher", "admin"]),
  async (req, res) => {
    const { title, description } = req.body;
    try {
      const course = new Course({
        title,
        description,
        instructor: req.user.id,
      });
      await course.save();
      res.json(course);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Course update route
router.put(
  "/courses/:id",
  auth,
  authorize(["teacher", "admin"]),
  async (req, res) => {
    const { title, description } = req.body;
    try {
      let course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ msg: "Course not found" });
      if (course.instructor.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
      course = await Course.findByIdAndUpdate(
        req.params.id,
        { $set: { title, description } },
        { new: true }
      );
      res.json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Add content to the course
router.post(
  "/courses/:courseId/content",
  auth,
  authorize(["teacher", "admin"]),
  async (req, res) => {
    const { type, contentURL, description } = req.body;
    try {
      const content = new Content({
        course: req.params.courseId,
        type,
        contentURL,
        description,
      });
      await content.save();
      const course = await Course.findById(req.params.courseId);
      course.content.push(content);
      await course.save();
      res.json(content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post("/enrollments", auth, authorize(["student"]), async (req, res) => {
  const { courseId } = req.body;
  try {
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      enrollmentDate: Date.now(),
    });
    await enrollment.save();
    const course = await Course.findById(courseId);
    course.studentsEnrolled.push(req.user.id);
    await course.save();
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const courses = await Course.find({ studentsEnrolled: req.user.id });
    res.json({ user, courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/courses/:courseId/discussions", auth, async (req, res) => {
  const { comment } = req.body;
  try {
    const discussion = new Discussion({
      course: req.params.courseId,
      user: req.user.id,
      comment,
      timestamp: Date.now(),
    });
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/courses/:courseId/quizzes",
  auth,
  authorize(["teacher", "admin"]),
  async (req, res) => {
    const { questions, answers } = req.body;
    try {
      const quiz = new Quiz({
        course: req.params.courseId,
        questions,
        answers,
      });
      await quiz.save();
      res.json(quiz);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
