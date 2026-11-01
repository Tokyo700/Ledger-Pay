# Dashboard

One static file, `index.html`. No install, no build.

## Run it

Double-click `index.html`. It starts on built-in mock data, and the Approve and Reject buttons work against the mock.

To connect it to the real agent, open it with the API address:

```
index.html?api=http://localhost:4100
```

The page polls `/api/state` every 2 seconds and falls back to mock data if the server is unreachable.

## API the dashboard expects (owner: Aditya Pratap Singh)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/state` | none | `DashboardState` from `packages/shared/types.ts` |
| POST | `/api/approvals/:approvalId` | `{ "decision": "approved" \| "rejected" }` | any 2xx |

The server must send CORS headers (`Access-Control-Allow-Origin: *`, and allow `Content-Type`),
because the page is opened from a file or another port.
Test with `curl http://localhost:4100/api/state`.
