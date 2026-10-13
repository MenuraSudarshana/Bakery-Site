document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const formMessage = document.getElementById("formMessage");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showMessage("", false);

    const payload = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      message: message.value.trim()
    };

    if (!payload.fullName || !payload.email || !payload.message) {
      showMessage("Please fill all fields.", true);
      return;
    }

    fetch("http://localhost:8080/api/contact-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.text();
      })
      .then(function (result) {
        if (result === "SUCCESS_EMAIL_SENT") {
          showMessage("Thank you for contacting Cake Factory. We sent a confirmation email, and our team will contact you within 2-3 working days.", false);
          form.reset();
          return;
        }

        if (result.startsWith("SUCCESS_SAVED_EMAIL_FAILED")) {
          const reason = result.includes(":") ? result.split(":").slice(1).join(":").trim() : "";
          showMessage(
            "Your message was saved, but confirmation email could not be sent right now." +
            (reason ? " (" + reason + ")" : ""),
            true
          );
          form.reset();
          return;
        }

        if (result === "INVALID") {
          showMessage("Please fill all fields correctly.", true);
          return;
        }

        showMessage("Please check your data and try again.", true);
      })
      .catch(function () {
        showMessage("Server error. Try again later.", true);
      });
  });

  function showMessage(text, isError) {
    formMessage.textContent = text;
    formMessage.classList.toggle("error", isError);
  }
});
