import express from 'express';
import { sendParentNotification, formatParentReport, getDirectWhatsAppUrl, formatPhoneNumber } from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /api/notifications/parent-report
 * Triggered automatically or manually when a student completes their skill assessment
 */
router.post('/parent-report', async (req, res) => {
  try {
    const {
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
      channels = ['whatsapp', 'sms']
    } = req.body;

    if (!parentPhone) {
      return res.status(400).json({
        status: 'error',
        message: 'parentPhone is required to dispatch parent report'
      });
    }

    const deliveryResult = await sendParentNotification({
      parentPhone,
      parentName,
      studentName,
      grade,
      assessmentScore,
      totalQuestions,
      percentage,
      masteryTier,
      sectionBreakdown,
      careerTrack,
      streak,
      badges,
      totalXP,
      channels
    });

    res.json({
      status: 'success',
      message: 'Parent performance notification processed',
      data: deliveryResult
    });
  } catch (error) {
    console.error('[NotificationRoute] Error sending parent report:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal error dispatching parent report'
    });
  }
});

/**
 * POST /api/notifications/preview-report
 * Returns the exact report text and WhatsApp link without sending
 */
router.post('/preview-report', (req, res) => {
  const {
    studentName = 'Student',
    parentName = 'Parent',
    parentPhone = '+919876543210',
    grade = 'Class 9',
    assessmentScore = 0,
    totalQuestions = 40,
    percentage = 0,
    masteryTier = 'Proficient',
    sectionBreakdown = {},
    careerTrack = null,
    streak = 0,
    badges = [],
    totalXP = 0
  } = req.body;

  const reportText = formatParentReport({
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

  const formattedPhone = formatPhoneNumber(parentPhone);
  const directWhatsAppUrl = getDirectWhatsAppUrl(formattedPhone, reportText);

  res.json({
    status: 'success',
    reportText,
    directWhatsAppUrl,
    parentPhone: formattedPhone
  });
});

export default router;
