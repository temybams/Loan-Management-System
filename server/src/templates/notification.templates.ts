const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);

export const NotificationTemplates = {
  LOAN_CREATED: (name: string, amount: number) => ({


    subject: "Loan Created 🎉",
    email: `<p>Hello ${name},</p>
            <p>Your loan of ${formatCurrency(amount)} has been created.</p>`,
    sms: `Hi ${name}, your loan of ${formatCurrency(amount)} has been created.`,
  }),

  PAYMENT_RECEIVED: (name: string, amount: number, balance: number) => {
    const formatCurrency = (amt: number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amt);

    return {
      subject: "Repayment Successful ✅",
      email: `
        <p>Hello ${name},</p>
        <p>We received your repayment of <strong>${formatCurrency(amount)}</strong>.</p>
        <p>Your remaining balance is <strong>${formatCurrency(balance)}</strong>.</p>
      `,
      sms: `Hi ${name}, we received your repayment of ${formatCurrency(amount)}. Balance: ${formatCurrency(balance)}.`,
    };
  },

  LOAN_APPROVED: (name: string, status: string) => ({
    subject: "Loan Status Update 🔔",
    email: `<p>Hello ${name},</p>
            <p>Your loan status has been updated to: <strong>${status}</strong>.</p>`,
    sms: `Hi ${name}, your loan status is now: ${status}.`,
  }),


  OVERDUE_ALERT: (name: string, formattedAmount: number) => ({
    subject: "Loan Overdue ⚠️",
    email: `<p>${name}, your loan of ${formattedAmount} is overdue.</p>`,
    sms: `Overdue: ${formattedAmount} loan. Pay immediately.`,
  }),
};