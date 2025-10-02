import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import '../theme/LoginPage.css';
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthProvider';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const history = useHistory();

  const { postLogin, errors: loginErrors, isAuthenticated } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El correo es requerido';
    }
    if (!emailRegex.test(email)) {
      return 'El formato del correo no es válido';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (!emailValidation && !passwordValidation) {
      const body = { email, password };
      console.log('Login exitoso:', body);
      // await postUsers(body);
      await postLogin(body);
      // history.push('/home');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  useEffect(() => {
    // console.log('Auth changed:', isAuthenticated);
    if (isAuthenticated) {
      history.push('/home');
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <></>
        {loginErrors.map((error, i) => (
          <div
            className='custom-error-alert'
            key={i}
          >
            {error}
          </div>
        ))}
        <form
          onSubmit={handleSubmit}
          className='login-container'
        >
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>

          <div className='input-group'>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <span className='error-message'>{emailError}</span>}
          </div>

          <div className='input-group'>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && (
              <span className='error-message'>{passwordError}</span>
            )}
          </div>

          <button
            type='submit'
            className='login-button'
          >
            Sign In
          </button>
        </form>
        <h6 className='centered-text'>
          Don’t have an account?{' '}
          <a
            href='/register'
            className='custom-link'
          >
            Register
          </a>
        </h6>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
