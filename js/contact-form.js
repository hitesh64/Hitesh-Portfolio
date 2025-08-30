document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('1Kym111O6OdeEr7bM');

    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // DEBUGGING: Log form data before sending
            console.log("Form data:", {
                name: form.elements.name.value,
                email: form.elements.email.value,
                subject: form.elements.subject.value,
                message: form.elements.message.value
            });
            
          emailjs.sendForm(
  'service_your_real_service_id', // From dashboard
  'template_q6kqsgu',
  this
)
.then((response) => {
  console.log('Email sent!', response);
  alert('Email successfully sent!'); // Visual confirmation
}, (error) => {
  console.error('Email failed:', error);
  alert('Failed to send: ' + error.text); // Show error
});
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, (error) => {
                submitBtn.textContent = 'Failed to send. Try again.';
                submitBtn.disabled = false;
                console.error('EmailJS error:', error);
            });
        });
    }
});