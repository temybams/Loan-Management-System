export const calculateLoanDetails = (loan: any) => {
  const interest = (loan.amount * loan.interestRate) / 100;
  const totalLoanAmount = loan.amount + interest;

  const totalPaid =
    loan.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

  const remainingBalance = totalLoanAmount - totalPaid;

  return {
    totalLoanAmount,
    totalPaid,
    remainingBalance,
  };
};

export const calculateOutstanding = (loans: any[]) => {
  return loans.reduce((sum, loan) => {
    const { remainingBalance } = calculateLoanDetails(loan);
    return loan.status !== "PAID" ? sum + remainingBalance : sum;
  }, 0);
};