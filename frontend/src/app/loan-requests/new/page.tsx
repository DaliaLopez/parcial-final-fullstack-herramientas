import { redirect } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { Tool } from '../../../lib/loan-types';

async function createLoanRequest(formData: FormData) {
  'use server';

  const purpose = String(formData.get('purpose') ?? '');
  const days = Number(formData.get('days'));
  const toolId = Number(formData.get('toolId'));

  const response = await apiFetch('/loan-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purpose, days, toolId }),
  });

  if (!response.ok) {
    return;
  }

  const created = await response.json();
  redirect(`/loan-requests/${created.id}`);
}

export default async function NewLoanRequestPage() {
  const toolsResponse = await apiFetch('/tools');
  const tools: Tool[] = toolsResponse.ok ? await toolsResponse.json() : [];

  return (
    <main>
      <h1>New Loan Request</h1>
      <form action={createLoanRequest}>
        <div>
          <label htmlFor="purpose">Purpose</label>
          <input id="purpose" name="purpose" type="text" maxLength={120} required />
        </div>
        <div>
          <label htmlFor="days">Days</label>
          <input id="days" name="days" type="number" min={1} required />
        </div>
        <div>
          <label htmlFor="toolId">Tool</label>
          <select id="toolId" name="toolId" required>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name} (max {tool.maxLoanDays} days)
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create request</button>
      </form>
    </main>
  );
}
