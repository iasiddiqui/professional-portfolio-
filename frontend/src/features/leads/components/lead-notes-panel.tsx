'use client';

import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAddLeadNote, useDeleteLeadNote } from '@/features/leads/hooks/use-lead-mutations';
import type { Lead, LeadNote } from '@/features/leads/types/lead.types';
import { formatDateTime } from '@/utils/date';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { MODULE_PERMISSIONS } from '@/constants/permissions';

interface LeadNotesPanelProps {
  lead: Lead;
}

export function LeadNotesPanel({ lead }: LeadNotesPanelProps) {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.leads.write);

  const [content, setContent] = useState('');
  const addNoteMutation = useAddLeadNote(lead.id);
  const deleteNoteMutation = useDeleteLeadNote(lead.id);

  const handleAddNote = async () => {
    if (!content.trim()) return;
    await addNoteMutation.mutateAsync({ content: content.trim() });
    setContent('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Internal CRM notes — not visible to the lead.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {canWrite ? (
          <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Add a note about this lead..."
              rows={3}
            />
            <Button
              variant="accent"
              size="sm"
              onClick={() => void handleAddNote()}
              disabled={!content.trim() || addNoteMutation.isPending}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Add note
            </Button>
          </div>
        ) : null}

        {lead.notes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {lead.notes.map((note) => (
              <LeadNoteItem
                key={note.id}
                note={note}
                canDelete={canWrite}
                onDelete={() => void deleteNoteMutation.mutateAsync(note.id)}
                isDeleting={deleteNoteMutation.isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LeadNoteItem({
  note,
  canDelete,
  onDelete,
  isDeleting,
}: {
  note: LeadNote;
  canDelete: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{note.author?.name ?? 'Team member'}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
        </div>
        {canDelete ? (
          <Button variant="ghost" size="icon" onClick={onDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{note.content}</p>
    </div>
  );
}
