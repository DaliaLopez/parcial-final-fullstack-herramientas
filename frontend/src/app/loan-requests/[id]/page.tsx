import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { LoanRequest } from '../../../lib/loan-types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LoanRequestReceiptPage({ params }: PageProps) {
  const { id } = await params;
  const response = await apiFetch(`/loan-requests/${id}`);

  if (!response.ok) {
    notFound();
  }

  const loanRequest: LoanRequest = await response.json();

  return (
    <main>
      <h1>Loan Request Receipt</h1>
      <p>ID: {loanRequest.id}</p>
      <p>Purpose: {loanRequest.purpose}</p>
      <p>Days: {loanRequest.days}</p>
      <p>Tool: {loanRequest.tool.name}</p>
      <p>
        <Link href="/loan-requests">Back to list</Link>
      </p>
    </main>
  );
}
