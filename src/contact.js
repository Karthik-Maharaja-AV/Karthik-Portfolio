const form = document.querySelector('form[name="contact"]');
const status = document.querySelector('#form-status');
const fallback = form.querySelector('.ap-form-fallback');
const submit = form.querySelector('button[type="submit"]');
const submitLabel = submit.querySelector('.ap-submit-label');
const fields = [...form.querySelectorAll('[required]')];
const message = form.elements.message;
const count = document.querySelector('#message-count');
let sending = false;

// Preserve native validation when JavaScript is unavailable.
form.noValidate = true;
function validate(field) {
  let error = '';
  if (!field.value.trim()) {
    error = { name: 'Please enter your name.', email: 'Please enter your email address.', message: 'Tell me a little about what you have in mind.' }[field.name];
  } else if (field.type === 'email' && field.validity.typeMismatch) {
    error = 'Enter a valid email address, like alex@company.com.';
  } else if (!field.validity.valid) {
    error = 'Please check this field.';
  }
  field.setAttribute('aria-invalid', String(Boolean(error)));
  document.querySelector(`#${field.name}-error`).textContent = error;
  return !error;
}
function updateCount() {
  count.textContent = `${message.value.length.toLocaleString('en-US')} / 5,000`;
}
function setStatus(text, state) {
  status.textContent = text;
  status.dataset.state = state;
  fallback.hidden = !['error', 'preview'].includes(state);
}
for (const field of fields) {
  field.addEventListener('blur', () => validate(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validate(field);
    if (status.dataset.state === 'validation' && fields.every((input) => input.getAttribute('aria-invalid') !== 'true')) {
      setStatus('', 'idle');
    }
  });
}
message.addEventListener('input', updateCount);
form.addEventListener('reset', () => {
  for (const field of fields) {
    field.removeAttribute('aria-invalid');
    document.querySelector(`#${field.name}-error`).textContent = '';
  }
  requestAnimationFrame(updateCount);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending) return;
  const results = fields.map(validate);
  const firstInvalid = fields[results.indexOf(false)];
  if (firstInvalid) {
    setStatus('Please check the highlighted fields before sending.', 'validation');
    firstInvalid.focus();
    return;
  }
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
    setStatus('This local preview can’t send messages yet. You can email me directly instead.', 'preview');
    return;
  }
  sending = true;
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  submitLabel.textContent = 'Sending…';
  setStatus('Sending your message…', 'sending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Your message couldn’t be sent. Please try again, or email me directly.');
    form.reset();
    setStatus('Message sent. Thank you for reaching out!', 'success');
  } catch (error) {
    setStatus(error.name === 'AbortError' ? 'Sending took too long. Your message is still here—try again or send an email instead.' : 'Your message couldn’t be sent. Your details are still here—try again or email me directly.', 'error');
  } finally {
    clearTimeout(timeout);
    sending = false;
    submit.disabled = false;
    submitLabel.textContent = 'Send message';
    form.removeAttribute('aria-busy');
  }
});
updateCount();
