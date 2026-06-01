'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import css from './NotesPage.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';

interface NotesClientProps {
  category?: NoteTag;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [category]);

  const [debouncedSearch] = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearch, page, category],
    queryFn: () => fetchNotes(debouncedSearch, page, category),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />

      <section className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </section>

      {isLoading && <p className={css.loading}>Loading notes...</p>}
      {isError && <p className={css.error}>Something went wrong...</p>}

      {!isError && !isLoading && notes.length > 0 && <NoteList notes={notes} />}
      {!isError && !isLoading && notes.length === 0 && (
        <p className={css.empty}>No notes found...</p>
      )}
    </section>
  );
}
