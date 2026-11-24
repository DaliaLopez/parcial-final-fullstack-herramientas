import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { LoanRequest, Tool } from '../../lib/loan-types';

type PageProps = {
  searchParams: Promise<{ toolId?: string }>;
};

export default async function LoanRequestsPage({ searchParams }: PageProps) {
  const { toolId } = await searchParams;
  const cleanToolId = toolId && toolId.trim() !== '' ? toolId.trim() : undefined;

  const toolsResponse = await apiFetch('/tools');
  const tools: Tool[] = toolsResponse.ok ? await toolsResponse.json() : [];

  const endpoint = cleanToolId
    ? `/loan-requests?toolId=${encodeURIComponent(cleanToolId)}`
    : '/loan-requests';

  const requestsResponse = await apiFetch(endpoint);
  const loanRequests: LoanRequest[] = requestsResponse.ok ? await requestsResponse.json() : [];

  return (
    <main>
      <h1>Loan Requests</h1>

      <p>
        <Link href="/loan-requests/new">New loan request</Link>
      </p>

      <form method="GET" action="/loan-requests">
        <label htmlFor="toolId">Filter by tool: </label>
        <select id="toolId" name="toolId" defaultValue={cleanToolId ?? ''}>
          <option value="">All tools</option>
          {tools.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
        <button type="submit">Filter</button>
      </form>

      <ul>
        {loanRequests.map((req) => (
          <li key={req.id}>
            <strong>#{req.id}</strong> - {req.purpose} ({req.days} days) - Tool: {req.tool.name}{' '}
            <Link href={`/loan-requests/${req.id}`}>View receipt</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
