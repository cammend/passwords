import React, {useEffect, useState} from 'react';
import Session from '../../services/session';
import {ItemListState} from '../../state/item-list/item-list.state';
import Login from '../login';
import Register from '../register';
import TabNavigator from '../../navigation/tab';
import {Theme} from '@react-navigation/native';

interface iProps {
  theme?: Theme;
}

interface iShowOne {
  login?: boolean;
  register?: boolean;
  tabStack?: boolean;
}

export default function MainView(props: iProps) {
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showTabStack, setShowTabStack] = useState(false);

  const checkPreviousRegistered = async () => {
    if (!(await Session.previousRegistered())) {
      showOne({register: true});
    } else {
      showOne({login: true});
    }

    setLoading(false);
  };

  const showOne = (params: iShowOne) => {
    setShowRegister(!!params.register);
    setShowLogin(!!params.login);
    setShowTabStack(!!params.tabStack);
  };

  const handleLoginOrRegister = async (password: string) => {
    await ItemListState.load(password);
    ItemListState.updateEvent.emit();
    showOne({tabStack: true});
  };

  useEffect(() => {
    checkPreviousRegistered();
    const evt = Session.expiredEvent.on(() => {
      checkPreviousRegistered();
    });

    return () => {
      evt.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!loading && (
        <>
          {showLogin && <Login onSuccessLogin={handleLoginOrRegister} />}
          {showRegister && (
            <Register onSuccessRegister={handleLoginOrRegister} />
          )}
          {showTabStack && <TabNavigator theme={props.theme} />}
        </>
      )}
    </>
  );
}
