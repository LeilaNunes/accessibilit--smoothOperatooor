import { useEffect, useRef, useState } from "react";
import { readRequest, requestOptions, type RequestDialogProps, type RequestErrors } from "../requests";

export default function QuestionDialog({ workshop, onClose, onSubmit }: RequestDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<RequestErrors>({});
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    dialogRef.current?.showModal();
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    if (hasErrors) {
      errorSummaryRef.current?.focus();
    }
  }, [errors, hasErrors]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { values, errors: nextErrors } = readRequest(form, "question", workshop.id);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit(values);
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      tabIndex={-1}
      onClose={onClose}
    >
      <div className="dialog-heading">
        <h2 id="dialog-title">Poser une question</h2>
        <button
          type="button"
          className="close-button"
          aria-label="Fermer la fenêtre"
          onClick={handleClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <p className="dialog-context">Atelier concerné : <strong>{workshop.title}</strong></p>

      {hasErrors && (
        <div
          ref={errorSummaryRef}
          className="error-summary"
          role="alert"
          tabIndex={-1}
        >
          <h3>Veuillez corriger les erreurs suivantes :</h3>
          <ul>
            {errors.choice && (
              <li><a href="#field-choice">{errors.choice}</a></li>
            )}
            {errors.contact && (
              <li><a href="#field-contact">{errors.contact}</a></li>
            )}
            {errors.message && (
              <li><a href="#field-message">{errors.message}</a></li>
            )}
          </ul>
        </div>
      )}

      <form method="dialog" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="field-choice">Sujet de la question</label>
          <select
            id="field-choice"
            name="choice"
            className={errors.choice ? "invalid" : ""}
            aria-describedby={errors.choice ? "error-choice" : undefined}
            aria-required="true"
            defaultValue=""
          >
            <option value="" disabled>Choisissez un sujet…</option>
            {requestOptions.question.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.choice && (
            <p id="error-choice" className="field-error">{errors.choice}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="field-contact">Adresse électronique</label>
          <input
            type="email"
            id="field-contact"
            name="contact"
            autoComplete="email"
            className={errors.contact ? "invalid" : ""}
            aria-describedby={`contact-help${errors.contact ? " error-contact" : ""}`}
            aria-required="true"
          />
          <p id="contact-help" className="field-help">Format attendu : nom@exemple.fr</p>
          {errors.contact && (
            <p id="error-contact" className="field-error">{errors.contact}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="field-message">Votre question</label>
          <textarea
            id="field-message"
            name="message"
            className={errors.message ? "invalid" : ""}
            aria-describedby={errors.message ? "error-message" : undefined}
            aria-required="true"
          />
          {errors.message && (
            <p id="error-message" className="field-error">{errors.message}</p>
          )}
        </div>

        <div className="dialog-actions">
          <button type="submit" className="primary-button">Envoyer la question</button>
          <button type="button" className="secondary-button" onClick={handleClose}>Annuler</button>
        </div>
      </form>
    </dialog>
  );
}
