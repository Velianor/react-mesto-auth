import PopupWithForm from "./PopupWithForm.js";

function DelCardPopup({ card, isOpen, onClose, onDelCard }) {
  function handleSubmit(evt) {
    evt.preventDefault();
    onDelCard(card);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="delete"
      title="Вы уверены?"
      buttonText="Да"
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}

export default DelCardPopup;
