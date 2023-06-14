import { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, onLoading }) {
  const avatarRef = useRef();

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="avatar"
      title="Обновить аватар"
      buttonText={onLoading ? `Сохранение...` : `Сохранить`}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="input-avatar"
        required={true}
        type="url"
        name="avatar"
        className="popup__input popup__input_avatar_link"
        placeholder="Ссылка на картинку"
        ref={avatarRef}
      />
     <span className="popup__error" id="input-avatar-error" />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
