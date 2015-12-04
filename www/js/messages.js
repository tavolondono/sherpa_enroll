var Messages = {
    /*
    * Add here your messages for the default language.
    * Generate a similar file with a language suffix containing the translated messages
    * key1 : message1,
    * key2 : message2
    * Uncomment if you use the Authenticator example.
    * usernameLabel : 'Username:',
    * passwordLabel : 'Password:',
    * invalidUsernamePassword : 'Invalid username or password.'
    **/

        /*
         * General actions messaes
         **/
        'generalActions': {
            'accept': 'Acepta',
            'available': 'Disponible',
            'cancel': 'Cancela',
            'enter': 'Entra',
            'errorTimeOut': 'Lo sentimos, intentalo de nuevo',
            'errorOnFailure': 'Lo sentimos, intentalo de nuevo, error interno',
            'documentTypes': 'Tipo de documento',
            'female': 'Femenino',
            'male': 'Masculino', /*Formularios*/
            'nickName': 'Nickname',
            'idNumber': 'Número de documento',
            'expeditionDate': 'Fecha expedición',
            'birthDate': 'Fecha nacimiento',
            'email': 'E-mail',
            'password': 'Contraseña',
            'phone': 'Teléfono',
            'ready': 'Listo',
            'registry': 'Registrarme',
            'save': 'Guardar',
            'send': 'Envía',
            'total': 'Total',
            'edit': 'Edita',
            'help': 'Ayuda',
            'yes': 'Si',
            'nowNot': 'Ahora no',
            'loading': 'Cargando',
            'search': 'Busca',
            'sendMoney': 'Envía plata',
            'requestMoney': 'Pide plata',
            'spendingLimit' : 'Límite de gasto',
            'createPassword': 'Crea tu clave:',
            'validatePassword': 'Repite la nueva clave:',
            'tempExplanetionText':'',
            'pay': 'Paga',
            'close': 'Cierra',
            'openAccount': 'Abre una cuenta',
            'keepTrying': 'Sigue probando',
            'claimMoney': 'Reclama esta plata',
            'update': 'Actualiza',
            'cashout' : 'Retira',
            'cashin': 'Recargar',
            'verify' : 'Verificar',
            'back' : 'Atrás'
        },

        /*
         * Navigation messages
         * */
        'navigation': {
            'backLabel':'Vuelve',
            'goIn': 'Entra',
            'next' : 'Siguiente',
            'cancel' : 'Cancelar',
            'close': 'Cierra',
            'exit': 'Salir',
            'jump': 'Salta'
        },

        /*
         * Peso clave
         * */
        'passwordMeter': {
            'veryWeak': 'Muy débil',
            'weak': 'Débil',
            'fair': 'Media',
            'good': 'Buena',
            'strong': 'Fuerte'
        },

        /*
         * Enrollment messages
         * */
        'enrollment': {
            'requestPhoneTitle': 'BIENVENIDO',
            'requestPhoneSubTitle': '¿Cuál es tu número de celular?',
            'requestPhoneContext': 'Antes de acceder a Nequi nos gustaría saberlo.',
            'requestPhoneContextualHelp': '¿Para qué tu número?',
            'requestPhonelabelInputPhone': 'Celular',
            'requestTokenTitle': 'INTRODUCE EL CÓDIGO',
            'requestTokenContext': 'Te acabamos de enviar un con un código para completar tu registro.',
            'requestTokenInputCodePlaceHolder': 'Código de verificación',
            'requestTokenContextualHelp': 'Pide otro',
            'requestTokenTitleErrorModal': '¡Ouch!',
            'requestTokenContextErrorModal': 'El código que has introducido es erróneo',
            'requestTokenButtonErrorModal': 'Pedie otro código',
            'requestTokenLinkErrorModal': 'Reintenta',
            'successEnrollment': 'El código es correcto, ya puedes empezar a disfrutar de Nequi,¡Bienvenido!',
            'requestPhoneNote': '<span>"Al darnos tu número de celular nos estás dando permiso para enviarte mensajes de texto, chatear por whatsapp y a veces llamarte. Tranqui, no somos intensos."</span>',
            'requestPhoneTermCondition': 'Acepto los términos y condiciones de la sucursal virtual',
            'requestPhoneReadTerm': 'Leer más sobre esto',
            'requestPhoneError': 'Necesitamos que aceptes los términos y condiciones',
            'requestTokenNote': '<span>"Al darnos tu número de celular nos estás dando permiso para enviarte mensajes de texto, chatear por whatsapp y a veces llamarte. Tranqui, no somos intensos."</span>',

            'whyEnroll': {
                'title': '¿Para qué tu número?',
                'description': 'Necesitamos saber tu número porque tu teléfono es el lugar al cuál enviaremos códigos para completar tu registro.',
                'titleStep1': '1. Tu número de teléfono será tu número de cuenta.',
                'titleStep2': '2. Además tu teléfono será el lugar donde te enviemos los códigos de seguridad para poder registrarte.',
                'textWarning': 'Prometemos no decirle tus datos a desconocidos.'
            }
        },

        /**
        *
        * close App
        *
        **/
        'closeApp': {
            'title': '¿Quieres salir de la App?',
            'message': ''
        },

        /*
         * Home messages
         * */
        'home': {
            'homeWellcome':'NEQUI',
            'testSherpa': 'Prueba Nequi',
            'tour': 'tour',
            'registry': 'Registro'
        },

        /*
         * Dashboard Messages
         * */
        'dashboard':{
            'availableFreeTitle': 'Disponible',
            'keepStashTitle': 'GUARDADITO',
            'keepGoalTitle': 'METAS AHORRO',
            'goalSTitle': 'METAS',
            'pocketsTitle': 'BOLSILLOS',
            'messageProfileEnroll': 'Lo sentimos tienes que registrarte',
            'pockets': 'bolsillos',
            'tools': {
                'keepStash': {
                    'title': 'GUARDADITO',
                    'context':'Esa platica que guardas porque no te la quieres gastar.'
                },
                'safeGoals': {
                    'title': 'METAS DE AHORRO',
                    'context': 'Fija una fecha, mira cuánto puedes guardar al día y ahorra para lograr tus metas.'
                },
                'pockets': {
                    'title': 'BOLSILLOS',
                    'context': 'Crea bolsillos para organizar la plata que gastas y manejarla mejor.'
                },
                'recharge': {
                    'title': 'RECARGA',
                    'context': 'Así como suena. Mete plata en tu cuenta Nequi y olvídate de los compliques.'
                },
                'welcomeSherpa': {
                    'title': '¡Prueba Nequi!',
                    'contextOne': 'Para que puedas empezar a disfrutar de Nequi, te obsequiamos:',
                    'contextTwo': '$ 10,000',
                    'contextThree': 'para que hagas tu primer pago.'
                },
                'subTitle': 'Función para usuarios registrados.',
                'moneyPartition':{
                    'title': 'Mi plata',
                    'total' : 'TODA TU PLATA SUMA:',
                    'uncreatedText' : 'Sin crear'
                }
            }
        },


        /*
         * Tour messages
         * */
        'tour': {
            'descriptionStep1':'Nequi es una cuenta en la<br> nube que <strong>no tiene costos<br> ni comisiones ocultas.</strong>',
            'descriptionStep2':'Paga tus compras habituales <br><strong>con el celular</strong> y pasa dinero <br>a tus contactos.',
            'descriptionStep3':'<strong>Puedes irte de Nequi cuando<br> quieras,</strong> sin compromisos, <br>ni letra pequeña.',
            'descriptionStep4':'<strong>¿Todavía tienes dudas?</strong><br> Te damos $10.000 para que <br>puedas probarlo ahora.',
            'test': 'Probar'
        },
        /*
         * liteRegistry messages
         * */
        'liteRegistry': {
            'title': 'Registro',
             'nickname': {
                'title': 'Información',
                'placeholder': 'Nombre',
                'explanetionText': '¡Hola! Ya que nos estamos conociendo',
                'contextualInfo': '¿Cómo te dicen tus amigos?'
            },
            'id' : {
                'title': 'Información',
                'hi': '¡Hola! ¿Qué más?',
                'documentTypesPlaceHolder': 'Documento',
                'explanetionText': 'Ahora, necesitaremos tu documento de identificación.',
                'formatDateValidation' : 'yyyy-MM-dd'
            },
            'email' : {
                'title': 'Comunicación',
                'description': 'Datos de acceso',
                'explanetionText': 'Por último, pensando en tu seguridad y para podernos comunicar necesitamos tu email y contraseña.',
                'showPassword': 'Mostrar contraseña'
            },
            'password' : {
                'title': 'SEGURIDAD',
                'description': 'Datos de acceso',
                'explanetionText': 'No se la digas ni al espejo. Te la pediremos para que uses y realices cambios en tu cuenta Nequi.',
                'defaultPassword':'Crea tu clave:',
                'errorPIN':'Las claves no coinciden'
            },
            'contract' : {
                'title': 'Contrato',
                'description': 'Resumen del contrato legal de Nequi',
                'explanetionText': 'Cuenta de ahorro de trámite simplificado',
                'downloadText': 'Descarga el contrato completo',
                'textAcceptContract': 'He leído el contrato completo',
                'labelcontractVersion': 'Versión del contrato',
                'textCancelContract': 'No lo acepto',
                'textBottonAcceptContract': 'Acepto el contrato',
                'content': '<h2>Principales características de Nequi</h2><h3>Cuenta de ahorro de trámite simplificado</h3><p>Estás muy cerca de empezar a disfrutar de Nequi. Este será nuestro acuerdo. Sólo tienes que leer con atención el contrato que está al final y aceptar sus términos y condiciones.</p><p>No te llevará más de un minuto.</p><p><strong>Lo que debes saber</strong></p><p>Para abrir una cuenta Nequi basta con que seas una persona natural, residente en Colombia y con capacidad legal para celebrar contratos válidos.</p><p>Al principio esta será una cuenta sencilla, que podrá cambiar a Cuenta de Ahorro cuando cumplas con los requisitos adicionales que puedes conocer en la App.</p><p>Sólo puedes tener una Cuenta Nequi,tú serás el único titular y esta se identificará con un número que te daremos cuando abras la cuenta. Sólo tú la podrás manejar y administrar desde el celular que usaste para crearla.</p><p>Tu Cuenta no necesita saldo mínimo o inicial para mantenerse activa. </p><p>En la App podrás consultar siempre todos los movimientos y cada una de las operaciones que hayas realizado.</p><p>Ten presente informarnos cuando hagas un cambio de número de celular para que puedas seguir usando Nequi.</p><p>Para hacer un retiro de la Cuenta Nequi recibirás un código en el celular que usarás al momento de realizar el retiro.</p><p><strong>¿Qué más deberías saber?</strong></p><p>Si decides cancelar tu Cuenta Nequi, debes hacerlo desde la App. </p><p>Todos tenemos dudas, ¡pregúntanos lo que sea!, puedes comunicarte con nosotros a través de nuestra página web en: www.nequi.co</p><p>Con la apertura y uso de tu Cuenta Nequi, nos autorizas para: </p><p>Enviarte mensajes SMS al celular asociado a tu Cuenta Nequi, así como mensajes dentro de la App para contactarte o para entregarte información de tipo comercial, legal, de productos o servicios, de seguridad o de aspectos relacionados con las operaciones o transacciones realizadas con Nequi. </p><p>Compartir tu información con quienes, como proveedores o Aliados de Nequi requieran conocerla para el mantenimiento y operación de tu Cuenta.</p>',
                'version' : '10.0.005',
                'urlContract' : 'http://172.31.12.234:9080/bdigital/public/contrato-usuario-bancadigital.pdf'   
            },
            'advantage':{
                'title': 'Ventajas de ser Nequi'
            },
            'configureAccount' : {
                'title': 'Configura tu cuenta',
                'secureDevice': {
                    'title' : 'Asegura tu dispositivo',
                    'description' : 'Vamos a enviar un código para asegurar tu celular'                    
                },
                'biometryAccess': {
                    'title' : 'Biometría',
                    'description' : 'Seguridad biométrica'                                    
                },
                'pinAccess': {
                    'title' : 'Registra tu clave',
                    'description' : 'Ingresa tu clave'                    
                }
                
            },
            'cancelDialogTitle': 'Registro',
            'cancelDialogText': '¿Estás seguro que quieres cancelar?',
            'successDialogTitle': 'Fin',
            'successDialogText': 'El proceso de vinculación ha terminado.'
        },
        /**
        *
        * Login
        *
        **/
        'login': {
            'enrollDialogTitle': 'Alerta no existe',
            'enrollDialogAcept': 'Ingresar',
            'user': {
                'title': 'Hola, bienvenido',
                'placeholder': 'Teléfono',
                'errorLogin': 'Valida tu Usuario, la sintaxis esta errada'
            },
            'password':{
                'title' : 'Solo un dato más',
                'explanetionText': 'One morning, when Gregor Samsa woke from troubled dreams',
                'showPassword': 'Mostrar contraseña',
                'placeHolder': 'Contraseña',
                'contextualInfo': 'he found himself transformed in his bed into a horrible vermin',
                'fortgotPassword': 'Olvidé mi contraseña'

            }
        },

        /**
         *
         * Profile
         *
        **/
        'profile':{
            'title': 'Tu cuenta y tú',
            'buttonRetire': 'Retira',
            'buttonRecharge': 'Recarga',
            'labelButtonCloseSession' : 'Cerrar sesión',
            'account': {
                'title': 'Tu cuenta Nequi',
                'labelPhone': 'Tu cuenta es tu celular',
                'contextPhone': 'Otro usuario Nequi puede enviarte plata usando tu número de celular.',
                'labelEmail': 'Tu cuenta también es tu correo',
                'contextEmail': 'Otro usuario Nequi puede enviarte plata usando también este email.',
                'labelAccountNumber': 'Tu cuenta es también este número',
                'contextAccountNumber': 'Puedes recibir plata, tu sueldo o recargar esta cuenta ',
                'linkAccountNumber': 'desde cualquier otro banco.'
            },
            'closeAccount' : {
                'title' : 'Cerrar cuenta',
                'context' : 'Para poder cerrar esta cuenta debes vaciarla y dejar el total en cero.',
                'labelTotal' : 'TOTAL ACTUAL',
                'labelButton' : 'Cerrar cuenta'
            },
            'data': {
                'title': 'Tus datos',
                'labelName': 'Nombre',
                'labelIssued': 'Expedida el',
                'labelBirthDate': 'Nacimiento',
                'typeId': {
                    'identityCard': 'TI',
                    'documentIdentity': 'CC'
                },
                'labelEmail': 'Correo electrónico',
                'contextEmail': 'Este es tu correo, lo usaremos para comunicarnos contigo.',
                'labelPhone': 'Tu celular',
                'labelEditData': 'Modifica tus datos'
            },
            'security': {
                'title': 'Seguridad',
                'contextFirst': 'Aquí podrás cambiar tus',
                'contextMiddle': 'Opciones de Biometría',
                'contextLast': '',
                'buttonConfiguration': 'Modifica tus configuraciones de seguridad',
                'item' :{
                    'title': 'Clave Nequi',
                    'contextA' : 'Esta es tu única clave, no se la digas ni al espejo.',
                    'actionText' : 'Cambiar clave de seguridad',
                    'optionAlwaysText' : 'Pedir siempre',
                    'text' : 'Por seguridad, seguiremos pidiéndote esta clave para montos mayores a $25.000.',
                    'optionOpen' : 'Pedir esta clave al abrir la app',
                    'newPassword' : 'Introduce la nueva clave:',
                    'repeatPassword' : 'Repite la nueva clave:'
                },
                'biometry' : {
                    'title' :  'Biometría',
                    'faceRecognition' : 'Reconocimiento facial',
                    'voiceRecognition' : 'Reconocimiento vocal',
                },
                'save': 'Guarda tus cambios'
            },
            'notifications': {
                'title': 'Notificaciones',
                'contextFirst': 'Aquí puedes cambiar la configuración de las',
                'contextLast': 'notificaciones.',
                'buttonConfiguration': 'Configurar notificaciones'
            },
            'inApp': {
                'title': 'En la app',
                'context': 'Consulta la información que necesites como:',
                'legalAgreements': 'Acuerdos legales',
                'termsOfService': 'Términos del servicio'
            },
            'legalAgreements': {
                'title': 'Acuerdos legales',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.',
                'textSendEmail': 'Enviar contrato completo a mi correo',
                'textAccept': 'Acepto los acuerdos legales'
            },
            'enroll' : {
                'title' : 'Aún no tienes una cuenta',
                'contextA' : 'Cuando la crees asociaremos tu número de celular a tu cuenta para que puedas enviar y pedir plata a tus contactos sin que tengas que enviarles un número largo.',
                'contextB' : 'También podrías enviar o recibir con sólo tu correo electrónico.',
                'contextC' : 'Y por si fuera poco, te daremos también un número de cuenta convencional, para que puedas usar tu cuenta en cualquier situación que necesites.',
                'labelPhoneNumber' : 'Este es el celular que nos diste:',
                'labelButton' : 'Abrirme una cuenta'
            },
            'keySecurity': {
            'titlePage': 'Seguridad',
            'title': 'Pon tu clave',
            'description': 'No dudamos que seas tú, pero igual ingresa tu clave.'
        }
        },

        /*
         * 
         *  messages
         */
        'faqs': {
            'registry.nickname' : {
                'title' : '¿Cómo quieres que te llamemos?',
                'context' : ['Aquí debes introducir tu nombre o apodo o como sea que quieras que te llamemos, eres libre de elegirlo.', 'De esta manera podremos brindarte un servicio más personalizado.'],
                'titleB' : '',
                'alert' : 'Prometemos no darle tus datos personales a nadie.',
                'list' : ''
            },
            'registry.id' : {
                'title' : '¿Para qué pedimos tus datos personales?',
                'context' : ['Tus datos personales son necesarios para validar tu cuenta y brindarte un servicio más seguro.', 'Debes introducir tu número de cédula o tarjeta de identidad, así podremos tener información veraz sobre ti y tu podrás sentirte seguro de que esta cuenta será siempre tuya y de nadie más.'],
                'titleB' : '',
                'alert' : 'Prometemos no darle tus datos personales a nadie.',
                'list' : ''
            },
            'registry.contract' : {
                'title' : '¿Por qué debes aceptar este contrato?',
                'context' : ['Para poder abrir una cuenta es necesario que estés informado de lo que esto implica, cuáles son tus derechos y deberes y que debes tener en cuenta para operar la tu cuenta Sherpa.'],
                'titleB' : '',
                'alert' : 'Prometemos no darle tus datos personales a nadie.',
                'list' : ''
            },
            'registry.email' : {
                'title' : '¿Para qué pedimos tu correo personal?',
                'context' : ['Tu correo personal es necesario para comunicarnos contigo en caso de una contingencia o inconveniente.'],
                'titleB' : '',
                'alert' : 'Prometemos no darle tus datos personales a nadie y no enviarte spam ni comunicaciones comerciales.',
                'list' : ''
            },
            'registry.password' : {
                'title' : 'Te ayudamos a cuidar tu seguridad',
                'context' : ['Tu clave de seguridad es tu única clave en sherpa, con ella puedes hacer uso de tu dinero y acceder a la app sin problemas.'],
                'titleB' : 'Te recomendamos:',
                'alert' : '',
                'list' : ['No compartas tus claves con nadie.', 'Trata de memorizar tu clave.', 'No reutilíces claves. Cuando sea necesario crea una nuevas. no seas flojo.', 'Usa tu clave sólo en aplicaciones confiables.']
            },
            'registry.facial' : {
                'title' : 'Te ayudamos a cuidar tu seguridad',
                'context' : ['Tu rostro servirá como único método de ingreso.'],
                'titleB' : 'Te recomendamos:',
                'alert' : 'Sólo tú podrás continuar',
                'list' : ['Estar en un lugar iluminado.', 'Estar solo en la toma de las imágenes.', 
                    'Sostener el celular a la altura de tu rostro', 'Tener una expresión del rostro natural.',
                    'No moverte durante la toma de las fotografías'
                    ]
            },
            'verifyEmail' : {
                'title' : '¡Verifica tu correo!',
                'context' : [''],
                'titleB' : '',
                'alert' : '',
                'list' : ['Te hemos enviado un mail con un', 'link, para poder activar tu cuenta.']
            },
            'registry.chooseBiometry' : {
                'title' : '¿Por qué es importante utilizar la biometría en tu cuenta?',
                'context' : ['La información de biometría nos permitirá aumentar la seguridad de tu cuenta, ya que te identificaremos por tus características físicas, las cuales son únicas.',
                                'Solo necesitarás tu vos o rostro para acceder al APP y ya no tendrás que preocuparte más por recordar el PIN'
                            ],
                'titleB' : '',
                'alert' : 'Sólo tú podrás continuar',
                'list' : []
            }
        },
        /*
         * Welcome Messages
         * */
         'welcome': {
            'title': 'Tu cuenta Nequi',
            'contextProfile': '<p><strong>¡Gracias, hemos validado tu correo!</strong></p><p>Ahora lee con atención lo que viene, es importante.</p>',
            'titleContext': 'BIENVENIDO A NEQUI',
            'remember': 'A partir de este momento recuerda que:',
            'labelPhoneNumber': 'Tu cuenta es tu celular',
            'contextPhoneNumber': 'Otro nequi puede enviarte plata usando tu número de celular.',
            'labelAccountNumber': 'Tu cuenta es también este número',
            'contextAccountNumber': 'Para recibir plata desde otro banco o que te depositen tu sueldo usa este número, por ejemplo para',
            'rechargeOtherBank': 'recargar nequi desde otro banco',
            'labelEmail': 'Tu cuenta es tu email',
            'contextEmail': 'Otro nequi puede enviarte plata usando también este email.',

            'validateEmail': {
                'title': '¡Correo enviado!',
                'reviewEmail': 'Revisa tu correo.',
                'description': 'Te hemos enviado un mail con un <br> link para asegurarnos del cambio.',
                'resendEmail': 'No he recibido el correo',
                'resendEmailSuccess': 'El correo fue enviado con exito.'
            }
         },
         /*
         * Coachmarks Messages
         * */
        'coachmark': {
          'general': {
            'disponible': 'DISPONIBLE',
            'monto': '$0',
            'total': 'TOTAL',
            'saldo': '$0',
            'metas': 'METAS AHORRO',
            'guardadito': 'GUARDADITO',
            'bolsillos': 'BOLSILLOS'
          },
          'welcome': {
            'title': 'Hola :) Llegaste a Nequi',
            'text': 'Desliza y te mostraremos todo lo que puedes hacer aquí.'
          },
          'profile': {
              'title': 'Aquí tienes tu perfil',
              'text': 'Desde esta pestaña podrás gestionar tus datos personales y editar tus preferencias.'
          },
          'dashboard': {
            'title': 'Aquí tienes tu plata',
            'text': 'Siempre podrás ver cuanta plata tienes.'
          },
          'tools': {
            'title': 'Es tu plata, manéjala bien.',
            'text': 'Estas herramientas te ayudarán a administrar tu plata y a usarla de la mejor forma.'
          },
          'reload': {
              'title': 'Recarga tu cuenta',
              'text': 'Con Nequi olvídate de los billetes grandes, y de cargar moneditas.'
          },
          'use': {
              'title': 'Usa tu plata',
              'text': 'Podrás hacer lo que quieras, donde quieras y cuando lo necesites.',
              'close': '¡Listo!'
          }
        },
        /**
         * operationResult
         * SuccessView
         *
        **/
        'success': {
            'cashInPSE': {
                'title': '¡Recarga PSE <br>realizada!',
                'msg': 'Acabas de hacer una recarga exitosa,<br><span>¿Que más deseas hacer?</span>',
                'btnAccept': 'Vuelve a Nequi',
                'btnCancel': 'Haz otra recarga',
                'urlClose': '#/dashboard',
                'urlAccept': '#/dashboard',
                'urlCancel': '#/dashboard'
            }
        },
        /*
         * Pay & Transfers
         **/
        'payTransfers': {
            'title': 'Usa tu plata',
            'payWithCelTitle': 'Pagos con el celular',
            'transfersBetweenSherpasTitle': 'Movimientos entre usuarios Nequi',
            'titleMoneyUse': '¡Cuatro formas de usar tu plata!',
            'descriptionMoneyUse': 'Por ahora sólo tienes activo el pago, para activar las demás debes primero abrir una cuenta y recargar plata.',
            'requestContactPermission': {
                'title': 'Nos gustaría hacer tus movimientos más fácil y rápido',
                'context': 'Para poder hacerlo necesitamos acceder a tus contactos. Prometemos no compartir con desconocidos.'
            }
        },
        /**
         * operationResult
         * errorView
         *
        **/
        'error': {
            'general': {
                'title': '¡Ouch! <br>tenemos un problema',
                'msg': 'Mensaje de error general',
                'btnAccept': 'Vuelve a Nequi',
                'btnCancel': 'cancela',
                'urlClose': '',
                'urlAccept': '#/home',
                'urlCancel': ''
            },
            'cashInPSE': {
                'title': '¡Ouch! <br>tenemos un problema',
                'msg': 'No hemos podido procesar tu transferencia,<br><span>¿Que más quieres hacer?</span>',
                'btnAccept': 'Vuele a Nequi',
                'btnCancel': 'Haz otra recarga',
                'urlClose': '#/cashin',
                'urlAccept': '#/home',
                'urlCancel': '#/cashin'
            },
            'pay': {
                'title': '¡Oops! <br>tenemos un problema',
                'msg': 'No hemos podido procesar tu pago.',
                'btnAccept': 'Vuelve a Nequi',
                'btnCancel': 'Haz otro pago',
                'urlClose': '#/payTransfer',
                'urlAccept': '#/dashboard',
                'urlCancel': '#/payTransfer'
            }
        },
        /*
         * Json Storage
         * */
        'jsonStore': {
            'collection': 'App',
            'key': 'sherpa'
        },
        /**
         *
         * transfer
         *
        **/
        'transfer': {
            'home': {
                'title': 'Transferencias',
                'description': 'Mover plata entre usuarios Nequi es muy sencillo. Dale a “Envía plata” y selecciona el contacto al que deseas enviarle o pedirle plata, pon una cantidad y la plata llegará a su destino. Solo necesitas el número de celular de tu contacto.',
                'sendMoney': 'Envía plata',
                'requestMoney': 'Pide plata'
            },
            'recurrent': {
                'title': 'Últimos movimientos',
                'errorLoadMovements': 'No existen movimientos'
            },
            'newContact':{
                'title' : 'Nuevo contacto',
                'description': 'Vas a hacer una transferencia a una persona que no está en tus contactos. Si aun no es usuario Nequi, le enviaremos un mensaje para que se pueda registrar y recibir su plata.',
                'fieldNamePlaceHolder': 'Nombre',
                'errorUpdateStateContact': 'Ha ocurrido un error al momento de actualizar el contacto Nequi en tu móvil. Intentalo más tarde.'
            },
            'contacts': {
                'title': 'Contactos',
                'groupSherpa': 'Nequi',
                'groupNoSherpa': 'Sin Nequi',
                'recurrentTransfer': 'Transferencias recurrentes',
                'sendToNewContact': 'Envía a nuevo contacto',
                'refreshErrorTitle': '¡Ouch!, no pudimos actualizar tu lista de contactos',
                'errorStartTransferMoney': 'Lo sentimos, en este momento no podemos realizar una transferencia.',
                'errorRequestMoneyNoSherpa': 'Lo sentimos, al este usuario no se le puede pedir plata',
                'lastMovementsTitle': 'Repite los últimos movimientos',
                'recurrentContact' : 'recurrentContact',
                'send': {
                    'title': 'Envía plata',
                    'icon': 'icon-sendmoney',
                    'lastTitle': 'Envió',
                    'yesterdayTitle': 'Ayer',
                    'noSherpa': {
                        'title': 'Aún no es usuario Nequi',
                        'context':'Si continúas, le enviaremos una notificación para que se registre y reciba su plata.',
                        'warningContext': 'Tendrá como límite hasta las 23:59 del  ',
                        'warningContextFinal': '. En caso contrario cancelaremos la transferencia.',
                        'continueTransfer': 'Continua la transferencia'
                    }
                },
                'request': {
                    'title': 'Pide plata',
                    'icon': 'icon-askmoney',
                    'lastTitle': 'Pidió',
                    'yesterdayTitle': 'Ayer'
                }
            },
            'resum': {
                'send': {
                    'description': 'Vas a realizar un envío',
                    'transferredAmount': 'Cantidad a transferir',
                    'makeTransfer': 'Hacer transferencia'
                },
                'request': {
                    'description': 'Vas a pedir a',
                    'transferredAmount': '¿Cuánto vas a pedir?',
                    'makeTransfer': 'Pide la plata'
                },

                'title': 'Resumen',
                'contact': 'Contacto',
                'phoneNumber': 'Número de celular',
                'message': 'Mensaje',

                'keySecurity': {
                    'titlePage': 'Envía plata',
                    'title': 'Pon tu clave',
                    'description': 'No dudamos que seas tú, pero igual ingresa tu clave.'
                },
                'confirmTransfer' : {
                    'title' : '¡Saldo insuficiente!',
                    'messagePartA' : 'El saldo del ',
                    'messagePartB' : ' es menor de lo que vas a enviar. ¿Quieres completar el envío con tu disponible?'
                },
                'transferOrigin' : {
                    'pocket' : 'bolsillo',
                    'saved' : 'guardadito'
                }
            },
            'send': {
                'send': {
                    'title': 'Envía Plata',
                    'addressee': 'Destinatario',
                    'description': '¿Cuánto quieres enviar?'
                },
                'request': {
                    'title': 'Pide Plata',
                    'addressee': 'Contacto',
                    'description': '¿Cuánto quieres pedir?'
                },
                'phoneNumber': 'Número de celular',
                'amount': 'Cantidad',
                'message': 'Mensaje'
            },
            'success' : {
                'send': {
                    'title' : '¡Listo!',
                    'body' : 'Acabas de hacer un movimiento,<br> ¿Qué más quieres hacer?',
                    'buttonBack': 'Vuelve a Nequi',
                    'link' : 'Haz otro'
                },
                'request': {
                    'title' : '¡Petición hecha!',
                    'body' : 'Acabas de hacer un movimiento,<br> ¿Qué más quieres hacer?',
                    'buttonBack': 'Vuelve a Nequi',
                    'link' : 'Haz otra'
                }
            },
            'sendMoney': {

            }

        },
        /**
         * keySecurity
        **/
        'keySecurity': {
            'titlePage': 'Seguridad',
            'title': 'Pon tu clave',
            'description': 'No dudamos que seas tú, pero igual ingresa tu clave.',
            'fortgotPassword': '¿Se te olvidó?'
        },
        /*
         *  ContactsProvider
         */
        'contactsProvider' : {
            'error' : {
                'navigatorNotFound' : 'No se encontro el objeto navigator.contacts para realizar la solicitud "find" de contactos',
                'notSaveJsonStore' : 'Los contactos no se lograron almacenar en el Json Store',
                'notSaveContactJsonStore' : 'El contacto no se pudo almacenar en el Json Store',
                'failUpdateState': 'Fallo actualización de estados de los contactos en el JsonStore',
                'fieldIdInvalid' : 'No existe el campo Id en el contacto',
                'dontConsultTheState' : 'Disculpe, no pudimos validar el estado de sus contactos por problemas de conexión.',
                'dontConsultContactsMobile' : 'Error consultando los contactos en el dispositivo',
                'getTransferToContact' : 'Disculpe, no se lograron consultar las transferencias recurrentes del contacto.',
                'addTransferToContact' : 'Disculpe, no se logro almacenar la transferencia en el historial del contacto.',
                'getRequestMoneyToContact' : 'Disculpe, no se lograron consultar las solicitudes recurrentes al contacto.',
                'addRequestMoneyToContact' : 'Disculpe, no se logro almacenar la solicitud de dinero en el historial del contacto.'
            }
        },
        /*
         * Adapters
        * */
        'sherpaAdapter': 'SherpaAdapter',
        'middlewareAdapter': 'Middleware',

        /**
         * Parameter
        **/
        'getDocumentTypes' : 'documentType',
        'getAgeMinimum' : 'ageMinimum',


        /**
         * cashin
        **/
        'cashin': {
            'title': 'Recarga tu cuenta',
            'balanceDescription': '<p>Además de recargar tu cuenta Nequi <br>desde la app o en un punto físico,<br> puedes hacerlo desde otro banco.</p>',
            'costsTable': 'Ver como y tabla de costes',
            'rechargeOnline': 'Recarga en línea',
            'physicalRecharge': 'Recarga en punto físico',
            'pse':{
                'title' : 'Estás a punto de salir de Nequi<br> Para ir a PSE',
                'explanetionText' : 'Es un medio de pago seguro que te permite a ti o a otros recargar tu Nequi desde cualquier cuenta bancaria rápidamente.',
                'contextualInfo' : 'Esta acción ocurre fuera de la App. Tranqui, es totalmente segura.',
                'url' : 'https://200.1.124.62/PSEHOstingUI/ShowTicketOffice.aspx?ID=1603'
            },
            'costs': {
                'title': 'Dos pasos para recargar tu cuenta desde otro banco',
                'titleStep1': '1. Elige como banco destino a',
                'textStep1': 'Bancolombia',
                'titleStep2': '2. Usa este número (tu cuenta)',
                'textStep2' : '0000 7037163',
                'textWarning' : '¡Agh! A veces nos toca hacer cosas que no queremos. (Este dinero se cobrará de tu disponible)',
                'table': {
                    'banco1Name': 'Bancolombia',
                    'banco1Value': 'Gratis',
                    'banco2Name': 'Davivienda',
                    'banco2Value': '$ 7.500',
                    'banco3Name': 'B. Occidente',
                    'banco3Value': '$ 8.100'
                },
                'redirect':{
                    'label': 'Formas de recargar tu cuenta gratis',
                    'url' : '#'
                }
            },
            'tour' : {
                'slides' : {
                    'stepOne': 'Ve a un punto físico Nequi.',
                    'stepTwo': 'Díle al vendedor cuanta plata quieres recargar en Nequi y ¡listo!'
                },
                'textButton': 'Busca un punto'
            }

        },

        /**
         * cashout
        **/
        'cashout': {
            'title': 'Saca en punto Nequi',
            'cashoutAtm': 'Retira en cajero',
            'physicalCashout': 'Retira en punto físico',

            'send':{
                'amount' : 'Cantidad',
                'actions' : 'Genera código',
                'msgErrorAmount': 'La cantidad está mal',

                'keySecurity': {
                    'titlePage': 'Seguridad',
                    'title': 'Pon tu clave',
                    'description': 'No dudamos que seas tú, pero igual ingresa tu clave.'
                }
            },

            'response': {
                'titlePage': 'Tu código instantáneo',
                'title': 'Este es tu código',
                'description': 'Solo dura 10 minutos, tranqui, si te encuentras a alguien en el camino, puedes sacar otro después.',
                'code': 'Código',
                'buttonBack': 'Vuelve a Nequi',
                'link' : 'Haz otro retiro'
            },

            'recurrent': {
                'titlePage': 'Retiro punto Nequi',
                'lastCashout': 'Últimos retiros',
                'doCashout': 'Haz un retiro',
                'cashoutPointSearch': 'Busca un punto de retiro'
            }
        },


        /* Movimientos */
        'movements' : {
            'title' : 'HISTORIAL DE MOVIMIENTOS',
            'notMoreMovementsTitle' : 'No existen más movimientos',
            'detail':{
                'phoneNumber':'Número de celular',
                'labelMount':'Monto',
                'labelTransactionCost':'Costo movimiento',
                'labelDate':'Fecha',
                'labelReference':'Referencia',
                'labelAsociate':'Etiquetas asociadas',
                'labelRepeatMovement': 'Repite'
            }
        },

        /* Resumen de pago */
        'payResume': {
            'title': 'Así va el pago',
            'labelLocation': 'Estás pagando en:',
            'labelQuantity': '¿Cuánto?',
            'errorModalTitle': 'Código erróneo',
            'success':{
                'title':'Acabas de pagar',
                'otroPago' : 'Haz otro pago',
                'comprobante' : 'Mira el comprobante'
            },
            'errorBalance':{
                'title': '¡Uuuy! no te alcanza',
                'body': '<Pero tranqui ¡Todo tiene solución!',
                'button': 'Haz una recarga'
            },
            'confirmPay' : {
                'title' : '¡Uuuy! no te alcanza',
                'messagePartA' : 'El saldo del ',
                'messagePartB' : ' es menor de lo que vas a enviar. ¿Quieres completar el envío con tu disponible?'
            },
            'transferOrigin' : {
                'pocket' : 'bolsillo',
                'saved' : 'guardadito'
            }
        },
        /* Pagos */
        'paymentsQRcode': {
            'title': 'Pagar',
            'description': 'Si no puedes escanear el QR puedes pedirle al encargado el código numérico.',
            'placeHolder': 'Ingresa el código',
            'requestCamPermission': {
                'title': '<strong>Tienes que escanear un código QR',
                'context': 'Necesitamos acceder a tu cámara para pagar fácil y rápido. Tranqui, no es para selfies.'
            },
            'camPermissionDenied': {
                'title': '¡No sabes lo que te pierdes!',
                'description': 'Necesitamos acceder a tu cámara para que pagues fácil y rápido.Vé a las configuraciones de tu dispositivo y danos permiso.'
            },
            'camScanError': {
                'title': '¡Houston, tenemos un problema!',
                'description': 'Revisa y vuelve a escanear el QR.',
                'enterCode': 'Ingresa el código'
            },
            'firstEnrollmentPay': {
                'title': '¿Cómo te fue?',
                'content': 'Esto es así, en un dos por tres. Si abres una cuenta Nequí podrás hacer muchas cosas más.<',
                'openAccount': 'Abre una cuenta',
                'keepTrying': 'Sigue en modo prueba'

            }
        },

        /* Comprobante de pago */
        'voucher':{
            'title': 'Comprobante de pago',
            'pointLabel': 'Pagaste en',
            'amountLabel' : '¿Cuánto?',
            'costLabel' : 'Costo envío',
            'costValue' : '$0',
            'dateLabel' : 'fecha',
            'referenceLabel': 'Referencia',
            'goBack': 'Vuelve a Nequi'
        },

        /* Modal ultimo aviso */
        'finalWarningModal':{
            'title':'Esa no es tu clave',
            'description': 'Pero, todos merecemos una segunda oportunidad.',
            'question':'¿Qué quieres hacer?',
            'tryAgain':'Intenta otra vez',
            'forgotPassword':'¿Se te olvidó?'
        },

        /* Modal acceso bloqueado */
        'blockAccountModal':{
            'title':'Un elefante nunca olvida, ¡pero tú si!',
            'description':'Has ingresado muchas veces una clave incorrecta. Por seguridad hemos bloqueado el ingreso a tu cuenta por un tiempo.',
            'info':'Para entrar a Nequi otra vez debes que esperar:',
            'time':'02:30:18',
            'timeInfo':{
                'hours':'HORAS',
                'minutes':'MINUTOS',
                'seconds':'SEGUNDOS'
            }
        },

        /*Bolsillos*/
        'pocket':{
            'title' : 'Nuevo Bolsillo',
            'nameLabel': 'Nombre',
            'valueLabel': 'Cantidad',
            'createButton':  'Crea bolsillo',
            'successModal':{
                'title': '¡Bolsillo',
                'title2': 'creado!',
                'body' : 'En este bolsillo tienes',
                'newPocket': 'Crea nuevo bolsillo'
            }
        },

        'pockets': {
            'title': 'Mis Bolsillos',
            'labelButton': 'Nuevo bolsillo',
            'notPockets': {
                'title': 'No tienes ningún bolsillo',
                'text': 'Para que NO malgastes ni un peso. Los bolsillos organizan tu plata, puedes crear hasta 10.',
                'labelButton': 'Crea bolsillo'
            },
            'deletedPocket': {
                'labelButtonReady' : 'Listo',
                'labelButtonCreate' : 'Crea nuevo bolsillo',
                'textResume' : 'En este bolsillo tienes:',
                'titlePartA' : '¡Bolsillo',
                'titlePartB' : 'eliminado!'
            }
        },

        'originMoney' : {
            'title' : 'Usa tu plata',
            'instructions' : 'Selecciona desde que bolsillo quieres',
            'labelButton' : 'Saca de aquí'
        },
        /* Detalle de un bolsillo */
        'pocketDetail': {
            'payWithCel': 'Pagar con el celular',
            'deletePocket': 'Elimina bolsillo',
            'confirmUpdate': {
                'title': 'Actualiza bolsillo',
                'message': 'Confirma la actualización.'
            },
            'confirmDelete' : {
                'title': 'Elimina bolsillo',
                'message': '¿Quieres eliminar el bolsillo?'
            }
        },

        'insufficientMoney' : {
            'titleA' : '¡Oops!',
            'titleB' : 'tenemos un problema',
            'subTitleA' : 'No tienes suficiente plata en tu ',
            'subTitleB' : ' para completar tu pago',
            'labelMoney': 'Te faltan: ',
            'labelQuestion' : '¿Quieres sacarlos del disponible?',
            'labelButton' : 'Completar pago',
            'labelReturn' : 'Elegir otro bolsillo',
            'transferOrigin' : {
                'pocket' : 'bolsillo',
                'saved' : 'guardadito'
             }
        },
        /*Guardadito*/
        'saved': {
            'description': 'Tener plata para un gasto con el que no contabas, nunca te sientas en problemas, ten siempre plata a la mano.',
            'modalZero': {
                'title': '¡Empieza a guardar!',
                'description': 'Aquí podrás separar plata. lo que separes estará bloqueado por, pero si la necesitas sólo tienes que devolverla al disponible.'
            },
            'modalUpdate': {
                'title': '¡Tu guardadito!',
                'description': 'Ya hemos separado esta plata. La tienes bloqueda, pero si la necesitas, solo tienes que moverla a disponible.'
            }
        },

        /* Recovery Password */
        'recoverPassword': {
            'title': 'CAMBIO DE CLAVE',
            'formTitle': 'Verifica tu email',
            'formDescription': 'Introduce la dirección de correo electrónico que has registrado para enviarte instrucciones.',
            'placeholder': 'E-mail',
			'mailWrong': 'La dirección de correo es inválida.',
            'date' : {
                'titleHeader' : 'Reactivar cuenta',
                'titleContent' : 'Fecha de expedición de tu cédula',
                'context' : '  Para continuar introduce la fecha de expedición de tu cédula y confirmamos que eres tu.',
                'labelExpeditionDate' : 'Fecha de expedición'
            },
            'confirmCancel' : {
                'title' : 'Salir',
                'message' : '¿Desea salir de la recuperación de la clave?'
            },
            'modalSuccess' : {
                'title' : '¡Correo enviado!',
                'subtitle' : 'Revisa tu correo.',
                'context' : 'Te hemos enviado un mail con un <br>link para asegurarnos del cambio.',
                'labelButtonForwardEmail' : 'No he recibido el correo'
            }
        },
        'biometry': {
            'title': 'Reconocimiento facial',
            'titleVoice' : 'Reconocimiento por voz',
            'description': 'La biometría facial mide los puntos de tu cara... cómo ',
            'takePicture': 'Tomar foto',
            'help' : {
                'nextNeedFace' : 'A continuación necesitarás,',
                'registerFace' : 'registrar tu rostro',
                'weNeedAccessToCamera' : 'Por ello necesitamos acceder a tu cámara para que podamos escanear tu rostro.',
                'youAreYoureOwnPassword' : 'Tú eres tu propia clave', 
                'useBiometryAsSecurity' : 'Utiliza la biometría como seguridad y',
                'forgetYourPassword' : 'olvídate de contraseñas', 
                'advices' : 'Consejos'
            },
            'modalZero': {
                'title': '¡Empieza a guardar!',
                'description': 'Aquí podrás separar plata. lo que separes estará bloqueado por, pero si la necesitas sólo tienes que devolverla al disponible.'
            },
            'modalUpdate': {
                'title': '¡Tu guardadito!',
                'description': 'Ya hemos separado esta plata. La tienes bloqueda, pero si la necesitas, solo tienes que moverla a disponible.'
            }, 
            'successPopUp' : {
                'title' : '¡¡¡Lo hiciste!!!',
                'description' : 'Haz terminado de crear tu cuenta, te invitamos a iniciar sesión'
            }, 
            'errorPopUp' : {
                'title' : 'Lo lamentamos',
                'description' : 'No se ha podido completar el registro'
            },
            'facial' : {
                'title' : 'Facial',
                'description' : 'Método por rostro',
                'photo' : 'Foto',
                'successLogin' : {
                    'title' : 'Perfecto!!',
                    'description' : 'Te hemos reconocido, puedes comenzar a disfrutar de Nequi'
                },
                'errorLogin' : {
                    'title' : 'Intenta de nuevo',
                    'description' : 'No te pudimos reconocer, intenta de nuevo'
                }
            },
            'voice' : {
                'title' : 'Voz',
                'description' : 'Método por voz',
                'successLogin' : {
                    'title' : 'Perfecto!!',
                    'description' : 'Hemos reconocido tu voz, puedes comenzar a disfrutar de Nequi'
                }
            }
        },

        /*
         * Procedures
         * */
        'middlewareProcedure' : 'sendHelloWorld',
        'getActiveContract' : 'getActiveContract',
        'acceptContractProcedure': 'acceptContract',
        'getParameter' : 'getParameter',
        'requestDocumentValidation' : 'documentValidation',
        'faqsProcedure': 'faqs',
        'emailValidationProcedure' : 'emailValidation',
        'userLoginValidationProcedure' : 'phoneNumberEmailValidation',
        'userAuthenticationProcedure' : 'login',
        'requestBalance' : 'getBalance',
        'requestBalanceRegistry' : 'getBalanceRegistry',
        'sendEmailContractProcedure': 'sendEmailContract',
        'getProfileUserProcedure' : 'getProfileUser',
        'timeoutConnectionAdapter': 120000
};
