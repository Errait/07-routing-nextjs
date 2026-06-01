'use client';

import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import Modal from '@/components/Modal/Modal';

export default function NotePreviewClient() {
  return (
    <Modal>
      <div className="container">
        <NoteDetailsClient isModal={true} />
      </div>
    </Modal>
  );
}
