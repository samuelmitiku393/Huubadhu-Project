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
import ContactUs from "../models/ContactUs.js";
import Review from "../models/Reviews.js";
const router = express.Router();

// register route
router.post(
  "/register",
  [
    body("username", "Username is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    body("confirmPassword", "Please confirm your password").not().isEmpty(),
    body("role", "Role is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({ username, email, password, role });

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

// Login route
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

// route for creating a course
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

// route for displaying courese
router.get("/courses/:courseId", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add content to the course route
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

// course content route
router.get(
  "/courses/:courseId/contents",
  auth,
  authorize(["teacher", "admin", "student"]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId).populate(
        "content"
      );

      if (!course) {
        return res.status(404).json({ msg: "Course not found" });
      }

      res.json(course.content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// enrollment route
router.post("/enrollments", auth, async (req, res) => {
  const { courseId } = req.body;

  try {
    let course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    const isEnrolled = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (isEnrolled) {
      return res
        .status(400)
        .json({ msg: "You are already enrolled in this course" });
    }

    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
    });

    await enrollment.save();
    course.studentsEnrolled.push(req.user.id);
    await course.save();
    res.json({ msg: "Successfully enrolled in the course!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// dashboard route
router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let courses = [];
    let users = [];
    let contacts = [];

    if (user.role === "student") {
      courses = await Course.find({ studentsEnrolled: req.user.id }).select(
        "title description"
      );
    } else if (user.role === "teacher") {
      courses = await Course.find({ instructor: req.user.id }).select(
        "title description"
      );
    } else if (user.role === "admin") {
      courses = await Course.find().select("title description");
      users = await User.find().select("username role email");
      contacts = await ContactUs.find();
    }

    res.json({ user, courses, users, contacts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// course fetch
router.get("/courses/course-fetch", auth, async (req, res) => {
  try {
    // In your Express route file
    router.get("/courses/course-fetch", async (req, res) => {
      try {
        const courses = await Course.find(); // Fetch all courses
        res.json({ courses });
      } catch (error) {
        res.status(500).json({ msg: "Error fetching courses" });
      }
    });

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// discussion post route
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

// quiz post route
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

// contact us post route
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new ContactUs({
      name,
      email,
      message,
    });
    await newContact.save();
    res.status(201).json({ msg: "Message sent successfully" });
  } catch (err) {
    console.error(err.massage);
    res.status(500).send("Server error");
  }
});

// review post route
router.post("/reviews", async (req, res) => {
  const { courseId, userId, rating, comment } = req.body;

  if (!courseId || !userId || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newReview = new Review({
      courseId,
      userId,
      rating: Number(rating),
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ message: "Error creating review.", error: error.message });
  }
});

// Review content get route
router.get("/reviews/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ courseId })
      .populate("userId", "username")
      .select("rating comment createdAt userId")
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews.", error });
  }
});

// course delete route
router.delete(
  "/courses/:courseId",
  auth,
  authorize(["teacher", "admin"]),
  async (req, res) => {
    const { courseId } = req.params;

    try {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ msg: "Course not found" });
      }

      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ msg: "Not authorized" });
      }

      await Course.findByIdAndDelete(courseId);

      res.json({ msg: "Course removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// user delete route
router.delete(
  "/users/:userId",
  auth,
  authorize(["admin"]),
  async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      await User.findByIdAndDelete(userId);

      res.json({ msg: "User removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Search for courses by name route
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(query, "i");
    const courses = await Course.find({ title: { $regex: regex } })
      .select("title")
      .limit(10);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
