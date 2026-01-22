# Edit UI Implementation Plan

## Overview
Add inline edit functionality to the Inbox page. The update API already exists in the backend, so this is purely a frontend UI enhancement.

## Files to Modify

### Frontend
- [frontend/src/app/inbox/page.tsx](../frontend/src/app/inbox/page.tsx)

## Implementation Approach

### 1. Add Edit State Management
- Add `editingId` state to track which memo is being edited
- Add `editContent` state for the edited content
- Add `updatingId` state for loading state during save

### 2. Add Edit Mode Toggle
- Add an "Edit" button next to the "Delete" button
- When clicked, switch the memo content to a textarea
- Show "Save" (Cmd+Enter) and "Cancel" buttons

### 3. Handle Edit Operations
- `handleEditStart(id, content)` - Enter edit mode
- `handleEditCancel()` - Exit edit mode without saving
- `handleEditSave(id)` - Save changes via API
- Keyboard shortcut: Cmd+Enter to save, Escape to cancel

### 4. Visual Changes
- Edit button: pencil icon
- In edit mode: textarea with character counter (max 1000)
- Save/Cancel buttons in edit mode
- Edit mode styling: visible edit state with focus

## User Flow
1. User clicks Edit button on a memo
2. Textarea appears with current content
3. User edits content (Cmd+Enter or click Save)
4. Memo updates optimistically, API call completes
5. Edit mode closes, updated content shows

## Verification
1. Start the dev server: `cd frontend && pnpm dev`
2. Go to http://localhost:3000/inbox
3. Create a test memo via quick-input
4. Click Edit button on the memo
5. Edit the content and press Cmd+Enter
6. Verify the memo updates
7. Test Cancel (Escape button)
8. Test error handling (simulate API failure)
