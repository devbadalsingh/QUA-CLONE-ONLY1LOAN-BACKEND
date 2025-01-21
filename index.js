import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/db.js";
import "dotenv/config.js";
import morgan from "morgan";
import { join } from "path";
import accountRouter from "./routes/AccountRouter.js";
import applicantRouter from "./routes/ApplicantRouter.js";
import applicationRouter from "./routes/ApplicationRouter.js";
import appRouter from "./routes/AppRouter.js";
import collectionRouter from "./routes/CollectionRouter.js";
import leadRouter from "./routes/LeadsRouter.js"; // Import routes
import employeeRouter from "./routes/EmployeesRouter.js";
import verifyRouter from "./routes/VerifyRouter.js";
import sanctionRouter from "./routes/SanctionRouter.js";
import disbursalRouter from "./routes/DisbursalRouter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { requireSessionToken } from "./middleware/authMiddleware.js";

const PORT = process.env.PORT || 3000;
connectDB();

const app = express();

// Middleware
// CORS configuration
var corsOption = {
    origin: [
        "https://www.only1loan.com",
        "https://only1loan.com",
        "http://localhost:5173",
        "https://www.crm.only1loan.com",
        "https://crm.only1loan.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOption));
app.use(
    session({
        secret: process.env.SESSION_KEY, // Replace with a secure, random string
        resave: false, // Avoid resaving session variables if they haven't changed
        saveUninitialized: false, // Don't save uninitialized sessions
        cookie: {
            httpOnly: true, // Helps prevent XSS attacks
            secure: false, // Use HTTPS in production
            maxAge: 5 * 60 * 1000, // 5 minute
        },
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookie parser middlerware

// Logging middleware (optional)
app.use(morgan("dev")); // Log HTTP requests

// Serving static file..............
app.use(express.static(join(process.cwd(), "public")));
// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for EJS templates
app.set("views", join(process.cwd(), "views"));

// Routes
app.get("/", (req, res) => {
    res.send("API is running.......");
});
app.get(`/verify-aadhaar/:id`, (req, res) => {
    res.render("otpRequest");
});
app.get(`/otp-page/:id`, (req, res) => {
    res.render("otpInput");
});
app.get(`/otp-success/:id`, (req, res) => {
    res.render("otpSuccess");
});

app.use("/api/mobile", appRouter); // Use the mobile routes
app.use("/api/accounts", accountRouter); // Use the account routes
app.use("/api/applications", applicationRouter); // Use the application routes
app.use("/api/applicant", applicantRouter); // Use the applicant's routes
app.use("/api/collections", collectionRouter); // Use the collection routes
app.use("/api/disbursals", disbursalRouter); // Use the disbursal routes
app.use("/api/employees", employeeRouter); // Use the employee routes
app.use("/api/leads", leadRouter); // Use the lead routes
app.use("/api/sanction", sanctionRouter); // Use the sanction letter
app.use("/api/verify", verifyRouter); // Use the verify routes sevice to verify PAN and aadhaar

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
