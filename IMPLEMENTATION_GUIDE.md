# Query Management System - Implementation Guide

## Quick Start Testing

### For Users (Regular Members)
1. Login as a user
2. Go to Dashboard → You only see queries **you submitted**
3. Go to Add Query → Submit a new query
4. The query appears with "Unassigned" status
5. Stats show only your queries

### For Heads
1. Login as head
2. Go to Dashboard → You only see queries **assigned to you**
3. When you have assigned queries:
   - Click "Resolve" → Add resolution details
   - Click "Dismantle" → Add dismantle reason
4. After resolving, the query shows the resolution with a checkmark
5. Stats show only your assigned queries

### For Admins
1. Login as admin
2. Go to Dashboard → You see **all queries** regardless of status or assignment
3. You can:
   - Click "Assign" on unassigned queries → Select a head
   - Click "Reassign" on already-assigned queries → Change the assignment
   - Click "Resolve"/"Dismantle" on any query
4. When you assign a query:
   - Status changes from "Unassigned" to "Assigned"
   - The "Unassigned" count in stats decreases
   - The "Assigned" count increases
5. Stats show all queries

## Database/Schema Notes

### Query Schema Fields
```javascript
{
  issue: String,           // The query/issue description
  askedBy: ObjectId,      // Reference to User who submitted
  status: String,         // 'Unassigned' | 'Assigned' | 'Resolved' | 'Dismantled'
  reply: String,          // Stores resolution or dismantle reason
  assignedTo: ObjectId,   // Reference to Head who is assigned
  createdAt: Date,
  updatedAt: Date
}
```

### Member/User Schema Tracking
```javascript
{
  queriesTaken: Number,   // Current assigned queries
  queriesResolved: Number // Total queries resolved
}
```

## Flow Diagrams

### Query Lifecycle
```
User submits Query
    ↓
status: 'Unassigned'
    ↓
Admin assigns to Head
    ↓
status: 'Assigned', assignedTo: HeadId
    ↓
    ├─→ Head resolves
    │      ↓
    │   status: 'Resolved', reply: resolution text
    │
    └─→ Head dismantles
           ↓
        status: 'Dismantled', reply: reason text
```

### Role-Based Query Visibility

**User Dashboard:**
```
Only sees: Queries where askedBy = current user
Example: 5 total queries submitted, only those 5 shown
```

**Head Dashboard:**
```
Only sees: Queries where assignedTo = current head
Example: 3 queries assigned to this head, only those 3 shown
```

**Admin Dashboard:**
```
Sees: All queries regardless of assignment
Example: 50 total queries in system, all shown
```

## Stats Calculation Examples

### User's Stats
```
Total Queries: 5 (submitted by this user)
Unassigned: 2 (status='Unassigned')
Assigned: 2 (status='Assigned')
Resolved: 1 (status='Resolved')
Dismantled: 0 (status='Dismantled')
Pending: 4 (Unassigned + Assigned)
```

### Head's Stats
```
Total Queries: 10 (assigned to this head)
Unassigned: 0 (N/A - heads don't see unassigned queries)
Assigned: 5 (status='Assigned')
Resolved: 4 (status='Resolved', resolved by this head)
Dismantled: 1 (status='Dismantled', dismantled by this head)
Pending: 5 (Assigned + Unassigned)
```

### Admin's Stats
```
Total Queries: 50 (all in system)
Unassigned: 10 (status='Unassigned')
Assigned: 20 (status='Assigned')
Resolved: 15 (status='Resolved')
Dismantled: 5 (status='Dismantled')
Pending: 30 (Unassigned + Assigned)
```

## Button State Logic

### Resolve Button
- Shows: Only for Head (if assigned to them) or Admin
- Only if status ≠ 'Resolved' AND status ≠ 'Dismantled'

### Dismantle Button
- Shows: Only for Head (if assigned to them) or Admin
- Only if status ≠ 'Resolved' AND status ≠ 'Dismantled'

### Assign Button
- Shows: Only for Admin
- Label: "Assign" if `assignedTo` is null
- Label: "Reassign" if `assignedTo` has a value
- Only if status ≠ 'Resolved' AND status ≠ 'Dismantled'

## API Responses

### GET /api/queries (User)
```json
{
  "success": true,
  "count": 5,
  "queries": [
    {
      "_id": "...",
      "issue": "Login not working",
      "status": "Assigned",
      "askedBy": {"_id": "...", "name": "John"},
      "assignedTo": {"_id": "...", "name": "Sarah"},
      "reply": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/query-stats (User)
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "resolved": 1,
    "assigned": 2,
    "unassigned": 2,
    "dismantled": 0,
    "pending": 4
  }
}
```

### PUT /api/queries/:id/resolve
```json
{
  "success": true,
  "message": "Query resolved successfully",
  "query": {
    "_id": "...",
    "status": "Resolved",
    "reply": "Issue has been fixed in latest version",
    "assignedTo": {"_id": "...", "name": "Sarah"}
  }
}
```

### PUT /api/queries/:id/assign
```json
{
  "success": true,
  "message": "Query assigned successfully",
  "query": {
    "_id": "...",
    "status": "Assigned",
    "assignedTo": {"_id": "...", "name": "New Head Name"}
  }
}
```

## Troubleshooting

### "Query not found" Error
- Verify the query ID exists
- Check that user has permission to view it (see role-based visibility above)

### Stats Don't Update
- Hard refresh the dashboard (Ctrl+Shift+R or Cmd+Shift+R)
- The stats are fetched fresh each time

### Can't See Queries
- Check your role (User/Head/Admin)
- Verify you're looking for the right queries:
  - Users: Your submitted queries
  - Heads: Queries assigned to you
  - Admins: All queries

### "Assign" vs "Reassign" Button
- No "assignedTo" → "Assign" button
- Has "assignedTo" → "Reassign" button
- Both call the same endpoint, backend handles both cases

