'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';

import styles from '@/components/NotePreview/NotePreview.module.css';

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();

  const id = typeof params?.id === 'string' ? params.id : '';

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: id !== '',
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (!id || isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={handleClose}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={handleClose}>
          Close
        </button>

        <div className={styles.item}>
          <div className={styles.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={styles.tag}>{note.tag}</p>
          <p className={styles.content}>{note.content}</p>
          <p className={styles.date}>{formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
}
