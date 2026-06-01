import Link from 'next/link';
import { VALID_TAGS } from '@/types/note';
import css from './SidebarNotes.module.css';

const SidebarNotes = async () => {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {VALID_TAGS.map(category => (
        <li key={category} className={css.menuItem}>
          <Link href={`/notes/filter/${category}`} className={css.menuLink}>
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
