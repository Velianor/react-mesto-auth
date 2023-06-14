import { useEffect, useState, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import ProtectedRoute from "./ProtectedRoute";
import "../index.css";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import DelCardPopup from "./DelCardPopup.js";
import InfoTooltip from "./InfoTooltip";
import Login from "./Login";
import Register from "./Register";
import api from "../utils/Api.js";
import auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedCard, deletePopup] = useState(null);
  const [isDelCardPopupOpen, setIsDelCardPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cards]) => {
          setCurrentUser(userInfo);
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);
  const handleDelCardClick = (card) => {
    setIsDelCardPopupOpen(true);
    deletePopup(card);
  };

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsDelCardPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleUpdateUser(userData) {
    setIsLoading(true);
    api
      .changeUserInfo(userData.name, userData.about)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(userData) {
    api
      .changeAvatar(userData.avatar)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(`Ошибка лайка: ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка при удалении: ${err}`));
  }

  function onRegister(email, password) {
    setIsLoading(true);
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setIsInfoTooltipPopupOpen(true);
          setEmail(email);
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function onLogin(email, password) {
    setIsLoading(true);
    auth
      .login(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setLoggedIn(true);
          setEmail(email);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  const tokenCheck = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setLoggedIn(true);
            navigate("/", { replace: true });
          }
        })
        .catch((err) => console.log(err));
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  const onSignOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/sign-in");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div>
        <Header email={email} onSignOut={onSignOut} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute path="/" loggedIn={loggedIn}>
                <Main
                  element={Main}
                  loggedIn={loggedIn}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDelCardClick}
                  cards={cards}
                />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sign-in"
            element={
              <Login
                loggedIn={loggedIn}
                onLogin={onLogin}
                tokenCheck={tokenCheck}
                isLoading={isLoading}
              />
            }
          />

          <Route
            path="/sign-up"
            element={
              <Register
                loggedIn={loggedIn}
                onRegister={onRegister}
                isLoading={isLoading}
              />
            }
          />

          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="./sign-up" />
            }
          />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          onLoading={isLoading}
        />

        <ImagePopup
          isOpen={selectedCard}
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <DelCardPopup
          isOpen={isDelCardPopupOpen}
          onClose={closeAllPopups}
          card={deletedCard}
          onDelCard={handleCardDelete}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onLoading={isLoading}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
