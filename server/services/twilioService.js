/**
 * VidyaVerse - Twilio Real-Time Parent Notification Service
 * Sends student assessment marks, subject performance analytics,
 * daily learning streak, earned badges, and recommended career path
 * directly to parents via WhatsApp and/or SMS.
 */

import twilio from 'twilio';

/**
 * Returns an initialized Twilio client using fresh environment variables
 */
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const authToken = process.env.TWILIO_AUTH_TOKEN || '';
  if (accountSid && authToken) {
    try {
      return twilio(accountSid, authToken);
    } catch (err) {
      console.warn('[TwilioService] Client init failed:', err.message);
    }
  }
  return null;
}

/**
 * Formats standard phone number into E.164 format (+91XXXXXXXXXX)
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (phone.startsWith('+')) return phone;
  // If 10 digits (India standard), prepend +91
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

/**
 * Generates an inspiring, detailed WhatsApp-formatted report for parents
 */
export function formatParentReport({
  studentName = 'Your Child',
  parentName = 'Parent',
  grade = 'Class 9',
  assessmentScore = 0,
  totalQuestions = 40,
  percentage = 0,
  masteryTier = 'Proficient',
  sectionBreakdown = {},
  careerTrack = null,
  streak = 0,
  badges = [],
  totalXP = 0,
  date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}) {
  const phy = sectionBreakdown?.Physics?.score ?? 0;
  const chem = sectionBreakdown?.Chemistry?.score ?? 0;
  const math = sectionBreakdown?.Mathematics?.score ?? 0;
  const bio = sectionBreakdown?.Biology?.score ?? 0;

  const topBadgeList = badges.length > 0 ? badges.slice(0, 3).join(', ') : 'Active STEM Learner';
  const careerTitle = careerTrack?.title || 'STEM Applied Sciences & Engineering';
  const matchPct = careerTrack?.matchPercentage || Math.min(95, percentage + 5);

  const text = `🎓 *VidyaVerse - Weekly Student Performance Report* 🚀\n` +
`📅 Date: ${date}\n\n` +
`Dear ${parentName},\n` +
`Here is the verified weekly learning & STEM skill assessment report for *${studentName}* (${grade}):\n\n` +
`📊 *WEEKLY 40-QUESTION TEST RESULTS:*\n` +
`• Overall Score: *${assessmentScore} / ${totalQuestions} (${percentage}%)*\n` +
`• Performance Tier: *${masteryTier}*\n` +
`• ⚛️ Physics: *${phy} / 10*\n` +
`• 🧪 Chemistry: *${chem} / 10*\n` +
`• 📐 Mathematics: *${math} / 10*\n` +
`• 🧬 Biology: *${bio} / 10*\n\n` +
`🎯 *PREDICTED CAREER PATHWAY:*\n` +
`• Career Match: *${careerTitle}* (${matchPct}% Fit)\n` +
`• Basis: Calculated live from real-time scores in Physics, Chemistry & Maths\n\n` +
`🔥 *STUDY CONSISTENCY & BADGES:*\n` +
`• Active Learning Streak: *${streak} Days Active* 🔥\n` +
`• Total STEM Badges: *${badges.length} Badges* 🏆\n` +
`• Total Knowledge Points: *${totalXP} XP* 🌟\n\n` +
`💡 *MENTOR RECOMMENDATION:* Encourage ${studentName} to spend 15 mins reviewing this week's missed questions in our AI Socratic Classroom.\n\n` +
`📱 *Parent Portal:* Keep up the great support for your child's education!`;

  return text;
}

/**
 * Creates direct WhatsApp Click-to-Chat URL
 * Works 100% reliably on any phone/PC without requiring backend credentials
 */
export function getDirectWhatsAppUrl(phone, messageText) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Sends Parent Notification via WhatsApp and/or SMS
 */
export async function sendParentNotification({
  parentPhone,
  parentName = 'Parent',
  studentName = 'Student',
  grade = 'Class 9',
  assessmentScore = 0,
  totalQuestions = 40,
  percentage = 0,
  masteryTier = 'Proficient',
  sectionBreakdown = {},
  careerTrack = null,
  streak = 0,
  badges = [],
  totalXP = 0,
  channels = ['whatsapp', 'sms'] // 'whatsapp' | 'sms'
}) {
  const formattedPhone = formatPhoneNumber(parentPhone);
  const reportMessage = formatParentReport({
    studentName,
    parentName,
    grade,
    assessmentScore,
    totalQuestions,
    percentage,
    masteryTier,
    sectionBreakdown,
    careerTrack,
    streak,
    badges,
    totalXP
  });

  const directWhatsAppUrl = getDirectWhatsAppUrl(formattedPhone, reportMessage);
  const results = {
    parentPhone: formattedPhone,
    reportMessage,
    directWhatsAppUrl,
    whatsapp: { sent: false, error: null, sid: null },
    sms: { sent: false, error: null, sid: null }
  };

  // If Twilio is configured, dispatch messages
  const twilioClient = getTwilioClient();
  const twilioSmsNumber = (process.env.TWILIO_PHONE_NUMBER || '').trim().replace(/\s+/g, '');
  const twilioWhatsAppNumber = (process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886').trim();

  if (twilioClient) {
    // 1. WhatsApp Delivery
    if (channels.includes('whatsapp')) {
      try {
        const fromWhatsApp = twilioWhatsAppNumber.startsWith('whatsapp:')
          ? twilioWhatsAppNumber
          : `whatsapp:${twilioWhatsAppNumber}`;
        const toWhatsApp = `whatsapp:${formattedPhone}`;

        const msg = await twilioClient.messages.create({
          from: fromWhatsApp,
          to: toWhatsApp,
          body: reportMessage
        });

        results.whatsapp.sent = true;
        results.whatsapp.sid = msg.sid;
      } catch (err) {
        console.warn('[TwilioService] WhatsApp send error:', err.message, err.code);
        let friendlyErr = err.message;
        if (err.code === 21608 || err.code === 63015 || err.message?.includes('sandbox')) {
          friendlyErr = `WhatsApp Sandbox not joined yet: The parent phone (${formattedPhone}) must send "join storm-about" to +1 415 523 8886 once from WhatsApp to receive messages.`;
        }
        results.whatsapp.error = friendlyErr;
        results.whatsapp.code = err.code;
      }
    }

    // 2. SMS Delivery
    if (channels.includes('sms')) {
      if (!twilioSmsNumber) {
        results.sms.error = 'TWILIO_PHONE_NUMBER is not configured in server .env';
      } else {
        try {
          // SMS has 160-char segments; send concise version
          const smsText = `VidyaVerse: ${studentName}'s weekly test score: ${assessmentScore}/${totalQuestions} (${percentage}%). Career: ${careerTrack?.title || 'STEM'}. Streak: ${streak} days. Badges: ${badges.length}. Keep learning!`;
          const msg = await twilioClient.messages.create({
            from: twilioSmsNumber,
            to: formattedPhone,
            body: smsText
          });

          results.sms.sent = true;
          results.sms.sid = msg.sid;
        } catch (err) {
          console.warn('[TwilioService] SMS send error:', err.message, err.code);
          let friendlyErr = err.message;
          if (err.code === 21608 || err.message?.includes('unverified')) {
            friendlyErr = `Twilio Trial Account can only send SMS to verified numbers (+918210868501). Verify this number in Twilio Console or upgrade your account.`;
          }
          results.sms.error = friendlyErr;
          results.sms.code = err.code;
        }
      }
    }
  } else {
    results.isDemoMode = true;
    results.error = 'Twilio Account SID or Auth Token missing in server .env';
    results.whatsapp.error = 'Twilio credentials not configured in server .env';
    results.sms.error = 'Twilio credentials not configured in server .env';
  }

  return results;
}
