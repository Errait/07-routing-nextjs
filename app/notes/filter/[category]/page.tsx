import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from '../../Notes.client';
import { NoteTag } from '@/types/note';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const NotesByCategory = async ({ params, searchParams }: PageProps) => {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const searchWord = resolvedSearch.search ?? '';
  const currentPage = Number(resolvedSearch.page) || 1;

  const categoryParam = resolvedParams.category;
  const category: NoteTag | undefined =
    categoryParam === 'all' ? undefined : (categoryParam as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchWord, currentPage, category],
    queryFn: () => fetchNotes(searchWord, currentPage, category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        searchWord={searchWord}
        currentPage={currentPage}
        category={category}
      />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
