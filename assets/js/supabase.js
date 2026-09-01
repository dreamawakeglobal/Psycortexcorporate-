/**
 * Supabase Client Integration for Psycortex Website
 * Handles contact form submissions and lead collection directly to Supabase DB.
 */

// Supabase Client Credentials
const SUPABASE_URL = 'https://yefobyrygndbvhuzhkop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZm9ieXJ5Z25kYnZodXpoa29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NzcyNTIsImV4cCI6MjEwMjE1MzI1Mn0.NYLa0a5NVErZym6RgC3xZ6zuH1-7fulGbxspggpydZQ';

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/**
 * Submits a contact inquiry to the Supabase database
 * @param {Object} formData { name, email, organization, engagement, message }
 * @returns {Promise<{ data, error }>}
 */
async function submitInquiry(formData) {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase client not initialized. Ensure @supabase/supabase-js is loaded.');
    return { data: null, error: new Error('Supabase client unavailable') };
  }

  const payload = {
    name: formData.name,
    email: formData.email,
    organization: formData.organization,
    engagement_type: formData.engagement,
    message: formData.message,
    created_at: new Date().toISOString()
  };

  const { data, error } = await client
    .from('inquiries')
    .insert([payload]);

  let emailSent = false;
  try {
    // Attempt to invoke the Supabase Edge Function to send email notification via Resend
    const funcRes = await client.functions.invoke('send-inquiry', {
      body: payload
    });
    if (!funcRes.error) {
      emailSent = true;
    }
  } catch (fnErr) {
    // Edge function invocation fallback handled by database trigger if edge function is pending
  }

  return { data, error, emailSent };
}

window.PsycortexSupabase = {
  submitInquiry,
  getSupabaseClient
};
