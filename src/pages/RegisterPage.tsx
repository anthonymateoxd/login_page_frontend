import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import '../theme/RegisterPage.css';
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthProvider';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { postRegister, errors: registerErrors, isAuthenticated } = useAuth();

  const history = useHistory();

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

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    if (!confirmPassword) {
      return 'Confirmar contraseña es requerido';
    }
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      confirmPassword,
      password
    );

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);

    if (!emailValidation && !passwordValidation && !confirmPasswordValidation) {
      const body = { email, password };
      console.log('Registro exitoso:', body);
      await postRegister(body);
      history.push('/');
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
    // Also validate confirm password when password changes
    if (confirmPassword && confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(value, password));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/home');
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {registerErrors.map((error, i) => (
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
          <h2>Create Account</h2>
          <p>Please sign up to create your account</p>

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

          <div className='input-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={e => handleConfirmPasswordChange(e.target.value)}
              className={confirmPasswordError ? 'input-error' : ''}
            />
            {confirmPasswordError && (
              <span className='error-message'>{confirmPasswordError}</span>
            )}
          </div>

          <button
            type='submit'
            className='login-button'
          >
            Sign Up
          </button>
        </form>
        <h6 className='centered-text'>
          Already have an account?{' '}
          <a
            href='/login'
            className='custom-link'
          >
            Sign In
          </a>
        </h6>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
