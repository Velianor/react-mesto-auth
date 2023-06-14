import { useEffect } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { useForm } from "../hooks/useForm";

function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit, onLoading }) {
  const { values, handleChange, setValues } = useForm({});

  useEffect(() => {
    setValues({});
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlaceSubmit({ name: values.name, link: values.link });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="card"
      title="Новое место"
      buttonText={onLoading ? `Создание...` : `Создать`}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="name-input"
        type="text"
        name="name"
        className="popup__input popup__input_type_title"
        placeholder="Название"
        minLength={2}
        maxLength={30}
        required={true}
        value={values.name || ""}
        onChange={handleChange}
      />
      <span id="name-input-error" className="popup__error" />
      <input
        id="input-link"
        required={true}
        type="url"
        name="link"
        className="popup__input popup__input_card_link"
        placeholder="Ссылка на картинку"
        value={values.link || ''}
        onChange={handleChange}
      />
      <span id="url-input-error" className="popup__error" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
