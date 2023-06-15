import React from "react";

function PopupWithForm({ isOpen, onClose,  title, children, buttonText, onSubmit, name }) {

  function handleClickClose(evt) {
    if (evt.target.classList.contains('popup_opened')) {
        onClose();
    }
};

  return (

      <div
        className={`popup  ${isOpen ? `popup_opened` : ""}`} onClick={handleClickClose}
      >
        <div className="popup__container">
          <button
            type="button"
            className="popup__button-close"
            onClick={onClose}
            aria-label="Зыкрыть форму"
          />
          <h2 className="popup__title">{title}</h2>
          <form className="popup__form" name={`form_${name}`} onSubmit={onSubmit}>
            {children}
            <button
              type="submit"
              className="popup__button-save"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
  );
}

export default PopupWithForm;
