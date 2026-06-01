'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import fullPageStyles from './NoteDetails.module.css';
import modalDeteilsStyles from '@/components/NotePreview/NotePreview.module.css';

export default function NoteDetailsClient({ isModal = false }) {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === 'string' ? params.id : '';
  const styles = isModal ? modalDeteilsStyles : fullPageStyles;

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

  if (!id || isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  const handleClose = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      {isModal && (
        <button className={styles.backBtn} onClick={handleClose}>
          Close
        </button>
      )}

      <div className={styles.item}>
        <div className={styles.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={styles.tag}>{note.tag}</p>
        <p className={styles.content}>{note.content}</p>
        <p className={styles.date}>{formattedDate}</p>
      </div>
    </div>
  );
}
