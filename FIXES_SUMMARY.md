# Query Management System - Fixes Summary

## Issues Fixed

### 1. ✅ AddQuery User ID Field
**Issue**: Frontend was using wrong user ID field
**Fix**: Updated `AddQuery.jsx` to use `userData._id` instead of `userData.id`
- Location: [frontend/src/components/AddQuery.jsx](frontend/src/components/AddQuery.jsx#L19)
- Now correctly sends `askedBy: userId` to backend

### 2. ✅ Backend Query Filtering by Role
**Issue**: `getQueries` endpoint returned ALL queries to everyone (no role-based filtering)
**Fix**: Updated `GetQueriesController.js` to filter queries based on user role:
- **Users**: See only their own queries (filter: `{ askedBy: userId }`)
- **Heads**: See only queries assigned to them (filter: `{ assignedTo: userId }`)
- **Admins**: See all queries (no filter)
- Location: [backend/controllers/GetQueriesController.js](backend/controllers/GetQueriesController.js#L7-L14)

### 3. ✅ Stats Update with Role Filtering
**Issue**: Stats were counting all queries globally regardless of user role
**Fix**: Updated `getQueryStats` to respect role-based filtering
- Users only see stats for their own queries
- Heads only see stats for their assigned queries
- Admins see stats for all queries
- Location: [backend/controllers/GetQueriesController.js](backend/controllers/GetQueriesController.js#L49-L62)

### 4. ✅ Query Status Changes to "Assigned"
**Issue**: When admin assigns a query, status didn't change from "Unassigned" to "Assigned"
**Fix**: Updated `assignQuery` in `QueryActionsController.js` to set `query.status = 'Assigned'`
- Also properly handles reassignment (decrements previous assignee's stats)
- Location: [backend/controllers/QueryActionsController.js](backend/controllers/QueryActionsController.js#L175-L178)

### 5. ✅ Display "Reassign" Button for Already-Assigned Queries
**Issue**: Admin always saw "Assign" button even if query was already assigned
**Fix**: Updated `QueryTable.jsx` to show "Reassign" when `query.assignedTo` exists
- Changes button label and title dynamically based on assignment status
- Location: [frontend/src/components/dashboard/QueryTable.jsx](frontend/src/components/dashboard/QueryTable.jsx#L196-L200)

### 6. ✅ Display Resolution/Reason in Table and Modal
**Issue**: Users couldn't see what resolution was given or why query was dismantled
**Fix**: 
- **In QueryTable**: Now displays resolved replies (with ✓) and dismantle reasons
  - Location: [frontend/src/components/dashboard/QueryTable.jsx](frontend/src/components/dashboard/QueryTable.jsx#L170-L178)
- **In ActionModal**: Shows existing resolution/reason before allowing new input
  - Location: [frontend/src/components/dashboard/ActionModal.jsx](frontend/src/components/dashboard/ActionModal.jsx#L121-L126)

### 7. ✅ Modal Title Shows "Reassign" When Appropriate
**Issue**: Modal always showed "Assign Query" even for reassignments
**Fix**: Updated `ActionModal.jsx` to dynamically set title and button text
- Location: [frontend/src/components/dashboard/ActionModal.jsx](frontend/src/components/dashboard/ActionModal.jsx#L30-L36)

### 8. ✅ Display Current Assignment in Modal
**Issue**: When reassigning, users couldn't see who currently has the query
**Fix**: Added display of currently assigned head in the ActionModal
- Location: [frontend/src/components/dashboard/ActionModal.jsx](frontend/src/components/dashboard/ActionModal.jsx#L108-L115)

### 9. ✅ Proper Stats Updates on Actions
**Issue**: Stats didn't update when queries were resolved/dismantled
**Fix**: Updated `resolveQuery` and `dismantleQuery` to properly update Member stats
- `resolveQuery`: Increments `queriesResolved`, decrements `queriesTaken`
- `dismantleQuery`: Decrements `queriesTaken`
- Location: [backend/controllers/QueryActionsController.js](backend/controllers/QueryActionsController.js#L40-L46, #L103-L108)

## API Endpoint Behavior After Fixes

### GET /api/queries
- **User**: Returns only queries submitted by that user
- **Head**: Returns only queries assigned to that head
- **Admin**: Returns all queries

### GET /api/query-stats
- **User**: Shows stats for their own queries only
- **Head**: Shows stats for their assigned queries only
- **Admin**: Shows stats for all queries

### PUT /api/queries/:queryId/assign
- Sets query status to "Assigned"
- Handles reassignment (updates both old and new assignee stats)
- Only accessible to Admins

### PUT /api/queries/:queryId/resolve
- Sets query status to "Resolved"
- Stores resolution reply
- Updates stats: queriesResolved +1, queriesTaken -1

### PUT /api/queries/:queryId/dismantle
- Sets query status to "Dismantled"
- Stores dismantle reason
- Updates stats: queriesTaken -1

## Frontend Component Updates

### DashboardPage
- Fetches role-appropriate queries based on user's role
- Stats automatically reflect filtered queries

### QueryTable
- Shows "Reassign" button for already-assigned queries
- Displays resolution replies and dismantle reasons inline
- Role-based action buttons (User: View Only, Head: Resolve/Dismantle, Admin: All Actions)

### ActionModal
- Dynamic title showing "Reassign" vs "Assign"
- Shows current assignment information
- Displays existing resolution/reason before user input
- Properly handles all three action types

### AddQuery
- Uses correct `_id` field from localStorage

## Testing the Fixes

1. **Submit a Query**: User logs in, submits query → appears in their "My Queries" section
2. **Assign Query**: Admin assigns to Head → status changes to "Assigned" → unassigned count decreases
3. **Resolve Query**: Head marks as resolved with reason → shows in table with checkmark and reason
4. **Dismantle Query**: Head dismantles with reason → shows in table with reason
5. **Reassign**: Admin clicks "Reassign" on assigned query → shows current assignee in modal
6. **Stats**: All stats update correctly based on role and query status

