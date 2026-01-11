import transporter from '../config/email.js';

export const sendOverdueEmail = async (email, data) => {
  const { username, bookTitle, dueDate } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '⚠️ Overdue Book Notice - Book Management System',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #d32f2f;">📚 Overdue Book Notice</h2>
          <p>Dear ${username},</p>
          <p>This is a reminder that the following book is overdue:</p>
          <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
            <h3 style="margin: 0; color: #d32f2f;">${bookTitle}</h3>
            <p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please return the book as soon as possible to avoid additional fines.</p>
          <p><strong>Fine Rate:</strong> $5 per day</p>
          <p>Thank you for your cooperation!</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #888; font-size: 12px;">
            This is an automated message from the Book Management System. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Overdue email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};