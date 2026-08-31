// Reveal on scroll
const revealTargets = document.querySelectorAll(
  "section h2, .card, .pf, .story, .insight, .feature, .stat, .hero-copy, .hero-visual, .orbit-system, .philosophy-scroll"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));

// Animated stat counters
const statNumbers = document.querySelectorAll(".stat strong[data-count]");
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countIO.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const decimals = String(target).includes(".") ? 1 : 0;
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.4 }
);
statNumbers.forEach((el) => countIO.observe(el));

// Insight filters (visual state only)
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

// Sticky nav shading
const navWrap = document.querySelector(".nav-wrap");
window.addEventListener("scroll", () => {
  navWrap.classList.toggle("is-scrolled", window.scrollY > 24);
});

/* =========================================================
   PHILOSOPHY ITEMS — Scroll reveal
========================================================= */

const phiItems = document.querySelectorAll(".philosophy-item");
const phiIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  { threshold: 0.4 }
);
phiItems.forEach((item) => phiIO.observe(item));



/* =========================================================
   LOGIN FORM
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const roleSelect =
    document.getElementById("role");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");

const roleError =
    document.getElementById("roleError");

const loginMessage =
    document.getElementById("loginMessage");

const passwordToggle =
    document.getElementById("passwordToggle");



/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordToggle.textContent = "◉";

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            passwordToggle.textContent = "◉";

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });
}



/* =========================================================
   CLEAR ERROR
========================================================= */

if (emailInput) {
    emailInput.addEventListener("input", () => {

        emailError.textContent = "";

        emailInput
            .closest(".input-group")
            .classList.remove("has-error");

    });
}


if (passwordInput) {
    passwordInput.addEventListener("input", () => {

        passwordError.textContent = "";

        passwordInput
            .closest(".input-group")
            .classList.remove("has-error");

    });
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}/* =========================================================
   FORM SUBMIT
========================================================= */

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Reset */

        emailError.textContent = "";
        passwordError.textContent = "";
        loginMessage.textContent = "";

        if (roleError) roleError.textContent = "";

        emailInput
            .closest(".input-group")
            .classList.remove("has-error");

        passwordInput
            .closest(".input-group")
            .classList.remove("has-error");

        if (roleSelect) {
            roleSelect
                .closest(".input-group")
                .classList.remove("has-error");
        }


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const role =
            roleSelect ? roleSelect.value : "user";


        let valid = true;



        /* =====================================================
           EMAIL
        ====================================================== */

        if (email === "") {

            emailError.textContent =
                "Please enter your email address.";

            emailInput
                .closest(".input-group")
                .classList.add("has-error");

            valid = false;

        } else if (!validateEmail(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            emailInput
                .closest(".input-group")
                .classList.add("has-error");

            valid = false;
        }



        /* =====================================================
           PASSWORD
        ====================================================== */

        if (password.trim() === "") {

            passwordError.textContent =
                "Please enter your password.";

            passwordInput
                .closest(".input-group")
                .classList.add("has-error");

            valid = false;

        } else if (password.length < 6) {

            passwordError.textContent =
                "Password must contain at least 6 characters.";

            passwordInput
                .closest(".input-group")
                .classList.add("has-error");

            valid = false;
        }



        /* =====================================================
           ROLE
        ====================================================== */

        if (roleSelect && role === "") {

            roleError.textContent =
                "Please select your role.";

            roleSelect
                .closest(".input-group")
                .classList.add("has-error");

            valid = false;
        }



        /* =====================================================
           STOP IF INVALID
        ====================================================== */

        if (!valid) {

            if (email === "") {

                emailInput.focus();

            } else if (!validateEmail(email)) {

                emailInput.focus();

            } else {

                passwordInput.focus();

            }

            return;
        }



        /* =====================================================
           SUCCESS
        ====================================================== */

        const isAdmin = role === "admin";

        const userData = {
            email: email,
            role: isAdmin ? "admin" : "user",
            name: email.split("@")[0],
            loginTime: new Date().toISOString()
        };

        sessionStorage.setItem("stackly_user", JSON.stringify(userData));

        loginMessage.textContent =
            "Sign in successful. Welcome to STACKLY.";

        loginMessage.style.color =
            "#c7ad45";

        setTimeout(() => {
            window.location.href = isAdmin
                ? "/admin-dashboard.html"
                : "/user-dashboard.html";
        }, 600);

    });
}


/* =========================================================
   REGISTER FORM
========================================================= */

const registerForm =
    document.getElementById("registerForm");


const regNameInput =
    registerForm ? document.getElementById("name") : null;

const regEmailInput =
    registerForm ? document.getElementById("email") : null;

const regCompanyInput =
    registerForm ? document.getElementById("company") : null;

const regRoleInput =
    registerForm ? document.getElementById("role") : null;

const regPasswordInput =
    registerForm ? document.getElementById("password") : null;

const regConfirmPasswordInput =
    registerForm ? document.getElementById("confirmPassword") : null;


const regNameError =
    registerForm ? document.getElementById("nameError") : null;

const regEmailError =
    registerForm ? document.getElementById("emailError") : null;

const regCompanyError =
    registerForm ? document.getElementById("companyError") : null;

const regRoleError =
    registerForm ? document.getElementById("roleError") : null;

const regPasswordError =
    registerForm ? document.getElementById("passwordError") : null;

const regConfirmPasswordError =
    registerForm ? document.getElementById("confirmPasswordError") : null;


const regFormMessage =
    registerForm ? document.getElementById("formMessage") : null;



/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}



/* =========================================================
   CLEAR ALL ERRORS (Register)
========================================================= */

function clearRegErrors() {

    if (regNameError) regNameError.textContent = "";
    if (regEmailError) regEmailError.textContent = "";
    if (regCompanyError) regCompanyError.textContent = "";
    if (regRoleError) regRoleError.textContent = "";
    if (regPasswordError) regPasswordError.textContent = "";
    if (regConfirmPasswordError) regConfirmPasswordError.textContent = "";

    if (regFormMessage) regFormMessage.textContent = "";


    document
        .querySelectorAll(".form-field")
        .forEach(field => {

            field.classList.remove("has-error");

        });

}



/* =========================================================
   SHOW ERROR (Register)
========================================================= */

function showRegError(input, errorElement, message) {

    errorElement.textContent = message;

    input
        .closest(".form-field")
        .classList.add("has-error");

}



/* =========================================================
   FORM SUBMIT
========================================================= */if (registerForm) {
    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            clearRegErrors();


            /* -----------------------------------------------
               GET VALUES
            ------------------------------------------------ */

            const name =
                regNameInput.value.trim();

            const email =
                regEmailInput.value.trim();

            const company =
                regCompanyInput.value.trim();

            const role =
                regRoleInput.value;

            const password =
                regPasswordInput.value;

            const confirmPassword =
                regConfirmPasswordInput.value;

            let isValid = true;


            /* =================================================
               NAME
            ================================================= */

            if (name === "") {

                showRegError(
                    regNameInput,
                    regNameError,
                    "Please enter your full name."
                );

                isValid = false;

            } else if (name.length < 2) {

                showRegError(
                    regNameInput,
                    regNameError,
                    "Name must contain at least 2 characters."
                );

                isValid = false;
            }



            /* =================================================
               EMAIL
            ================================================= */

            if (email === "") {

                showRegError(
                    regEmailInput,
                    regEmailError,
                    "Please enter your email address."
                );

                isValid = false;

            } else if (!isValidEmail(email)) {

                showRegError(
                    regEmailInput,
                    regEmailError,
                    "Please enter a valid email address."
                );

                isValid = false;
            }



            /* =================================================
               COMPANY
            ================================================= */

            if (company === "") {

                showRegError(
                    regCompanyInput,
                    regCompanyError,
                    "Please enter your company name."
                );

                isValid = false;

            } else if (company.length < 2) {

                showRegError(
                    regCompanyInput,
                    regCompanyError,
                    "Company name is too short."
                );

                isValid = false;
            }



            /* =================================================
               ROLE
            ================================================= */

            if (role === "") {

                showRegError(
                    regRoleInput,
                    regRoleError,
                    "Please select your role."
                );

                isValid = false;
            }



            /* =================================================
               PASSWORD
            ================================================= */

            if (password === "") {

                showRegError(
                    regPasswordInput,
                    regPasswordError,
                    "Please create a password."
                );

                isValid = false;

            } else if (password.length < 6) {

                showRegError(
                    regPasswordInput,
                    regPasswordError,
                    "Password must contain at least 6 characters."
                );

                isValid = false;
            }



            /* =================================================
               CONFIRM PASSWORD
            ================================================= */

            if (confirmPassword === "") {

                showRegError(
                    regConfirmPasswordInput,
                    regConfirmPasswordError,
                    "Please confirm your password."
                );

                isValid = false;

            } else if (
                password !== confirmPassword
            ) {

                showRegError(
                    regConfirmPasswordInput,
                    regConfirmPasswordError,
                    "Passwords do not match."
                );

                isValid = false;
            }



            /* =================================================
               STOP IF INVALID
            ================================================= */

            if (!isValid) {

                return;
            }


            /* =================================================
               GET ALL CREDENTIALS
            ================================================= */

            const credentials = {

                name: name,

                email: email,

                company: company,

                role: role,

                password: password

            };

            console.log(
                "Registration credentials:",
                credentials
            );


            /* =================================================
               SUCCESS
            ================================================= */

            regFormMessage.textContent =
                "Account created successfully! Redirecting to login...";


            regFormMessage.style.color =
                "#c7ad45";


            registerForm.reset();


            setTimeout(() => {
                window.location.href = "./login.html";
            }, 1500);

        }
    );
}



/* =========================================================
   LIVE VALIDATION (Register)
========================================================= */

if (regNameInput) {
    regNameInput.addEventListener(
        "input",
        () => {
            regNameError.textContent = "";
            regNameInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}

if (regEmailInput) {
    regEmailInput.addEventListener(
        "input",
        () => {
            regEmailError.textContent = "";
            regEmailInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}

if (regCompanyInput) {
    regCompanyInput.addEventListener(
        "input",
        () => {
            regCompanyError.textContent = "";
            regCompanyInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}

if (regRoleInput) {
    regRoleInput.addEventListener(
        "change",
        () => {
            regRoleError.textContent = "";
            regRoleInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}

if (regPasswordInput) {
    regPasswordInput.addEventListener(
        "input",
        () => {
            regPasswordError.textContent = "";
            regPasswordInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}

if (regConfirmPasswordInput) {
    regConfirmPasswordInput.addEventListener(
        "input",
        () => {
            regConfirmPasswordError.textContent = "";
            regConfirmPasswordInput
                .closest(".form-field")
                .classList.remove("has-error");
        }
    );
}