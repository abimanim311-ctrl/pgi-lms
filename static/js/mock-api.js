/* =========================================================================
   Plant Green Inertia LMS — Mock API / Client-Side Database Interceptor
   ========================================================================= */

(function () {
  // ── Database Initialization ──────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const getRelativeDate = (offsetDays, timeStr = "23:59:00") => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return `${d.toISOString().slice(0, 10)} ${timeStr}`;
  };

  const initialCourses = [
  {
      "id": 1,
      "title": "Web Development",
      "description": "Build complete web applications by mastering both frontend interfaces and backend server logic.",
      "instructor": "Prof. Ravi Kumar",
      "thumbnail": null,
      "total_modules": 12,
      "total_hours": 48,
      "difficulty": "Intermediate",
      "category": "Development",
      "xp_reward": 500,
      "created_at": "2026-06-03 06:13:45",
      "google_form_url": "https://forms.gle/REPLACE_WITH_WEBDEV_FORM"
    },
    {
      "id": 2,
      "title": "Digital Marketing",
      "description": "Promote brands and drive growth using SEO, social media, content strategy, and online advertising",
      "instructor": "Dr. Priya Nair",
      "thumbnail": null,
      "total_modules": 10,
      "total_hours": 60,
      "difficulty": "Advanced",
      "category": "AI/ML",
      "xp_reward": 600,
      "created_at": "2026-06-03 06:13:45",
      "google_form_url": "https://forms.gle/REPLACE_WITH_AIML_FORM"
    },
    {
      "id": 3,
      "title": "UI/UX Design",
      "description": "Create intuitive, visually appealing digital experiences through user research, wireframing, and design principles.",
      "instructor": "Ms. Ananya Sharma",
      "thumbnail": null,
      "total_modules": 8,
      "total_hours": 32,
      "difficulty": "Beginner",
      "category": "Design",
      "xp_reward": 400,
      "created_at": "2026-06-03 06:13:45",
      "google_form_url": "https://forms.gle/REPLACE_WITH_UIUX_FORM"
    },
    {
      "id": 4,
      "title": "AI Digital Skills",
      "description": "Harness artificial intelligence tools and digital literacy to thrive in an AI-driven world.n",
      "instructor": "Dr. Arjun Mehta",
      "thumbnail": null,
      "total_modules": 6,
      "total_hours": 32,
      "difficulty": "Intermediate",
      "category": "Data Science",
      "xp_reward": 450,
      "created_at": "2026-06-03 06:13:45",
      "google_form_url": "https://forms.gle/REPLACE_WITH_DS_FORM"
    },
    {
      "id": 5,
      "title": "Soft Skills",
      "description": "Build essential interpersonal, communication, and leadership abilities to thrive in any professional environment.",
      "instructor": "Mr. Suresh Balan",
      "thumbnail": null,
      "total_modules": 8,
      "total_hours": 30,
      "difficulty": "Advanced",
      "category": "Cloud",
      "xp_reward": 550,
      "created_at": "2026-06-03 06:13:45",
      "google_form_url": "https://forms.gle/REPLACE_WITH_CLOUD_FORM"
    },
    {
      "id": 6,
      "title": "3D Printing",
      "description": "Design and fabricate real-world objects layer by layer using modern additive manufacturing techniques.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:54",
      "google_form_url": null
    },
    {
      "id": 7,
      "title": "Python",
      "description": "Learn the world's most versatile programming language for automation, web development, and data analysis.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:54",
      "google_form_url": null
    },
    {
      "id": 8,
      "title": "Employability",
      "description": "Develop the professional skills, communication, and confidence needed to succeed in today's job market.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:54",
      "google_form_url": null
    },
    {
      "id": 9,
      "title": "Cyber security",
      "description": "Protect systems, networks, and data from digital threats using ethical hacking and security best practices.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:54",
      "google_form_url": null
    },
    {
      "id": 10,
      "title": "VLSI",
      "description": "Design and integrate millions of electronic circuits onto a single microchip for modern hardware systems.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:54",
      "google_form_url": null
    },
    {
      "id": 11,
      "title": "Embedded systems",
      "description": "Program microcontrollers and hardware to build smart, real-world electronic devices and systems.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:55",
      "google_form_url": null
    },
    {
      "id": 12,
      "title": "Data Science",
      "description": "Extract meaningful insights from complex datasets using statistics, machine learning, and visualization.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:55",
      "google_form_url": null
    },
    {
      "id": 13,
      "title": "Cloud computing",
      "description": "Deploy, manage, and scale applications and infrastructure using platforms like AWS, Azure, and GCP.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:55",
      "google_form_url": null
    },
    {
      "id": 14,
      "title": "IOT",
      "description": "Connect everyday devices to the internet to build intelligent, automated smart systems and solutions.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:55",
      "google_form_url": null
    },
    {
      "id": 15,
      "title": "Drone Technology",
      "description": "Design, program, and operate unmanned aerial vehicles for real-world applications across industries.",
      "instructor": null,
      "thumbnail": null,
      "total_modules": 0,
      "total_hours": 0,
      "difficulty": "Beginner",
      "category": null,
      "xp_reward": 100,
      "created_at": "2026-06-15 07:48:55",
      "google_form_url": null
    }
  ];

  const initialLessons = [
  {
      "id": 1,
      "course_id": 1,
      "module_number": 1,
      "title": "HTML Basics",
      "content": "Introduction to HTML tags and structure.",
      "video_url": "HTML Tutorial.mp4",
      "duration_minutes": 20,
      "xp_reward": 20,
      "youtube_url": "",
      "lesson_order": 1
    },
    {
      "id": 2,
      "course_id": 1,
      "module_number": 1,
      "title": "CSS Fundamentals",
      "content": "Styling with CSS — selectors and box model.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/vfs1wBDoqBY?si=EIxK_YXSzAENnv3K",
      "lesson_order": 2
    },
    {
      "id": 3,
      "course_id": 1,
      "module_number": 2,
      "title": "JavaScript Intro",
      "content": "Variables, functions, and DOM manipulation.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": "https://youtu.be/poo0BXryffI?si=GPvyxXDbM98GT98B",
      "lesson_order": 1
    },
    {
      "id": 4,
      "course_id": 1,
      "module_number": 2,
      "title": "ES6+ Features",
      "content": "Arrow functions, destructuring, async/await.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 5,
      "course_id": 1,
      "module_number": 3,
      "title": "React Basics",
      "content": "Components, props, and useState.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/01bEb7R-F4s?si=4TKvWop3Ux0CsJBM",
      "lesson_order": 1
    },
    {
      "id": 6,
      "course_id": 1,
      "module_number": 4,
      "title": "Node.js & Express",
      "content": "Building REST APIs with Express.js.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 7,
      "course_id": 1,
      "module_number": 5,
      "title": "MySQL with Flask",
      "content": "Connecting Python Flask to MySQL.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 8,
      "course_id": 1,
      "module_number": 6,
      "title": "Express Middleware",
      "content": "Custom middleware and error handling.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 9,
      "course_id": 1,
      "module_number": 7,
      "title": "Figma Wireframes",
      "content": "Design to code workflow with Figma.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 10,
      "course_id": 1,
      "module_number": 8,
      "title": "EMAIL MARKETING & AUTOMATION",
      "content": "Deploy to Render, Vercel, and Railway.",
      "video_url": "",
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 11,
      "course_id": 2,
      "module_number": 1,
      "title": "INTRODUCTION",
      "content": "Variables, loops, functions and list comprehensions for data work.",
      "video_url": "",
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 12,
      "course_id": 2,
      "module_number": 1,
      "title": "CHANNELS AND PLATFORMS",
      "content": "Arrays, vectorised operations, broadcasting and slicing.",
      "video_url": "DM2.mp4",
      "duration_minutes": 30,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 13,
      "course_id": 2,
      "module_number": 1,
      "title": "CONSUMER BEHAVIOUR IN DIGITAL ENVIRONMENT",
      "content": "DataFrames, Series, read_csv, head/tail, info and describe.",
      "video_url": "",
      "duration_minutes": 35,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 14,
      "course_id": 2,
      "module_number": 2,
      "title": "ADVANCED SEO & KEYWORD SEARCH",
      "content": "dropna, fillna, isnull — strategies for real-world dirty datasets.",
      "video_url": "DM4.mp4",
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 15,
      "course_id": 2,
      "module_number": 2,
      "title": "CONVERSION RATE OPTIMIZATION (CRO) & FUNNEL BUILDING AND COMPETITIVE SEO",
      "content": "apply, map, merge, groupby and pivot tables.",
      "video_url": "",
      "duration_minutes": 35,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 16,
      "course_id": 2,
      "module_number": 2,
      "title": "SOCIAL MEDIA STRATEGY , MANAGEMENT & VISUAL CONTENT CREATION & STRATEGY",
      "content": "Creating new columns, binning, encoding categorical variables.",
      "video_url": "",
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 17,
      "course_id": 2,
      "module_number": 3,
      "title": "ANALYTICS & DATA INSIGHTS",
      "content": "Line, bar, scatter and histogram charts with full customisation.",
      "video_url": "",
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 18,
      "course_id": 2,
      "module_number": 3,
      "title": "ADVANCED GOOGLE ANALYTICS& TECHNIQUES - PART 1",
      "content": "heatmaps, pairplots, boxplots and distribution plots.",
      "video_url": "",
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 19,
      "course_id": 2,
      "module_number": 3,
      "title": "ADVANCED GOOGLE ANALYTICS& TECHNIQUES - PART 2",
      "content": "Building interactive dashboards and hover charts with Plotly.",
      "video_url": "",
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 20,
      "course_id": 2,
      "module_number": 4,
      "title": "EMAIL MARKETING & AUTOMATION",
      "content": "Mean, median, mode, variance, standard deviation and percentiles.",
      "video_url": "",
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 21,
      "course_id": 2,
      "module_number": 4,
      "title": "ONLINE REPUTATION & BRAND MANAGEMENT - PART 1",
      "content": "Distributions, probability rules, Bayes theorem introduction.",
      "video_url": "",
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 22,
      "course_id": 2,
      "module_number": 4,
      "title": "PERFORMANCE ANALYSIS & REPORTING",
      "content": "p-values, t-tests, chi-square tests and confidence intervals.",
      "video_url": "",
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 23,
      "course_id": 2,
      "module_number": 5,
      "title": "ADVANCED PPC COMPAIGN STRATEGIES-PART 1",
      "content": "Supervised vs unsupervised, overfitting, train/test split.",
      "video_url": "",
      "duration_minutes": 25,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 24,
      "course_id": 2,
      "module_number": 5,
      "title": "ADVANCED PPC COMPAIGN STRATEGIES-PART 2",
      "content": "Pipeline, fit/predict, cross-validation and model evaluation metrics.",
      "video_url": "",
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 25,
      "course_id": 2,
      "module_number": 5,
      "title": "SOCIAL MEDIA ANALYTICS AND REPORTING",
      "content": "OLS, gradient descent, R² score and residual analysis.",
      "video_url": "",
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 26,
      "course_id": 2,
      "module_number": 6,
      "title": "INFLUENCER MARKETING & OUTREACH",
      "content": "Load → clean → analyse → visualise → model a real CSV dataset.",
      "video_url": "DM19.mp4",
      "duration_minutes": 50,
      "xp_reward": 50,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 27,
      "course_id": 4,
      "module_number": 1,
      "title": "CONCLUSION & FUTURE TRENDS IN DIGITAL MARKETING",
      "content": "Variables, loops, functions and list comprehensions for data work.",
      "video_url": "DM20.mp4",
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/rfscVS0vtbw",
      "lesson_order": 1
    },
    {
      "id": 28,
      "course_id": 4,
      "module_number": 1,
      "title": "NumPy Fundamentals",
      "content": "Arrays, vectorised operations, broadcasting and slicing.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/QUT1VHiLmmI",
      "lesson_order": 2
    },
    {
      "id": 29,
      "course_id": 4,
      "module_number": 1,
      "title": "Pandas Basics",
      "content": "DataFrames, Series, read_csv, head/tail, info and describe.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 25,
      "youtube_url": "https://youtu.be/vmEHCJofslg",
      "lesson_order": 3
    },
    {
      "id": 30,
      "course_id": 4,
      "module_number": 2,
      "title": "Handling Missing Data",
      "content": "dropna, fillna, isnull — strategies for real-world dirty datasets.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 31,
      "course_id": 4,
      "module_number": 2,
      "title": "Data Transformation",
      "content": "apply, map, merge, groupby and pivot tables.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 32,
      "course_id": 4,
      "module_number": 2,
      "title": "Feature Engineering",
      "content": "Creating new columns, binning, encoding categorical variables.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 33,
      "course_id": 4,
      "module_number": 3,
      "title": "Matplotlib Essentials",
      "content": "Line, bar, scatter and histogram charts with full customisation.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/3Xc3CA655Y4",
      "lesson_order": 1
    },
    {
      "id": 34,
      "course_id": 4,
      "module_number": 3,
      "title": "Seaborn for Statistics",
      "content": "heatmaps, pairplots, boxplots and distribution plots.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/6GUZXDef2U0",
      "lesson_order": 2
    },
    {
      "id": 35,
      "course_id": 4,
      "module_number": 3,
      "title": "Plotly Interactive Charts",
      "content": "Building interactive dashboards and hover charts with Plotly.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 36,
      "course_id": 4,
      "module_number": 4,
      "title": "Descriptive Statistics",
      "content": "Mean, median, mode, variance, standard deviation and percentiles.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 37,
      "course_id": 4,
      "module_number": 4,
      "title": "Probability Basics",
      "content": "Distributions, probability rules, Bayes theorem introduction.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 38,
      "course_id": 4,
      "module_number": 4,
      "title": "Hypothesis Testing",
      "content": "p-values, t-tests, chi-square tests and confidence intervals.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 39,
      "course_id": 4,
      "module_number": 5,
      "title": "What is Machine Learning",
      "content": "Supervised vs unsupervised, overfitting, train/test split.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/ukzFI9rgwfU",
      "lesson_order": 1
    },
    {
      "id": 40,
      "course_id": 4,
      "module_number": 5,
      "title": "Scikit-Learn Basics",
      "content": "Pipeline, fit/predict, cross-validation and model evaluation metrics.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 41,
      "course_id": 4,
      "module_number": 5,
      "title": "Linear Regression",
      "content": "OLS, gradient descent, R² score and residual analysis.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 42,
      "course_id": 4,
      "module_number": 6,
      "title": "End-to-End Project",
      "content": "Load → clean → analyse → visualise → model a real CSV dataset.",
      "video_url": null,
      "duration_minutes": 50,
      "xp_reward": 50,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 43,
      "course_id": 2,
      "module_number": 1,
      "title": "ML Landscape Overview",
      "content": "Types of ML, real-world applications, tools and career paths.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/ukzFI9rgwfU",
      "lesson_order": 1
    },
    {
      "id": 44,
      "course_id": 2,
      "module_number": 1,
      "title": "Data Preprocessing",
      "content": "Scaling, normalisation, encoding, train/val/test splits.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 45,
      "course_id": 2,
      "module_number": 1,
      "title": "Model Evaluation",
      "content": "Accuracy, precision, recall, F1, ROC-AUC, confusion matrix.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 46,
      "course_id": 2,
      "module_number": 2,
      "title": "Linear & Logistic Regression",
      "content": "From scratch implementation and sklearn comparison.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 47,
      "course_id": 2,
      "module_number": 2,
      "title": "Decision Trees & Random Forest",
      "content": "Gini impurity, entropy, bagging and feature importance.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 48,
      "course_id": 2,
      "module_number": 2,
      "title": "SVM & KNN",
      "content": "Support vectors, kernel trick, k-nearest neighbours intuition.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 49,
      "course_id": 2,
      "module_number": 3,
      "title": "Perceptron & Backprop",
      "content": "Neurons, activation functions, forward pass and backpropagation.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/aircAruvnKk",
      "lesson_order": 1
    },
    {
      "id": 50,
      "course_id": 2,
      "module_number": 3,
      "title": "Deep Networks with Keras",
      "content": "Building, compiling and training dense networks in Keras.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/tPYj3fFJGjk",
      "lesson_order": 2
    },
    {
      "id": 51,
      "course_id": 2,
      "module_number": 3,
      "title": "Regularisation & Dropout",
      "content": "Overfitting, L1/L2, dropout layers and early stopping.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 52,
      "course_id": 2,
      "module_number": 4,
      "title": "Convolution Operations",
      "content": "Kernels, feature maps, pooling layers and receptive fields.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/KuXjwB4LzSA",
      "lesson_order": 1
    },
    {
      "id": 53,
      "course_id": 2,
      "module_number": 4,
      "title": "CNN Architectures",
      "content": "LeNet, AlexNet, VGG, ResNet — theory and transfer learning.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 54,
      "course_id": 2,
      "module_number": 4,
      "title": "Image Classification Project",
      "content": "Train a CNN on CIFAR-10 from scratch using TensorFlow.",
      "video_url": null,
      "duration_minutes": 50,
      "xp_reward": 40,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 55,
      "course_id": 2,
      "module_number": 5,
      "title": "Text Preprocessing",
      "content": "Tokenisation, stopwords, stemming, TF-IDF and word embeddings.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 56,
      "course_id": 2,
      "module_number": 5,
      "title": "RNNs & LSTMs",
      "content": "Sequence modelling, vanishing gradient, LSTM gates.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/LHXXI4-IEns",
      "lesson_order": 2
    },
    {
      "id": 57,
      "course_id": 2,
      "module_number": 5,
      "title": "Transformers & Attention",
      "content": "Self-attention, multi-head attention, BERT overview.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 40,
      "youtube_url": "https://youtu.be/4Bdc55j80l8",
      "lesson_order": 3
    },
    {
      "id": 58,
      "course_id": 2,
      "module_number": 6,
      "title": "RL Basics",
      "content": "Agent, environment, reward, policy and value functions.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/2pWv7GOvuf0",
      "lesson_order": 1
    },
    {
      "id": 59,
      "course_id": 2,
      "module_number": 6,
      "title": "Q-Learning",
      "content": "Bellman equation, Q-tables and epsilon-greedy exploration.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 60,
      "course_id": 2,
      "module_number": 6,
      "title": "Deep Q-Networks",
      "content": "DQN, experience replay, target networks — CartPole demo.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 40,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 61,
      "course_id": 2,
      "module_number": 7,
      "title": "Model Deployment",
      "content": "Flask API, FastAPI, Docker basics for serving ML models.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 62,
      "course_id": 2,
      "module_number": 7,
      "title": "MLflow & Experiment Tracking",
      "content": "Logging params, metrics and artefacts with MLflow.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 63,
      "course_id": 2,
      "module_number": 8,
      "title": "PyTorch Tensors",
      "content": "Tensors, autograd, computation graphs and GPU usage.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/IC0_FRiX-sw",
      "lesson_order": 1
    },
    {
      "id": 64,
      "course_id": 2,
      "module_number": 8,
      "title": "Training Loop in PyTorch",
      "content": "DataLoader, custom Dataset, loss functions and optimisers.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 65,
      "course_id": 2,
      "module_number": 9,
      "title": "GANs",
      "content": "Generator vs discriminator, training instability and DCGAN.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 66,
      "course_id": 2,
      "module_number": 9,
      "title": "Diffusion Models",
      "content": "DDPM, noise schedules and Stable Diffusion architecture overview.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 67,
      "course_id": 2,
      "module_number": 9,
      "title": "LLM Fine-Tuning",
      "content": "LoRA, prompt engineering, RLHF and practical fine-tuning.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 40,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 68,
      "course_id": 2,
      "module_number": 10,
      "title": "AI Capstone Project",
      "content": "End-to-end project: pick a domain, build, evaluate and deploy a model.",
      "video_url": null,
      "duration_minutes": 60,
      "xp_reward": 60,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 69,
      "course_id": 3,
      "module_number": 1,
      "title": "What is UI vs UX",
      "content": "Difference between UI and UX, roles, deliverables and career paths.",
      "video_url": null,
      "duration_minutes": 20,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/RlQEoJaLQRA",
      "lesson_order": 1
    },
    {
      "id": 70,
      "course_id": 3,
      "module_number": 1,
      "title": "Design Thinking Process",
      "content": "Empathise → Define → Ideate → Prototype → Test with real examples.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/_r0VX-aU_T8",
      "lesson_order": 2
    },
    {
      "id": 71,
      "course_id": 3,
      "module_number": 1,
      "title": "User Research Methods",
      "content": "Interviews, surveys, contextual inquiry, affinity mapping.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 72,
      "course_id": 3,
      "module_number": 2,
      "title": "Colour Theory",
      "content": "Hue, saturation, contrast ratios, WCAG accessibility and brand palettes.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": "https://youtu.be/AvgCkHrcj7g",
      "lesson_order": 1
    },
    {
      "id": 73,
      "course_id": 3,
      "module_number": 2,
      "title": "Typography in UI",
      "content": "Font pairing, type scale, line height, readability on screens.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 74,
      "course_id": 3,
      "module_number": 2,
      "title": "Spacing & Layout Grids",
      "content": "8-point grid system, columns, gutters, padding — consistency at scale.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 75,
      "course_id": 3,
      "module_number": 2,
      "title": "Iconography & Imagery",
      "content": "Icon styles, SVG usage, image ratios, hero sections and illustration.",
      "video_url": null,
      "duration_minutes": 20,
      "xp_reward": 20,
      "youtube_url": null,
      "lesson_order": 4
    },
    {
      "id": 76,
      "course_id": 3,
      "module_number": 3,
      "title": "Lo-Fi Wireframing",
      "content": "Paper sketches to digital lo-fi — when and why to go low fidelity.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 77,
      "course_id": 3,
      "module_number": 3,
      "title": "Wireframing in Figma",
      "content": "Frames, auto-layout, components and creating a 5-screen lo-fi flow.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/FTFaQWZBqQ8",
      "lesson_order": 2
    },
    {
      "id": 78,
      "course_id": 3,
      "module_number": 3,
      "title": "Information Architecture",
      "content": "Card sorting, site maps, user flows and navigation patterns.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 79,
      "course_id": 3,
      "module_number": 4,
      "title": "Figma Interface Tour",
      "content": "Frames, layers, pages, shortcuts and community files.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": "https://youtu.be/HZuk6Wkx_Eg",
      "lesson_order": 1
    },
    {
      "id": 80,
      "course_id": 3,
      "module_number": 4,
      "title": "Components & Variants",
      "content": "Creating master components, variants, props and nested components.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/9iIGZJaXWNY",
      "lesson_order": 2
    },
    {
      "id": 81,
      "course_id": 3,
      "module_number": 4,
      "title": "Auto Layout",
      "content": "Responsive stacks, padding, spacing modes — building flexible components.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/TyaGpGDFczw",
      "lesson_order": 3
    },
    {
      "id": 82,
      "course_id": 3,
      "module_number": 4,
      "title": "Design Systems",
      "content": "Colour styles, text styles, component libraries, tokens and documentation.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 4
    },
    {
      "id": 83,
      "course_id": 3,
      "module_number": 5,
      "title": "Interactive Prototypes",
      "content": "Linking frames, transitions, overlays and scroll behaviour in Figma.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/iBkXf6u8htI",
      "lesson_order": 1
    },
    {
      "id": 84,
      "course_id": 3,
      "module_number": 5,
      "title": "Micro-interactions",
      "content": "Hover states, loading animations, skeleton screens and feedback loops.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 85,
      "course_id": 3,
      "module_number": 5,
      "title": "Mobile Prototyping",
      "content": "iOS and Android guidelines, safe areas, gesture navigation patterns.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 86,
      "course_id": 3,
      "module_number": 6,
      "title": "Planning a Usability Test",
      "content": "Goals, tasks, metrics, recruiting participants and consent forms.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 87,
      "course_id": 3,
      "module_number": 6,
      "title": "Conducting & Analysing Tests",
      "content": "Moderated sessions, think-aloud protocol, affinity diagrams from findings.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 88,
      "course_id": 3,
      "module_number": 6,
      "title": "Iterating on Feedback",
      "content": "Translating test results into actionable design improvements.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 89,
      "course_id": 3,
      "module_number": 7,
      "title": "Hi-Fi UI Design",
      "content": "Applying brand, colour and type to wireframes — desktop and mobile.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 40,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 90,
      "course_id": 3,
      "module_number": 7,
      "title": "Dark Mode Design",
      "content": "Elevation, surface colours, accessibility and component adaptation.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 91,
      "course_id": 3,
      "module_number": 7,
      "title": "Handoff to Developers",
      "content": "Inspect panel, redlines, export settings, Zeplin/Figma dev mode.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 92,
      "course_id": 3,
      "module_number": 8,
      "title": "UX Case Study Project",
      "content": "End-to-end: research → wireframe → prototype → test → present a real product.",
      "video_url": null,
      "duration_minutes": 60,
      "xp_reward": 60,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 93,
      "course_id": 5,
      "module_number": 1,
      "title": "What is Cloud Computing",
      "content": "IaaS, PaaS, SaaS, public/private/hybrid cloud and key benefits.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/M988_fsOSWo",
      "lesson_order": 1
    },
    {
      "id": 94,
      "course_id": 5,
      "module_number": 1,
      "title": "AWS Global Infrastructure",
      "content": "Regions, Availability Zones, Edge Locations and how to choose a region.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 20,
      "youtube_url": "https://youtu.be/a9__D53WsUs",
      "lesson_order": 2
    },
    {
      "id": 95,
      "course_id": 5,
      "module_number": 1,
      "title": "AWS Console & CLI Setup",
      "content": "Creating a free-tier account, IAM admin user, CLI install and aws configure.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 96,
      "course_id": 5,
      "module_number": 2,
      "title": "IAM Users, Groups & Roles",
      "content": "Principle of least privilege, policies, inline vs managed, role assumption.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/y8cbKJAo3B4",
      "lesson_order": 1
    },
    {
      "id": 97,
      "course_id": 5,
      "module_number": 2,
      "title": "IAM Policies Deep Dive",
      "content": "JSON policy structure, conditions, resource ARNs and policy simulator.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 98,
      "course_id": 5,
      "module_number": 2,
      "title": "MFA & Security Best Practices",
      "content": "Root account lock-down, MFA, access keys rotation, CloudTrail auditing.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 99,
      "course_id": 5,
      "module_number": 3,
      "title": "EC2 Instance Types",
      "content": "General, compute, memory, storage optimised families — picking the right size.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": "https://youtu.be/iHX-BO70Jzs",
      "lesson_order": 1
    },
    {
      "id": 100,
      "course_id": 5,
      "module_number": 3,
      "title": "Launching & Connecting EC2",
      "content": "AMIs, key pairs, security groups, user data scripts, SSH and EC2 Instance Connect.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 101,
      "course_id": 5,
      "module_number": 3,
      "title": "AMIs, Snapshots & EBS",
      "content": "Creating custom AMIs, EBS volume types, snapshots and encryption.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 102,
      "course_id": 5,
      "module_number": 3,
      "title": "Auto Scaling & Load Balancer",
      "content": "ASG launch templates, scaling policies, ALB target groups and health checks.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/vZMF1l_MFOU",
      "lesson_order": 4
    },
    {
      "id": 103,
      "course_id": 5,
      "module_number": 4,
      "title": "S3 Buckets & Objects",
      "content": "Creating buckets, uploading objects, versioning, storage classes and lifecycle.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/_I14_sXHO8U",
      "lesson_order": 1
    },
    {
      "id": 104,
      "course_id": 5,
      "module_number": 4,
      "title": "S3 Security",
      "content": "Bucket policies, ACLs, Block Public Access, pre-signed URLs, encryption.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 105,
      "course_id": 5,
      "module_number": 4,
      "title": "Static Website on S3",
      "content": "Hosting a React/HTML site on S3 + CloudFront CDN distribution.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 106,
      "course_id": 5,
      "module_number": 5,
      "title": "RDS Overview",
      "content": "Managed relational DB, supported engines, Multi-AZ, read replicas.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/eMzCI7S1P9M",
      "lesson_order": 1
    },
    {
      "id": 107,
      "course_id": 5,
      "module_number": 5,
      "title": "Launching RDS MySQL",
      "content": "Parameter groups, subnet groups, security groups, connecting from EC2.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 108,
      "course_id": 5,
      "module_number": 5,
      "title": "DynamoDB Fundamentals",
      "content": "NoSQL key-value model, partition keys, sort keys, GSI and on-demand billing.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 30,
      "youtube_url": "https://youtu.be/2mVR_Qgx_RU",
      "lesson_order": 3
    },
    {
      "id": 109,
      "course_id": 5,
      "module_number": 6,
      "title": "VPC Fundamentals",
      "content": "CIDR blocks, subnets, route tables, internet gateways and NAT gateways.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/fpxDGU2KdkA",
      "lesson_order": 1
    },
    {
      "id": 110,
      "course_id": 5,
      "module_number": 6,
      "title": "Security Groups vs NACLs",
      "content": "Stateful vs stateless, inbound/outbound rules, layered defence.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 30,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 111,
      "course_id": 5,
      "module_number": 6,
      "title": "VPC Peering & Endpoints",
      "content": "Peering connections, transit gateway overview, S3 VPC endpoint.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 112,
      "course_id": 5,
      "module_number": 7,
      "title": "AWS Lambda Basics",
      "content": "Function anatomy, runtimes, triggers, execution role and cold starts.",
      "video_url": null,
      "duration_minutes": 35,
      "xp_reward": 35,
      "youtube_url": "https://youtu.be/eOBq__h4OJ4",
      "lesson_order": 1
    },
    {
      "id": 113,
      "course_id": 5,
      "module_number": 7,
      "title": "API Gateway + Lambda",
      "content": "Building a REST API: resources, methods, proxy integration, stages and CORS.",
      "video_url": null,
      "duration_minutes": 45,
      "xp_reward": 40,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 114,
      "course_id": 5,
      "module_number": 7,
      "title": "Serverless Framework",
      "content": "Deploying multi-function apps with serverless.yml, plugins and CI integration.",
      "video_url": null,
      "duration_minutes": 40,
      "xp_reward": 35,
      "youtube_url": null,
      "lesson_order": 3
    },
    {
      "id": 115,
      "course_id": 5,
      "module_number": 8,
      "title": "CloudWatch Metrics & Alarms",
      "content": "Namespaces, dashboards, alarms, log groups and metric filters.",
      "video_url": null,
      "duration_minutes": 30,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 1
    },
    {
      "id": 116,
      "course_id": 5,
      "module_number": 8,
      "title": "AWS Cost Explorer & Budgets",
      "content": "Free-tier traps, Cost Explorer, Budget alerts and Trusted Advisor.",
      "video_url": null,
      "duration_minutes": 25,
      "xp_reward": 25,
      "youtube_url": null,
      "lesson_order": 2
    },
    {
      "id": 117,
      "course_id": 5,
      "module_number": 9,
      "title": "AWS 3-Tier Architecture",
      "content": "Deploy a Flask API (EC2) + RDS MySQL + S3 frontend behind an ALB — full project.",
      "video_url": null,
      "duration_minutes": 60,
      "xp_reward": 60,
      "youtube_url": null,
      "lesson_order": 1
    }
  ];

  const initialAssignments = [
  {
      "id": 1,
      "course_id": 1,
      "title": "REST API Assignment",
      "description": "Build a complete REST API using Node.js and Express with CRUD operations.",
      "due_date": "2026-06-03 11:43:46",
      "max_score": 100,
      "xp_reward": 80,
      "type": "Assignment",
      "created_at": "2026-06-03 06:13:46"
    },
    {
      "id": 2,
      "course_id": 2,
      "title": "Neural Networks Quiz",
      "description": "Quiz covering backpropagation, activation functions, and CNN basics.",
      "due_date": "2026-06-04 11:43:46",
      "max_score": 100,
      "xp_reward": 60,
      "type": "Quiz",
      "created_at": "2026-06-03 06:13:46"
    },
    {
      "id": 3,
      "course_id": 3,
      "title": "Figma Wireframes",
      "description": "Design a mobile app wireframe for an e-commerce checkout flow.",
      "due_date": "2026-06-02 11:43:46",
      "max_score": 100,
      "xp_reward": 50,
      "type": "Assignment",
      "created_at": "2026-06-03 06:13:46"
    },
    {
      "id": 4,
      "course_id": 1,
      "title": "Live Session — DevOps",
      "description": "Attend the live DevOps session covering Docker containerization.",
      "due_date": "2026-06-05 11:43:46",
      "max_score": 100,
      "xp_reward": 40,
      "type": "Live Session",
      "created_at": "2026-06-03 06:13:46"
    }
  ];

  const initialQuizQuestions = [
  {
      "id": 1,
      "assignment_id": 2,
      "question": "What does `const` do in JavaScript?",
      "option_a": "Declares a variable that can be reassigned",
      "option_b": "Declares a block-scoped constant binding",
      "option_c": "Declares a function-scoped variable",
      "option_d": "None of the above",
      "correct_option": "b",
      "explanation": "const creates a block-scoped binding that cannot be reassigned."
    },
    {
      "id": 2,
      "assignment_id": 2,
      "question": "Which method returns a new array without mutating the original?",
      "option_a": "push()",
      "option_b": "splice()",
      "option_c": "map()",
      "option_d": "sort()",
      "correct_option": "c",
      "explanation": "map() returns a new array and does not mutate the original."
    },
    {
      "id": 3,
      "assignment_id": 2,
      "question": "What is the output of: console.log(typeof null)?",
      "option_a": "\"null\"",
      "option_b": "\"undefined\"",
      "option_c": "\"object\"",
      "option_d": "\"boolean\"",
      "correct_option": "c",
      "explanation": "typeof null returns \"object\" — a known JS quirk."
    },
    {
      "id": 4,
      "assignment_id": 2,
      "question": "What does `const` do in JavaScript?",
      "option_a": "Declares a variable that can be reassigned",
      "option_b": "Declares a block-scoped constant binding",
      "option_c": "Declares a function-scoped variable",
      "option_d": "None of the above",
      "correct_option": "b",
      "explanation": "const creates a block-scoped binding that cannot be reassigned."
    },
    {
      "id": 5,
      "assignment_id": 2,
      "question": "Which method returns a new array without mutating the original?",
      "option_a": "push()",
      "option_b": "splice()",
      "option_c": "map()",
      "option_d": "sort()",
      "correct_option": "c",
      "explanation": "map() returns a new array and does not mutate the original."
    },
    {
      "id": 6,
      "assignment_id": 2,
      "question": "What is the output of: console.log(typeof null)?",
      "option_a": "\"null\"",
      "option_b": "\"undefined\"",
      "option_c": "\"object\"",
      "option_d": "\"boolean\"",
      "correct_option": "c",
      "explanation": "typeof null returns \"object\" — a known JS quirk."
    },
    {
      "id": 7,
      "assignment_id": 2,
      "question": "What does `const` do in JavaScript?",
      "option_a": "Declares a variable that can be reassigned",
      "option_b": "Declares a block-scoped constant binding",
      "option_c": "Declares a function-scoped variable",
      "option_d": "None of the above",
      "correct_option": "b",
      "explanation": "const creates a block-scoped binding that cannot be reassigned."
    },
    {
      "id": 8,
      "assignment_id": 2,
      "question": "Which method returns a new array without mutating the original?",
      "option_a": "push()",
      "option_b": "splice()",
      "option_c": "map()",
      "option_d": "sort()",
      "correct_option": "c",
      "explanation": "map() returns a new array and does not mutate the original."
    },
    {
      "id": 9,
      "assignment_id": 2,
      "question": "What is the output of: console.log(typeof null)?",
      "option_a": "\"null\"",
      "option_b": "\"undefined\"",
      "option_c": "\"object\"",
      "option_d": "\"boolean\"",
      "correct_option": "c",
      "explanation": "typeof null returns \"object\" — a known JS quirk."
    }
  ];

  const initialAchievements = [
  {
      "id": 1,
      "title": "First Login",
      "description": "Welcome to the platform!",
      "icon": "?",
      "criteria_type": "lessons",
      "criteria_value": 0,
      "xp_reward": 10,
      "condition_type": "manual"
    },
    {
      "id": 2,
      "title": "7-Day Streak",
      "description": "Studied 7 days in a row",
      "icon": "?",
      "criteria_type": "streak",
      "criteria_value": 7,
      "xp_reward": 100,
      "condition_type": "manual"
    },
    {
      "id": 3,
      "title": "10 Lessons",
      "description": "Completed 10 lessons",
      "icon": "?",
      "criteria_type": "lessons",
      "criteria_value": 10,
      "xp_reward": 50,
      "condition_type": "manual"
    },
    {
      "id": 4,
      "title": "500 XP Club",
      "description": "Earned 500 XP total",
      "icon": "⚡",
      "criteria_type": "xp",
      "criteria_value": 500,
      "xp_reward": 75,
      "condition_type": "manual"
    },
    {
      "id": 5,
      "title": "Course Master",
      "description": "Completed your first course",
      "icon": "?",
      "criteria_type": "courses",
      "criteria_value": 1,
      "xp_reward": 200,
      "condition_type": "manual"
    },
    {
      "id": 6,
      "title": "Quiz Ace",
      "description": "Scored 100% on a quiz",
      "icon": "?",
      "criteria_type": "quiz_score",
      "criteria_value": 100,
      "xp_reward": 150,
      "condition_type": "manual"
    },
    {
      "id": 7,
      "title": "30-Day Streak",
      "description": "Studied 30 days in a row",
      "icon": "?",
      "criteria_type": "streak",
      "criteria_value": 30,
      "xp_reward": 500,
      "condition_type": "manual"
    },
    {
      "id": 8,
      "title": "1000 XP Legend",
      "description": "Earned 1000 XP total",
      "icon": "?",
      "criteria_type": "xp",
      "criteria_value": 1000,
      "xp_reward": 300,
      "condition_type": "manual"
    },
    {
      "id": 9,
      "title": "First Login",
      "description": "Welcome to the platform!",
      "icon": "?",
      "criteria_type": "lessons",
      "criteria_value": 0,
      "xp_reward": 10,
      "condition_type": "manual"
    },
    {
      "id": 10,
      "title": "7-Day Streak",
      "description": "Studied 7 days in a row",
      "icon": "?",
      "criteria_type": "streak",
      "criteria_value": 7,
      "xp_reward": 100,
      "condition_type": "manual"
    },
    {
      "id": 11,
      "title": "10 Lessons",
      "description": "Completed 10 lessons",
      "icon": "?",
      "criteria_type": "lessons",
      "criteria_value": 10,
      "xp_reward": 50,
      "condition_type": "manual"
    },
    {
      "id": 12,
      "title": "500 XP Club",
      "description": "Earned 500 XP total",
      "icon": "⚡",
      "criteria_type": "xp",
      "criteria_value": 500,
      "xp_reward": 75,
      "condition_type": "manual"
    },
    {
      "id": 13,
      "title": "Course Master",
      "description": "Completed your first course",
      "icon": "?",
      "criteria_type": "courses",
      "criteria_value": 1,
      "xp_reward": 200,
      "condition_type": "manual"
    },
    {
      "id": 14,
      "title": "Quiz Ace",
      "description": "Scored 100% on a quiz",
      "icon": "?",
      "criteria_type": "quiz_score",
      "criteria_value": 100,
      "xp_reward": 150,
      "condition_type": "manual"
    },
    {
      "id": 15,
      "title": "30-Day Streak",
      "description": "Studied 30 days in a row",
      "icon": "?",
      "criteria_type": "streak",
      "criteria_value": 30,
      "xp_reward": 500,
      "condition_type": "manual"
    },
    {
      "id": 16,
      "title": "1000 XP Legend",
      "description": "Earned 1000 XP total",
      "icon": "?",
      "criteria_type": "xp",
      "criteria_value": 1000,
      "xp_reward": 300,
      "condition_type": "manual"
    }
  ];

  // Helper to init storage if empty
  function initLocalStorage() {
    // Always sync static catalog tables with current JS definitions
    localStorage.setItem('courses', JSON.stringify(initialCourses));
    localStorage.setItem('lessons', JSON.stringify(initialLessons));
    localStorage.setItem('assignments', JSON.stringify(initialAssignments));
    localStorage.setItem('quiz_questions', JSON.stringify(initialQuizQuestions));
    localStorage.setItem('achievements', JSON.stringify(initialAchievements));

    if (!localStorage.getItem('users')) {
      const demoUser = {
        id: 1,
        username: 'abi',
        email: 'abi@example.com',
        password_hash: 'demo123', // Demo plaintext check
        full_name: 'Abi',
        avatar_url: '',
        level: 4,
        xp: 720,
        xp_max: 1000,
        streak_days: 7,
        last_login: today,
        bio: 'I am a student passionate about web technologies!',
        phone: '+91 98765 43210',
        timezone: 'Asia/Kolkata',
        notifications_email: true,
        notifications_push: true,
        dark_mode: false,
        is_admin: 0
      };
      
      const adminUser = {
        id: 2,
        username: 'admin',
        email: 'admin@example.com',
        password_hash: 'admin123',
        full_name: 'System Admin',
        avatar_url: '',
        level: 10,
        xp: 9999,
        xp_max: 10000,
        streak_days: 99,
        last_login: today,
        bio: 'Platform administration account.',
        phone: 'N/A',
        timezone: 'Asia/Kolkata',
        notifications_email: true,
        notifications_push: true,
        dark_mode: true,
        is_admin: 1
      };

      localStorage.setItem('users', JSON.stringify([demoUser, adminUser]));
      
      // User enrollments (seeded for user 1)
      const userCourses = [
        { id: 1, user_id: 1, course_id: 1, current_module: 2, progress_percent: 40, status: 'active', mode: 'LIVE', enrolled_at: getRelativeDate(-7) },
        { id: 2, user_id: 1, course_id: 2, current_module: 1, progress_percent: 20, status: 'active', mode: 'NEW', enrolled_at: getRelativeDate(-5) },
        { id: 3, user_id: 1, course_id: 3, current_module: 2, progress_percent: 75, status: 'active', mode: 'SELF-PACED', enrolled_at: getRelativeDate(-3) }
      ];
      localStorage.setItem('user_courses', JSON.stringify(userCourses));

      // User lesson completions (user 1 completed 2/5 of course 1, 1/5 of course 2, 3/4 of course 3)
      const userLessons = [
        { id: 1, user_id: 1, lesson_id: 101, completed_at: getRelativeDate(-6) },
        { id: 2, user_id: 1, lesson_id: 102, completed_at: getRelativeDate(-5) },
        { id: 3, user_id: 1, lesson_id: 201, completed_at: getRelativeDate(-4) },
        { id: 4, user_id: 1, lesson_id: 301, completed_at: getRelativeDate(-3) },
        { id: 5, user_id: 1, lesson_id: 302, completed_at: getRelativeDate(-2) },
        { id: 6, user_id: 1, lesson_id: 303, completed_at: getRelativeDate(-1) }
      ];
      localStorage.setItem('user_lessons', JSON.stringify(userLessons));

      // User assignments status
      const userAssignments = [
        { id: 1, user_id: 1, assignment_id: 1, status: 'pending', score: null, feedback: null, submitted_at: null },
        { id: 2, user_id: 1, assignment_id: 2, status: 'pending', score: null, feedback: null, submitted_at: null },
        { id: 3, user_id: 1, assignment_id: 3, status: 'submitted', score: 92, feedback: 'Excellent layout structures, clean hierarchy.', submitted_at: getRelativeDate(-1) },
        { id: 4, user_id: 1, assignment_id: 4, status: 'pending', score: null, feedback: null, submitted_at: null }
      ];
      localStorage.setItem('user_assignments', JSON.stringify(userAssignments));

      // Streak Logs (last 7 days completed for user 1)
      const streakLogs = [];
      for (let i = 6; i >= 0; i--) {
        streakLogs.push({
          id: 10 - i,
          user_id: 1,
          log_date: getRelativeDate(-i).split(' ')[0],
          xp_earned: [45, 60, 30, 75, 50, 90, 40][6 - i],
          lessons_completed: [2, 3, 1, 4, 2, 5, 2][6 - i],
          minutes_studied: [90, 120, 60, 150, 80, 180, 70][6 - i]
        });
      }
      localStorage.setItem('streak_logs', JSON.stringify(streakLogs));

      // User achievements
      const userAchievements = [
        { id: 1, user_id: 1, achievement_id: 1, earned_at: getRelativeDate(-7) },
        { id: 2, user_id: 1, achievement_id: 2, earned_at: getRelativeDate(-6) },
        { id: 3, user_id: 1, achievement_id: 3, earned_at: getRelativeDate(-5) },
        { id: 4, user_id: 1, achievement_id: 4, earned_at: getRelativeDate(-4) }
      ];
      localStorage.setItem('user_achievements', JSON.stringify(userAchievements));

      // Certificates
      localStorage.setItem('certificates', JSON.stringify([]));

      // Notifications
      const initialNotifications = [
        { id: 1, user_id: 1, title: 'Assignment Due Today!', message: 'REST API Assignment is due tonight at 11:59 PM. Submit before the deadline!', type: 'warning', is_read: 0, created_at: getRelativeDate(0, "08:00:00") },
        { id: 2, user_id: 1, title: 'New Live Session Added', message: 'DevOps Docker session added for Friday 4:00 PM. Mark your calendar!', type: 'info', is_read: 0, created_at: getRelativeDate(0, "09:00:00") },
        { id: 3, user_id: 1, title: '7-Day Streak Achievement!', message: 'Congratulations! You earned the 7-Day Streak badge. +100 XP awarded!', type: 'success', is_read: 0, created_at: getRelativeDate(-1, "18:00:00") },
        { id: 4, user_id: 1, title: 'Quiz Available', message: 'Neural Networks Quiz is now available. Complete it before tomorrow 5 PM.', type: 'info', is_read: 0, created_at: getRelativeDate(-1, "10:00:00") }
      ];
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));

      // Set logged in session
      localStorage.setItem('sessionUser', "1");
    }
  }

  // File Upload Helper: converts File object to Base64
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Call immediately
  initLocalStorage();

  // Get active session user
  function getCurrentUser() {
    const uid = parseInt(localStorage.getItem('sessionUser'));
    if (!uid) return null;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === uid) || null;
  }

  // Update a user in database
  function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  // Helper to trigger custom client streak check on load
  function updateStreak(uid) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === uid);
    if (!user) return;
    
    const lastLogin = user.last_login;
    const todayStr = new Date().toISOString().slice(0, 10);
    
    if (lastLogin === todayStr) {
      // already updated today
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    if (lastLogin === yesterdayStr) {
      user.streak_days += 1;
    } else {
      user.streak_days = 1;
    }
    user.last_login = todayStr;
    saveUser(user);

    // Seed streak logs for today
    const streakLogs = JSON.parse(localStorage.getItem('streak_logs') || '[]');
    if (!streakLogs.some(l => l.user_id === uid && l.log_date === todayStr)) {
      streakLogs.push({
        id: streakLogs.length + 1,
        user_id: uid,
        log_date: todayStr,
        xp_earned: 0,
        lessons_completed: 0,
        minutes_studied: 0
      });
      localStorage.setItem('streak_logs', JSON.stringify(streakLogs));
    }
  }

  // Auto-run streak check on startup if user is logged in
  const curUserObj = getCurrentUser();
  if (curUserObj) {
    updateStreak(curUserObj.id);
  }

  // Helper: create a response object
  function mockResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Intercept Fetch Calls ────────────────────────────────────────────────
  const originalFetch = window.fetch;

  window.fetch = async function (resource, options = {}) {
    const url = typeof resource === 'string' ? resource : resource.url;
    const method = (options.method || 'GET').toUpperCase();

    // Check if it's an API request
    if (url.includes('/api/')) {
      console.log(`[Mock API Interceptor] ${method} -> ${url}`);

      const currentUser = getCurrentUser();
      const isLogged = !!currentUser;

      // Parse payload if any
      let payload = null;
      if (options.body) {
        if (options.body instanceof FormData) {
          payload = options.body; // Leave as FormData
        } else {
          try {
            payload = JSON.parse(options.body);
          } catch (e) {
            payload = options.body;
          }
        }
      }

      // ── AUTH API ──
      
      // 1. LOGIN
      if (url.endsWith('/api/auth/login') && method === 'POST') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const { email, password } = payload;
        const match = users.find(u => (u.email === email || u.username === email));

        if (!match) {
          return mockResponse({ error: 'No account found with that email or username' }, 401);
        }
        // Match plaintext for easy demo
        if (match.password_hash !== password && password !== 'demo123') {
          return mockResponse({ error: 'Incorrect password' }, 401);
        }

        // Set session
        localStorage.setItem('sessionUser', match.id.toString());
        updateStreak(match.id);
        return mockResponse({ success: true, redirect: 'dashboard' });
      }

      // 2. REGISTER
      if (url.endsWith('/api/auth/register') && method === 'POST') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const { username, email, full_name, password } = payload;

        if (users.some(u => u.username === username || u.email === email)) {
          return mockResponse({ error: 'Username or email already exists' }, 400);
        }

        const newUser = {
          id: users.length + 1,
          username: username,
          email: email,
          password_hash: password, // Store directly for mockup ease
          full_name: full_name,
          avatar_url: '',
          level: 1,
          xp: 0,
          xp_max: 1000,
          streak_days: 1,
          last_login: today,
          bio: '',
          phone: '',
          timezone: 'Asia/Kolkata',
          notifications_email: true,
          notifications_push: true,
          dark_mode: false,
          is_admin: 0
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('sessionUser', newUser.id.toString());
        
        // Add welcome notification
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.push({
          id: notifications.length + 1,
          user_id: newUser.id,
          title: 'Welcome! 🎉',
          message: 'Welcome to Plant Green Inertia LMS. Explore courses and start learning!',
          type: 'success',
          is_read: 0,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));

        return mockResponse({ success: true, redirect: 'dashboard' });
      }

      // 3. LOGOUT
      if (url.endsWith('/api/auth/logout')) {
        localStorage.removeItem('sessionUser');
        // Handle window redirection inside mock interceptor safely
        setTimeout(() => { window.location.href = 'login.html'; }, 50);
        return mockResponse({ success: true });
      }

      // 4. RESET PASSWORD
      if (url.endsWith('/api/auth/reset-password') && method === 'POST') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const { email, new_password } = payload;
        const user = users.find(u => u.email === email);
        if (!user) {
          return mockResponse({ error: 'No account found with that email address.' }, 404);
        }
        user.password_hash = new_password;
        localStorage.setItem('users', JSON.stringify(users));
        return mockResponse({ success: true, message: `Password updated for ${email}`, hash_preview: '$2b$12$MockHashPlaceholderForBcryptDemoOnly' });
      }

      // Require Login validation on other API calls
      if (!isLogged) {
        return mockResponse({ error: 'Unauthorized' }, 401);
      }

      // ── USER API ──

      // 5. GET ME
      if (url.endsWith('/api/user/me') && method === 'GET') {
        return mockResponse(currentUser);
      }

      // 6. UPDATE USER PREFS
      if (url.endsWith('/api/user/update') && method === 'POST') {
        Object.assign(currentUser, payload);
        saveUser(currentUser);
        return mockResponse({ success: true });
      }

      // 7. UPDATE PROFILE INFO
      if (url.endsWith('/api/user/update_profile') && method === 'POST') {
        const { full_name, email, phone, date_of_birth, gender, bio } = payload;
        currentUser.full_name = full_name;
        currentUser.email = email;
        currentUser.phone = phone;
        currentUser.date_of_birth = date_of_birth;
        currentUser.gender = gender;
        currentUser.bio = bio;
        saveUser(currentUser);
        return mockResponse({ success: true, message: '✓ Profile updated!' });
      }

      // 8. UPDATE AVATAR
      if (url.endsWith('/api/user/avatar') && method === 'POST') {
        const file = payload.get('avatar');
        if (file) {
          try {
            const base64Url = await fileToBase64(file);
            currentUser.avatar_url = base64Url;
            saveUser(currentUser);
            return mockResponse({ success: true, url: base64Url });
          } catch (e) {
            return mockResponse({ error: 'Failed to read image file.' }, 500);
          }
        }
        return mockResponse({ error: 'No image uploaded' }, 400);
      }

      // 9. CHANGE PASSWORD
      if (url.endsWith('/api/user/change-password') && method === 'POST') {
        const { current_password, new_password } = payload;
        if (currentUser.password_hash !== current_password) {
          return mockResponse({ error: 'Current password is incorrect.' }, 401);
        }
        currentUser.password_hash = new_password;
        saveUser(currentUser);
        return mockResponse({ success: true, message: 'Password changed successfully!' });
      }

      // 10. CLOUD STORAGE UTILISATION
      if (url.endsWith('/api/user/storage') && method === 'GET') {
        // Return simulated realistic data
        const avatarSizeMB = currentUser.avatar_url ? (currentUser.avatar_url.length / 1024 / 1024 * 0.75).toFixed(2) : 0;
        const totalUsedMB = parseFloat(avatarSizeMB) + 124.5; // add some default mock bytes for courses downloads
        const maxGB = 5.0;
        const usedGB = (totalUsedMB / 1024).toFixed(3);
        const usedPct = ((usedGB / maxGB) * 100).toFixed(1);

        return mockResponse({
          used_gb: parseFloat(usedGB),
          max_gb: maxGB,
          used_pct: parseFloat(usedPct),
          used_mb: parseFloat(totalUsedMB.toFixed(1))
        });
      }

      // ── DASHBOARD API ──
      
      // 11. DASHBOARD OVERVIEW DATA
      if (url.endsWith('/api/dashboard') && method === 'GET') {
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const activeCourses = userCourses.filter(uc => uc.user_id === currentUser.id && uc.status === 'active');
        
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const activeCourseDetails = activeCourses.map(uc => {
          const matching = courses.find(c => c.id === uc.course_id);
          return matching ? {
            title: matching.title,
            category: matching.category,
            current_module: uc.current_module,
            progress_percent: uc.progress_percent,
            mode: uc.mode,
            total_modules: matching.total_modules,
            course_id: matching.id
          } : null;
        }).filter(Boolean);

        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const activeAssignments = userAssignments.filter(ua => ua.user_id === currentUser.id && ua.status !== 'graded');
        const taskDetails = activeAssignments.map(ua => {
          const matching = assignments.find(a => a.id === ua.assignment_id);
          return matching ? {
            title: matching.title,
            type: matching.type,
            due_date: matching.due_date,
            status: ua.status
          } : null;
        }).filter(Boolean).slice(0, 5);

        const streakLogs = JSON.parse(localStorage.getItem('streak_logs') || '[]');
        const streakDates = streakLogs
          .filter(sl => sl.user_id === currentUser.id)
          .map(sl => sl.log_date);

        const userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const earnedAchievements = userAchievements
          .filter(ua => ua.user_id === currentUser.id)
          .map(ua => {
            const match = achievements.find(a => a.id === ua.achievement_id);
            return match ? { title: match.title, icon: match.icon } : null;
          }).filter(Boolean).slice(0, 8);

        const userLessons = JSON.parse(localStorage.getItem('user_lessons') || '[]');
        const totalLessonsCompleted = userLessons.filter(ul => ul.user_id === currentUser.id).length;

        // Sum studied minutes
        const minutesStudied = streakLogs
          .filter(sl => sl.user_id === currentUser.id)
          .reduce((sum, item) => sum + (item.minutes_studied || 0), 0);
        const totalHours = (minutesStudied / 60).toFixed(1);

        return mockResponse({
          user: {
            level: currentUser.level,
            xp: currentUser.xp,
            xp_max: currentUser.xp_max,
            streak_days: currentUser.streak_days,
            full_name: currentUser.full_name
          },
          stats: {
            active_courses: activeCourses.length,
            total_hours: parseFloat(totalHours),
            total_xp: currentUser.xp,
            lessons_done: totalLessonsCompleted,
            lessons_today: 0,
            streak_days: currentUser.streak_days,
            best_streak: currentUser.streak_days,
            level: currentUser.level
          },
          courses: activeCourseDetails,
          tasks: taskDetails,
          streak_dates: streakDates,
          achievements: earnedAchievements
        });
      }

      // ── COURSES API ──

      // 12. GET ALL COURSES WITH PROGRESS
      if (url.endsWith('/api/courses') && method === 'GET') {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        
        const mapped = courses.map(c => {
          const enrollment = userCourses.find(uc => uc.user_id === currentUser.id && uc.course_id === c.id);
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            instructor: c.instructor,
            total_modules: c.total_modules,
            total_hours: c.total_hours,
            difficulty: c.difficulty,
            category: c.category,
            xp_reward: c.xp_reward,
            google_form_url: '',
            progress_percent: enrollment ? enrollment.progress_percent : null,
            current_module: enrollment ? enrollment.current_module : null,
            enroll_status: enrollment ? enrollment.status : null,
            mode: enrollment ? enrollment.mode : null
          };
        });

        return mockResponse(mapped);
      }

      // 13. GET COURSE DETAIL & LESSONS
      const courseDetailMatch = url.match(/\/api\/courses\/(\d+)$/);
      if (courseDetailMatch && method === 'GET') {
        const cid = parseInt(courseDetailMatch[1]);
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.id === cid);
        if (!course) return mockResponse({ error: 'Course not found' }, 404);

        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const enrollment = userCourses.find(uc => uc.user_id === currentUser.id && uc.course_id === cid);

        const fullCourseInfo = {
          ...course,
          google_form_url: '',
          progress_percent: enrollment ? enrollment.progress_percent : null,
          current_module: enrollment ? enrollment.current_module : null,
          enroll_status: enrollment ? enrollment.status : null,
          mode: enrollment ? enrollment.mode : null
        };

        const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
        const courseLessons = lessons.filter(l => l.course_id === cid);
        
        const userLessons = JSON.parse(localStorage.getItem('user_lessons') || '[]');
        const lessonsWithCompleted = courseLessons.map(l => {
          const done = userLessons.some(ul => ul.user_id === currentUser.id && ul.lesson_id === l.id);
          return {
            id: l.id,
            module_number: l.module_number,
            lesson_order: l.lesson_order,
            title: l.title,
            content: l.content,
            video_url: '',
            youtube_url: l.youtube_url,
            duration_minutes: l.duration_minutes,
            xp_reward: l.xp_reward,
            completed: done
          };
        });

        const totalLessons = lessonsWithCompleted.length;
        const completedCount = lessonsWithCompleted.filter(l => l.completed).length;
        const allDone = totalLessons > 0 && completedCount === totalLessons;

        return mockResponse({
          course: fullCourseInfo,
          lessons: lessonsWithCompleted,
          total_lessons: totalLessons,
          completed_count: completedCount,
          all_done: allDone
        });
      }

      // 14. ENROLL IN COURSE
      if (url.endsWith('/api/courses/enroll') && method === 'POST') {
        const { course_id } = payload;
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        
        if (userCourses.some(uc => uc.user_id === currentUser.id && uc.course_id === course_id)) {
          return mockResponse({ error: 'Already enrolled' }, 400);
        }

        userCourses.push({
          id: userCourses.length + 1,
          user_id: currentUser.id,
          course_id: course_id,
          current_module: 1,
          progress_percent: 0,
          status: 'active',
          mode: 'SELF-PACED',
          enrolled_at: new Date().toISOString()
        });
        localStorage.setItem('user_courses', JSON.stringify(userCourses));

        // Add Notification
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const matchCourse = courses.find(c => c.id === course_id);
        notifications.push({
          id: notifications.length + 1,
          user_id: currentUser.id,
          title: 'Enrolled! 🎉',
          message: `You enrolled in "${matchCourse ? matchCourse.title : 'a new course'}". Start learning!`,
          type: 'success',
          is_read: 0,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));

        return mockResponse({ success: true });
      }

      // 15. COMPLETE LESSON
      if (url.endsWith('/api/courses/complete-lesson') && method === 'POST') {
        const { lesson_id, module_number, duration } = payload;
        const userLessons = JSON.parse(localStorage.getItem('user_lessons') || '[]');
        
        let alreadyDone = userLessons.some(ul => ul.user_id === currentUser.id && ul.lesson_id === lesson_id);
        if (!alreadyDone) {
          userLessons.push({
            id: userLessons.length + 1,
            user_id: currentUser.id,
            lesson_id: lesson_id,
            completed_at: new Date().toISOString()
          });
          localStorage.setItem('user_lessons', JSON.stringify(userLessons));
        }

        const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
        const lesson = lessons.find(l => l.id === lesson_id);
        const xpGain = lesson ? lesson.xp_reward : 10;
        
        let pct = 0;
        let certIssued = false;

        if (lesson) {
          const cid = lesson.course_id;
          
          // Re-calculate course completion progress percentage
          const courseLessons = lessons.filter(l => l.course_id === cid);
          const completedLessons = courseLessons.filter(l => userLessons.some(ul => ul.user_id === currentUser.id && ul.lesson_id === l.id));
          
          pct = Math.round((completedLessons.length / courseLessons.length) * 100);

          const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
          const ucRecord = userCourses.find(uc => uc.user_id === currentUser.id && uc.course_id === cid);
          if (ucRecord) {
            ucRecord.progress_percent = pct;
            ucRecord.current_module = module_number || ucRecord.current_module;
            if (pct === 100) {
              ucRecord.status = 'completed';
              ucRecord.completed_at = new Date().toISOString();
            }
            localStorage.setItem('user_courses', JSON.stringify(userCourses));
          }

          // Grant XP to user
          if (!alreadyDone) {
            currentUser.xp += xpGain;
            if (currentUser.xp >= currentUser.xp_max) {
              currentUser.level += 1;
              currentUser.xp -= currentUser.xp_max;
            }
            saveUser(currentUser);

            // Update streak log metrics for today
            const streakLogs = JSON.parse(localStorage.getItem('streak_logs') || '[]');
            const todayStr = new Date().toISOString().slice(0, 10);
            const logItem = streakLogs.find(l => l.user_id === currentUser.id && l.log_date === todayStr);
            if (logItem) {
              logItem.xp_earned += xpGain;
              logItem.lessons_completed += 1;
              logItem.minutes_studied += duration || 10;
            } else {
              streakLogs.push({
                id: streakLogs.length + 1,
                user_id: currentUser.id,
                log_date: todayStr,
                xp_earned: xpGain,
                lessons_completed: 1,
                minutes_studied: duration || 10
              });
            }
            localStorage.setItem('streak_logs', JSON.stringify(streakLogs));
          }

          // Issue certificate if completed
          if (pct === 100) {
            const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
            if (!certificates.some(c => c.user_id === currentUser.id && c.course_id === cid)) {
              const certNum = 'PGI-' + Math.random().toString(36).substring(2, 12).toUpperCase();
              certificates.push({
                id: certificates.length + 1,
                user_id: currentUser.id,
                course_id: cid,
                certificate_number: certNum,
                issued_at: new Date().toISOString()
              });
              localStorage.setItem('certificates', JSON.stringify(certificates));

              const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
              const courses = JSON.parse(localStorage.getItem('courses') || '[]');
              const matchCourse = courses.find(c => c.id === cid);
              notifications.push({
                id: notifications.length + 1,
                user_id: currentUser.id,
                title: '🎓 Certificate Earned!',
                message: `You completed the course "${matchCourse ? matchCourse.title : ''}"! Certificate #${certNum} issued.`,
                type: 'success',
                is_read: 0,
                created_at: new Date().toISOString()
              });
              localStorage.setItem('notifications', JSON.stringify(notifications));

              certIssued = true;
            }
          }
        }

        return mockResponse({
          success: true,
          xp_gained: xpGain,
          progress: pct,
          cert_issued: certIssued,
          already_done: alreadyDone
        });
      }

      // ── ASSIGNMENTS API ──

      // 16. GET ALL ASSIGNMENTS
      if (url.endsWith('/api/assignments') && method === 'GET') {
        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');

        const activeUserAssignments = userAssignments.filter(ua => ua.user_id === currentUser.id);
        const mapped = activeUserAssignments.map(ua => {
          const assign = assignments.find(a => a.id === ua.assignment_id);
          if (!assign) return null;
          const course = courses.find(c => c.id === assign.course_id);
          return {
            id: assign.id,
            course_id: assign.course_id,
            title: assign.title,
            description: assign.description,
            due_date: assign.due_date,
            max_score: assign.max_score,
            xp_reward: assign.xp_reward,
            type: assign.type,
            course_title: course ? course.title : '',
            submission_status: ua.status,
            score: ua.score,
            feedback: ua.feedback,
            submitted_at: ua.submitted_at
          };
        }).filter(Boolean);

        return mockResponse(mapped);
      }

      // 17. ADD NEW ASSIGNMENT (Admin simulated)
      if (url.endsWith('/api/assignments/add') && method === 'POST') {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const { course_id, title, description, due_date, max_score, xp_reward, type } = payload;
        
        const newAssign = {
          id: assignments.length + 1,
          course_id: parseInt(course_id),
          title: title,
          description: description,
          due_date: due_date,
          max_score: parseInt(max_score || 100),
          xp_reward: parseInt(xp_reward || 50),
          type: type || 'Assignment'
        };
        assignments.push(newAssign);
        localStorage.setItem('assignments', JSON.stringify(assignments));

        // Add to active students' lists who are enrolled in this course
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const enrolledUsers = userCourses.filter(uc => uc.course_id === newAssign.course_id && uc.status === 'active');
        
        enrolledUsers.forEach(uc => {
          userAssignments.push({
            id: userAssignments.length + 1,
            user_id: uc.user_id,
            assignment_id: newAssign.id,
            status: 'pending',
            score: null,
            feedback: null,
            submitted_at: null
          });
        });
        localStorage.setItem('user_assignments', JSON.stringify(userAssignments));

        return mockResponse({ success: true, id: newAssign.id });
      }

      // 18. SUBMIT ASSIGNMENT
      if (url.endsWith('/api/assignments/submit') && method === 'POST') {
        const { assignment_id } = payload;
        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const record = userAssignments.find(ua => ua.user_id === currentUser.id && ua.assignment_id === assignment_id);
        
        if (record) {
          record.status = 'submitted';
          record.submitted_at = new Date().toISOString();
          localStorage.setItem('user_assignments', JSON.stringify(userAssignments));
        }

        return mockResponse({ success: true });
      }

      // ── SCHEDULE API ──

      // 19. GET EVENTS
      if (url.includes('/api/schedule') && method === 'GET') {
        const urlObj = new URL(url, window.location.origin);
        const month = parseInt(urlObj.searchParams.get('month') || (new Date().getMonth() + 1));
        const year = parseInt(urlObj.searchParams.get('year') || new Date().getFullYear());

        const events = JSON.parse(localStorage.getItem('schedule_events') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        const filtered = events.filter(e => {
          if (e.user_id !== currentUser.id) return false;
          const eDate = new Date(e.event_date);
          return (eDate.getMonth() + 1) === month && eDate.getFullYear() === year;
        }).map(e => {
          const course = courses.find(c => c.id === e.course_id);
          return {
            id: e.id,
            title: e.title,
            description: e.description,
            event_type: e.event_type,
            event_date: e.event_date,
            start_time: e.start_time,
            end_time: e.end_time,
            course_title: course ? course.title : ''
          };
        });

        return mockResponse(filtered);
      }

      // 20. ADD EVENT
      if (url.endsWith('/api/schedule/add') && method === 'POST') {
        const events = JSON.parse(localStorage.getItem('schedule_events') || '[]');
        const { title, description, event_type, event_date, start_time, end_time, course_id } = payload;

        const newEvent = {
          id: events.length + 1,
          user_id: currentUser.id,
          title: title,
          description: description,
          event_type: event_type || 'study',
          event_date: event_date,
          start_time: start_time,
          end_time: end_time || null,
          course_id: course_id ? parseInt(course_id) : null
        };
        events.push(newEvent);
        localStorage.setItem('schedule_events', JSON.stringify(events));

        return mockResponse({ success: true, id: newEvent.id });
      }

      // 21. DELETE EVENT
      const deleteEventMatch = url.match(/\/api\/schedule\/delete\/(\d+)$/);
      if (deleteEventMatch && method === 'DELETE') {
        const eid = parseInt(deleteEventMatch[1]);
        let events = JSON.parse(localStorage.getItem('schedule_events') || '[]');
        events = events.filter(e => !(e.id === eid && e.user_id === currentUser.id));
        localStorage.setItem('schedule_events', JSON.stringify(events));
        return mockResponse({ success: true });
      }

      // ── NOTIFICATIONS API ──

      // 22. GET NOTIFICATIONS
      if (url.endsWith('/api/notifications') && method === 'GET') {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userNotifs = notifications.filter(n => n.user_id === currentUser.id);
        // Sort descending by date
        userNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return mockResponse(userNotifs);
      }

      // 23. MARK READ
      if (url.endsWith('/api/notifications/mark-read') && method === 'POST') {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const { id } = payload;

        notifications.forEach(n => {
          if (n.user_id === currentUser.id) {
            if (!id || n.id === id) {
              n.is_read = 1;
            }
          }
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return mockResponse({ success: true });
      }

      // 24. DELETE NOTIFICATION
      const deleteNotifMatch = url.match(/\/api\/notifications\/delete\/(\d+)$/);
      if (deleteNotifMatch && method === 'DELETE') {
        const nid = parseInt(deleteNotifMatch[1]);
        let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications = notifications.filter(n => !(n.id === nid && n.user_id === currentUser.id));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return mockResponse({ success: true });
      }

      // ── NAV COUNTS API ──

      // 25. GET BADGE COUNTS
      if (url.endsWith('/api/nav-counts') && method === 'GET') {
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const events = JSON.parse(localStorage.getItem('schedule_events') || '[]');

        // pending courses that are 100% progress but have no certificate issued
        const pendingTests = userCourses.filter(uc => {
          if (uc.user_id !== currentUser.id || uc.progress_percent !== 100) return false;
          const hasCert = certificates.some(cert => cert.user_id === currentUser.id && cert.course_id === uc.course_id);
          return !hasCert;
        }).length;

        // pending assignments (excluding quizzes)
        const pendingAssignments = userAssignments.filter(ua => {
          if (ua.user_id !== currentUser.id || ua.status !== 'pending') return false;
          const matching = assignments.find(a => a.id === ua.assignment_id);
          return matching && matching.type !== 'Quiz';
        }).length;

        // pending quizzes
        const pendingQuizzes = userAssignments.filter(ua => {
          if (ua.user_id !== currentUser.id || ua.status !== 'pending') return false;
          const matching = assignments.find(a => a.id === ua.assignment_id);
          return matching && matching.type === 'Quiz';
        }).length;

        // unread notifications
        const unreadNotifs = notifications.filter(n => n.user_id === currentUser.id && !n.is_read).length;

        // today's events
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayEvents = events.filter(e => e.user_id === currentUser.id && e.event_date === todayStr).length;

        return mockResponse({
          courses: pendingTests,
          assignments: pendingAssignments,
          quiz: pendingQuizzes,
          notifications: unreadNotifs,
          schedule: todayEvents
        });
      }

      // ── LEADERBOARD API ──

      // 26. GET LEADERBOARD
      if (url.includes('/api/leaderboard') && method === 'GET') {
        // Return simulated students ranking + active user details
        const mockStudents = [
          { id: 10, full_name: 'Anjali Sharma', username: 'anjali', level: 6, score: 1450, avatar_url: '', streak_days: 28, lessons_done: 22 },
          { id: 11, full_name: 'Vikram Malhotra', username: 'vikram', level: 5, score: 980, avatar_url: '', streak_days: 14, lessons_done: 18 },
          { id: 12, full_name: 'Siddharth Roy', username: 'sid_r', level: 4, score: 850, avatar_url: '', streak_days: 12, lessons_done: 15 },
          { id: 1, full_name: currentUser.full_name, username: currentUser.username, level: currentUser.level, score: currentUser.xp + (currentUser.level - 1) * 1000, avatar_url: currentUser.avatar_url, streak_days: currentUser.streak_days, lessons_done: JSON.parse(localStorage.getItem('user_lessons') || '[]').filter(ul => ul.user_id === currentUser.id).length },
          { id: 13, full_name: 'Pooja Hegde', username: 'pooja', level: 3, score: 480, avatar_url: '', streak_days: 4, lessons_done: 9 },
          { id: 14, full_name: 'Rohan Deshmukh', username: 'rohan_d', level: 2, score: 320, avatar_url: '', streak_days: 2, lessons_done: 6 }
        ];

        // Sort score descending
        mockStudents.sort((a, b) => b.score - a.score);

        // Map rank and flag current user
        mockStudents.forEach((student, index) => {
          student.rank = index + 1;
          student.is_current = (student.id === currentUser.id);
        });

        return mockResponse(mockStudents);
      }

      // ── CERTIFICATIONS API ──

      // 27. GET CERTIFICATES
      if (url.endsWith('/api/certifications') && method === 'GET') {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');

        const activeCerts = certificates.filter(c => c.user_id === currentUser.id).map(c => {
          const course = courses.find(co => co.id === c.course_id);
          return course ? {
            id: c.id,
            course_id: c.course_id,
            certificate_number: c.certificate_number,
            issued_at: c.issued_at,
            course_title: course.title,
            instructor: course.instructor,
            category: course.category,
            difficulty: course.difficulty,
            total_hours: course.total_hours
          } : null;
        }).filter(Boolean);

        // Courses that are 80%+ progress but not 100% complete
        const inProgress = userCourses.filter(uc => uc.user_id === currentUser.id && uc.progress_percent >= 80 && uc.progress_percent < 100).map(uc => {
          const course = courses.find(co => co.id === uc.course_id);
          return course ? {
            course_id: uc.course_id,
            title: course.title,
            category: course.category,
            progress_percent: uc.progress_percent
          } : null;
        }).filter(Boolean);

        return mockResponse({
          certificates: activeCerts,
          in_progress: inProgress
        });
      }

      // ── QUIZ API ──

      // 28. GET QUIZ DETAILS
      const getQuizMatch = url.match(/\/api\/quiz\/(\d+)$/);
      if (getQuizMatch && method === 'GET') {
        const aid = parseInt(getQuizMatch[1]);
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const assign = assignments.find(a => a.id === aid);
        
        if (!assign) return mockResponse({ error: 'Quiz assignment not found' }, 404);
        
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.id === assign.course_id);

        const quizQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        const questions = quizQuestions.filter(q => q.assignment_id === aid);

        return mockResponse({
          assignment: {
            ...assign,
            course_title: course ? course.title : ''
          },
          questions: questions
        });
      }

      // 29. ADD QUIZ QUESTION (Admin simulated)
      if (url.endsWith('/api/quiz/add-question') && method === 'POST') {
        const quizQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        const { assignment_id, question, option_a, option_b, option_c, option_d, correct_option, explanation } = payload;
        
        const newQ = {
          id: quizQuestions.length + 1,
          assignment_id: parseInt(assignment_id),
          question: question,
          option_a: option_a,
          option_b: option_b,
          option_c: option_c || null,
          option_d: option_d || null,
          correct_option: correct_option,
          explanation: explanation || ''
        };
        quizQuestions.push(newQ);
        localStorage.setItem('quiz_questions', JSON.stringify(quizQuestions));

        return mockResponse({ success: true, id: newQ.id });
      }

      // 30. SUBMIT QUIZ RESULTS
      if (url.endsWith('/api/quiz/submit') && method === 'POST') {
        const { assignment_id, answers } = payload;
        const quizQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        const questions = quizQuestions.filter(q => q.assignment_id === assignment_id);

        let correct = 0;
        const total = questions.length;

        questions.forEach(q => {
          if (answers[q.id.toString()] === q.correct_option) {
            correct++;
          }
        });

        const score = total ? Math.round((correct / total) * 100) : 0;

        // Save status and score in user assignments
        const userAssignments = JSON.parse(localStorage.getItem('user_assignments') || '[]');
        const record = userAssignments.find(ua => ua.user_id === currentUser.id && ua.assignment_id === assignment_id);
        
        if (record) {
          record.status = 'graded';
          record.score = score;
          record.submitted_at = new Date().toISOString();
          localStorage.setItem('user_assignments', JSON.stringify(userAssignments));
        }

        // Grant XP for passing scores (>= 60)
        if (score >= 60) {
          const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          const assign = assignments.find(a => a.id === assignment_id);
          const xpBase = assign ? assign.xp_reward : 50;
          const xpEarned = Math.round(xpBase * (score / 100));

          currentUser.xp += xpEarned;
          if (currentUser.xp >= currentUser.xp_max) {
            currentUser.level += 1;
            currentUser.xp -= currentUser.xp_max;
          }
          saveUser(currentUser);

          // Add completion notification
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          notifications.push({
            id: notifications.length + 1,
            user_id: currentUser.id,
            title: 'Quiz Graded! 📝',
            message: `You passed "${assign ? assign.title : 'Quiz'}" with a score of ${score}%. +${xpEarned} XP awarded!`,
            type: 'success',
            is_read: 0,
            created_at: new Date().toISOString()
          });
          localStorage.setItem('notifications', JSON.stringify(notifications));
        }

        const detailResults = questions.map(q => ({
          id: q.id,
          question: q.question,
          your_answer: answers[q.id.toString()] || null,
          correct_option: q.correct_option,
          explanation: q.explanation || '',
          options: {
            a: q.option_a,
            b: q.option_b,
            c: q.option_c,
            d: q.option_d
          }
        }));

        return mockResponse({
          score: score,
          correct: correct,
          total: total,
          results: detailResults
        });
      }

      // 31. PROFILE PAGE DETAILS
      const profileMatch = url.match(/\/api\/profile\/(\d+)$/);
      if (profileMatch && method === 'GET') {
        const uid = parseInt(profileMatch[1]);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userObj = users.find(u => u.id === uid);
        if (!userObj) return mockResponse({ error: 'User not found' }, 404);

        const userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const earnedAchievements = userAchievements
          .filter(ua => ua.user_id === uid)
          .map(ua => {
            const match = achievements.find(a => a.id === ua.achievement_id);
            return match ? { title: match.title, icon: match.icon, earned_at: ua.earned_at } : null;
          }).filter(Boolean);

        const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const studentCourses = userCourses
          .filter(uc => uc.user_id === uid)
          .map(uc => {
            const course = courses.find(co => co.id === uc.course_id);
            return course ? { title: course.title, category: course.category, progress_percent: uc.progress_percent } : null;
          }).filter(Boolean);

        return mockResponse({
          user: {
            id: userObj.id,
            full_name: userObj.full_name,
            username: userObj.username,
            level: userObj.level,
            xp: userObj.xp,
            streak_days: userObj.streak_days,
            bio: userObj.bio,
            avatar_url: userObj.avatar_url
          },
          badges: earnedAchievements,
          courses: studentCourses
        });
      }

      // 32. ADMIN STATS & ENDPOINTS
      if (url.endsWith('/api/admin/stats') && method === 'GET') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
        const userLessons = JSON.parse(localStorage.getItem('user_lessons') || '[]');

        const studentCount = users.filter(u => !u.is_admin).length;
        const totalCourses = courses.length;
        const totalLessons = lessons.length;
        const lessonsDone = userLessons.length;

        return mockResponse({
          students: studentCount,
          courses: totalCourses,
          lessons: totalLessons,
          with_video: totalLessons, // Mocking all as having video URLs
          no_video: 0,
          completions: lessonsDone
        });
      }

      if (url.includes('/api/admin/courses/') && url.endsWith('/form-url') && method === 'POST') {
        return mockResponse({ success: true });
      }

      if (url.endsWith('/api/admin/courses/add') && method === 'POST') {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const { title, description, instructor, total_modules, total_hours, difficulty, category, xp_reward } = payload;
        
        const newCourse = {
          id: courses.length + 1,
          title: title,
          description: description,
          instructor: instructor,
          total_modules: parseInt(total_modules || 1),
          total_hours: parseFloat(total_hours || 1),
          difficulty: difficulty || 'Beginner',
          category: category || 'General',
          xp_reward: parseInt(xp_reward || 100)
        };
        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));
        return mockResponse({ success: true, id: newCourse.id });
      }

      return mockResponse({ error: 'Mock endpoint not implemented' }, 501);
    }

    // Default fallback to real fetch for non-API requests (stylesheets, scripts, images)
    return originalFetch.apply(this, arguments);
  };
})();
