const form = document.querySelector('form');
const messageBox = document.createElement('div');

form.appendChild(messageBox);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const topic = form.topic.value;
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    messageBox.textContent = 'Please fill in all required fields.';
    return;
  }

  const { error } = await supabaseClient
    .from('contact_messages')
    .insert({
      name,
      email,
      topic,
      message
    });

  if (error) {
    console.error('Contact form error:', error);
    messageBox.textContent = 'Something went wrong. Please try again.';
    return;
  }

  form.reset();
  messageBox.textContent = 'Thank you! Your message has been sent.';
});