import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const LAST_UPDATED = '2 de marzo de 2026';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-orange-400" />
              <h1 className="text-2xl font-bold text-white">Politica de Privacidad</h1>
            </div>
            <p className="text-gray-400 text-sm">
              Ultima actualizacion: {LAST_UPDATED}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-8 space-y-8 text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">
            <Section title="1. Responsable del tratamiento">
              <p>
                Matripuntos es una aplicacion diseñada para ayudar a parejas y familias a
                reconocer y equilibrar las tareas del hogar. El responsable del tratamiento de
                los datos es el titular de la cuenta que administra la aplicacion.
              </p>
            </Section>

            <Section title="2. Datos que recopilamos">
              <p className="mb-3">Recopilamos unicamente los datos necesarios para el funcionamiento de la aplicacion:</p>
              <DataList
                items={[
                  { label: 'Datos de cuenta', detail: 'nombre, direccion de email y contrasena (cifrada).' },
                  { label: 'Foto de perfil', detail: 'opcional, almacenada de forma segura.' },
                  { label: 'Informacion del hogar', detail: 'si la pareja tiene hijos y tamaño del hogar (para personalizar la experiencia).' },
                  { label: 'Actividad en la app', detail: 'tareas completadas, puntos ganados/canjeados, logros y mensajes entre la pareja.' },
                  { label: 'Datos del calendario', detail: 'asignaciones de tareas y horarios.' },
                  { label: 'Notificaciones push', detail: 'datos tecnicos del dispositivo para enviar notificaciones (solo si se activan).' },
                ]}
              />
            </Section>

            <Section title="3. Finalidad del tratamiento">
              <p>Usamos tus datos exclusivamente para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gestionar tu cuenta y vincularla con tu pareja.</li>
                <li>Registrar y mostrar las tareas del hogar completadas.</li>
                <li>Calcular puntos, recompensas y estadisticas de reparto.</li>
                <li>Facilitar la comunicacion entre los miembros de la pareja.</li>
                <li>Enviar notificaciones relevantes (si las activas).</li>
              </ul>
            </Section>

            <Section title="4. Comparticion de datos">
              <p>
                Tus datos <strong>no se comparten con terceros</strong>. La informacion de actividad
                solo es visible para ti y tu pareja vinculada. No vendemos, alquilamos ni
                cedemos datos personales a ninguna empresa externa.
              </p>
              <p className="mt-2">
                No utilizamos herramientas de analitica de terceros ni servicios de seguimiento
                publicitario.
              </p>
            </Section>

            <Section title="5. Almacenamiento y seguridad">
              <p>
                Los datos se almacenan en servidores de Supabase con cifrado en transito y en
                reposo. Todas las tablas estan protegidas mediante politicas de seguridad a nivel
                de fila (RLS), lo que garantiza que solo los miembros autorizados de cada pareja
                puedan acceder a sus propios datos.
              </p>
              <p className="mt-2">
                Las contrasenas se almacenan con hash seguro y nunca son accesibles en texto plano.
              </p>
            </Section>

            <Section title="6. Conservacion de datos">
              <p>
                Tus datos se conservan mientras tu cuenta este activa. Si decides eliminar tu cuenta,
                todos tus datos personales seran eliminados de forma permanente de nuestros servidores.
              </p>
            </Section>

            <Section title="7. Tus derechos">
              <p>Como usuario, tienes derecho a:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Acceder</strong> a todos tus datos personales desde tu perfil.</li>
                <li><strong>Rectificar</strong> tu nombre y foto de perfil en cualquier momento.</li>
                <li><strong>Eliminar</strong> tu foto de perfil o solicitar la eliminacion de tu cuenta.</li>
                <li><strong>Revocar</strong> el consentimiento para notificaciones push.</li>
              </ul>
            </Section>

            <Section title="8. Datos almacenados en tu dispositivo">
              <p>
                La aplicacion almacena localmente en tu navegador tu preferencia de tema
                (claro/oscuro) y la sesion de autenticacion. Estos datos se eliminan al cerrar
                sesion. No utilizamos cookies de seguimiento.
              </p>
            </Section>

            <Section title="9. Menores de edad">
              <p>
                Matripuntos esta destinada a usuarios mayores de 16 años. No recopilamos
                intencionadamente datos de menores de esta edad.
              </p>
            </Section>

            <Section title="10. Cambios en esta politica">
              <p>
                Nos reservamos el derecho de actualizar esta politica de privacidad. Cualquier
                cambio significativo sera notificado dentro de la aplicacion. Te recomendamos
                revisar esta pagina periodicamente.
              </p>
            </Section>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Si tienes alguna pregunta sobre esta politica de privacidad, puedes contactarnos
                a traves de la seccion de mensajes de la aplicacion o enviando un correo al
                administrador de tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
      {children}
    </section>
  );
}

function DataList({ items }: { items: { label: string; detail: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
          <span>
            <strong>{item.label}:</strong> {item.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}
