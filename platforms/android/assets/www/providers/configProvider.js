angular.module('App')
    .factory('configProvider', function (){

var config = Object.freeze({
    'userStates':{
        'preEnroll': '1',
        'enroll': '2',
        'liteRegistry': '3',
        'hardRegistry': '4'
    },
    'storage': {
        'username': 'app',
        'password': '4pp'
    },
    'errorMiddleware': {
        'validateLoginNull': 1000
    },
    /* Config JsonStore */
    'jsonStore': {
        'collection': 'App',
        'key': 'sherpa'
    },
    /* Config fields directory */
    'fieldsDirectory':{
        'displayName': 'displayName',
        'name': 'name',
        'phoneNumbers': 'phoneNumbers'
    },
    /* Config typeTransfers */
    'typeTransfer': {
        'request' : 'request',
        'send' : 'send',
        'cashout': 'cashout',
        'pay': 'pay'
    },
    /* origen de las transferencias */
    'transferOrigin': {
       'available': 'available',
       'pocket': 'pocket',
       'saved': 'saved'
    },
    'months': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    'days': ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
    'middlewareAdapter': 'Middleware',
    'getStateContactsProcedure' : 'getStateContacts',
    'getTransferRecurrentContactProcedure': 'getTransferRecurrentContact',
    'setTransferSherpaSherpaProcedure': 'setTransferSherpaSherpa',
    'setTransferSherpaNoSherpaProcedure': 'setTransferSherpaNoSherpa',
    'requestMoneyProcedure': 'requestMoney',
    'setCashOutProcedure' : 'sendCashOut',
    'getSeed': 'getSeed',
    'getResumeRequestMoneyProcedure': 'getResumeRequestMoney',
    'procedureCloseSherpaSession' : 'procedureCloseSherpaSession',
    'requestBalance' : 'getBalance',
    'requestBalanceRegistry' : 'getBalanceRegistry',
    'userAuthenticationProcedure' : 'login',
    'validationkeySecurityProcedure': 'validationkeySecurity',
    'requestDocumentValidation' : 'documentValidation',
    'getParameter' : 'getParameter',
    'getProfileUserProcedure' : 'getProfileUser',
    'getMovementsHistoryProcedure' : 'getMovementsHistory',
    'activateDevice': 'activateDevice',
    'requestEnroll' : 'requestEnroll',
    'validateToken' : 'validateToken',
    'validateTokenRegistry' : 'validateTokenRegistry',
    'generateOTPProcedure' : 'generateOTP',
    'paymentsProcedure' : 'sendPayments',
    'paymentsEnrollProcedure' : 'sendPaymentsEnroll',
    'getPayResumeProcedure' : 'getPayResume',
    'getTransactionIDProcedure' : 'getTransactionID',
    'getEnrolledTransactionIDProcedure' : 'getTransactionIDEnroll',
    'createPocketProcedure' : 'createPocketProcedure',
    'getPocketsProcedure' : 'getPockets',
    'deletePocketProcedure' : 'deletePocket',
    'updateValuePocketProcedure' : 'updateValuePocket',
    'deleteDeviceProcedure': 'deleteDeviceProcedure',
    'updateValueSavedProcedure': 'updateValueSaved',
    'getHelpProcedure': 'getHelp',
    'validateExpeditionDateProcedure' : 'validateExpeditionDate',
    'forwardEmailProcedure' : 'forwardEmail',
    'validateClientEmailProcedure': 'validateClientEmail',
    'resendConfirmEmailProcedure': 'resendConfirmEmail',

    'transactions' : {
        'maxLastTranfersMoney': '5',
        'maxLastTranfersMoneyContact': '3',
        'maxLastRequestMoney': '5',
        'maxLastRequestMoneyContact': '3',
        'sendName' : 'Envio',
        'requestName' : 'Solicitud',
        'todayText' : 'Hoy',
        'yesterdayText' : 'Ayer',
        'maxLastCashouts': '3'
    },

    'cashout': {
        'minimumAmount': '50'
    },

    /* Movements History */
    'movements' : {
        'maxPageSize' : '10',
        'codes' : {
            'T001' : 'pay',
            'T002' : 'pay',
            'R001' : 'send',
            'R002' : 'send',
            'C001' : 'pay',
            'P001' : 'pay',
            'PE01' : 'send',
            'codeDefault' : 'send'
        },
        'nameByCode' : {
            'T001' : 'Envio',
            'T002' : 'Envio',
            'R001' : 'Recarga PSE',
            'R002' : 'Recarga',
            'C001' : 'Retiro',
            'P001' : 'Pago',
            'PE01' : 'Petición',
            'codeDefault' : 'S/E'
        },
        'request' : 'PE01',
        'send' : 'T001',
        'sendRequest' : 'T002',
        'pay': 'P001',
        'titleButtonSend' : 'envio',
        'titleButtonRequest' : 'petición',
        'titleButtonDefault' : 'movimiento',
        'titleButtonPay': 'Ver Ticket'
    },

    'errorMessages': {
        /*Provisioning Errors*/
        '2001' : 'Aprovisionamiento fallido',
        '2002' : 'Falló generando soft token',
        '2003' : 'Falló validando aprovisionamiento',
        '2004' : 'Falló lectura del QR',
        '2005' : 'La compra ya se realizó.',
        '2006' : 'La compra no ha sido procesada.',
        '2007' : 'La compra ha sido cancelada.',
        '3001' : 'Error iniciando transacción. Por favor inténtelo nuevamente.',
        '2008' : 'Ya te encuentras vinculado, ingresa tus datos para iniciar sesion.'
    },

    /*
     * Token easySolution
     */
    'smsTokenSize' : 4,
    'otpSize': 4,

    /*Prefijo con el que se firman los codigos QR de pagos desde el merchand.*/
    'prefixPayQR': 'bancadigital-',

    'paymentsSummaryType':{
        'resumen': 'resumen',
        'voucher': 'voucher'
    },

    'paymentsStatus': {
        'pay': '35',
        'pending': '33',
        'cancel': '34'
    },

    'pocket': {
        'minRound': 1000,
        'maxRound': 2000
    },

    'saved': {
        'minRound': 10000,
        'maxRound': 20000
    },

    /*
     * Errors codes
     */
    'errors': {
        'con001':{
             'code': '1001',
             'text' : 'Parece que no hay conexión a internet'
        },
        'con002':{
             'code': '1002',
             'text' : 'Parece que no hay conexión a internet'
        },
        'con003':{
             'code': '1003',
             'text' : 'Ha ocurrido un error, por favor inténtalo nuevamente'
        },
        'provisioning': {
            'deviceRegistrationError': '2001',
            'softTokenError': '2002',
            'isDeviceProvisionedError': '2003',
            'deviceRegistrationErrorInRegistry': '2008'
        },
        'camera':{
            'cancel': '2004'
        },
        'payments':{
            'statusPay': '2005',
            'statusPending': '2006',
            'statusCancel': '2007'
        },
        'transactionID': {
            'errorGeneratingTrnID': '3001',
            'trnIdInProcess': '11-5L',
            'trnIdSuccess': '11-6L',
            'trnIDFail': '11-7L'
        },
        'generalError' : 'Se ha presentado un error inesperado'
    },

    /* config password transactional */
    'password':{
        'one':'passwordOne',
        'two':'passwordTwo',
        'empty':'',
        'validate':'validatePassword',
        'create':'password'
    },

    'permission': {
        'cam': {
            'denied': 'denied',
            'cancel': 'cancelled',
            'miscFailure' : 'Scan failed due to an error'
        }
    },

    /*scanner*/
    'scanner':{
        'title': '',
        'instructions' : 'Apunte su camara al código para realizar el pago'
    },

    /* Configuración para bolsillos */
    'pockets' : {
        'maxPockets' : 10
    },

    /* Tipos de items que se tienen en el dashboard */
    'pocketsTypes' : {
        'pocket' : 0,
        'goals' : 1,
        'saved' : 2,
        'pocketsAndSaved' : 3
    },

    'pocketsCode' : {
        '0' : 'pocket',
        '1' : 'goals',
        '2' : 'saved',
        '3' : 'pocketsAndSaved'
    },

    'pocketsName' : {
        'pockets' : 'Bolsillos',
        'goals' : 'Metas',
        'saved' : 'Guardadito',
        'pocketsAndSaved' : 'Bolsillos y Guardadito',
        'available' : 'Disponible'
    },

    /*ayuda*/
    'help': {
        'idHelp': '1'
    },

    /*Tipos de errores con los que se visualiza el toastProvider `exito`, `informativo` o `error`*/
    'toastTypeMessage': {
        'danger': 'danger',
        'success': 'success',
        'information': 'info'
    },

    'contactsProvider' : {
        'idNotContact' : '0'
	},
    /*Errores homologados y controlados para el ldapt*/
    'ldapErrorsId':{
        'blockTemp' : '11-3L',
        'block' : '11-1L'
    },
    /* Tipos de email que se les solicita enviar al Back */
    'typeEmail' : {
        'forwardEmailPassword' : '2'
    }
});

return config;

});
