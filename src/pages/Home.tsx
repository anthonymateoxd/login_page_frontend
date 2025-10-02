import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonButton,
} from '@ionic/react';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';
import '../theme/Home.css';

const Home: React.FC = () => {
  const { getUsers, users, loading, logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuarios</IonTitle>
          {/* Botón de Logout */}
          <IonButton
            fill='outline'
            color='danger'
            size='small'
            className='logout-button'
            onClick={handleLogout} // 👉 aquí llamas a tu función logout
          >
            Cerrar Sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='container'>
          <IonCard className='users-card'>
            <IonCardHeader className='users-header'>
              <IonCardTitle className='card-title'>
                Lista de Usuarios
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              {loading ? (
                <div className='loading-container'>
                  <IonSpinner name='crescent' />
                  <p>Cargando usuarios...</p>
                </div>
              ) : (
                <IonGrid className='users-table'>
                  {/* Encabezados de la tabla */}
                  <IonRow className='table-header'>
                    <IonCol
                      size='6'
                      className='header-cell'
                    >
                      Email
                    </IonCol>
                    <IonCol
                      size='6'
                      className='header-cell'
                    >
                      Contraseña
                    </IonCol>
                  </IonRow>

                  {/* Filas de datos */}
                  {users.map((userItem: any, index: number) => (
                    <IonRow
                      key={index}
                      className='table-row'
                    >
                      <IonCol
                        size='6'
                        className='data-cell email-cell'
                      >
                        {userItem.email}
                      </IonCol>
                      <IonCol
                        size='6'
                        className='data-cell password-cell'
                      >
                        {userItem.password}
                      </IonCol>
                    </IonRow>
                  ))}
                </IonGrid>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
