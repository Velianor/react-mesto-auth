import { useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";
import { useForm } from '../hooks/useForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, onLoading }) {
  const { values, handleChange, setValues } = useForm({});

  const currentUser = useContext(CurrentUserContext);
  
  useEffect(() => {
    setValues({ username: currentUser.name, info: currentUser.about });
}, [currentUser, isOpen]);


  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateUser({ name: values.username, about: values.info })
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="profile"
      title="Редактировать профиль"
      buttonText={onLoading ? `Сохранение...` : `Сохранить`}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="username-input"
        required=""
        type="text"
        name="username"
        className="popup__input popup__input_type_name"
        placeholder="Имя"
        minLength={2}
        maxLength={40}
        onChange={handleChange}
        value={values.username ?? ''}
      />
      <span id="username-input-error" className="popup__error" />
      <input
        id="description-input"
        required=""
        type="text"
        name="info"
        className="popup__input popup__input_type_description"
        placeholder="О себе"
        minLength={2}
        maxLength={200}
        onChange={handleChange}
        value={values.info ?? ''}
      />
     <span id="description-input-error" className="popup__error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
