import NoteDetails from '../../../notes/[id]/page';
import Modal from '../../../../components/Modal/Modal';

export default async function NotePreview(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Modal>
      <div className="container">
        <NoteDetails params={props.params} isModal={true} />
      </div>
    </Modal>
  );
}
