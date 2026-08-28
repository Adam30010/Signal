'use client';

import { useUI } from '@/components/ui/UIProvider';

// Confirmation modal — replace window.confirm everywhere.
export default function ConfirmModal() {
  const { modal, closeModal } = useUI();
  if (!modal) return null;

  const { title, body, confirmLabel = 'CONFIRM', cancelLabel = 'CANCEL', onConfirm, danger } = modal;

  const confirm = () => {
    closeModal();
    onConfirm?.();
  };

  return (
    <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="modal-x" onClick={closeModal} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{body}</div>
        <div className="modal-foot">
          <button type="button" className="btn btn-sm btn-ghost" onClick={closeModal}>{cancelLabel}</button>
          <button type="button" className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-accent'}`} onClick={confirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
