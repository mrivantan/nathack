angular
    .module('MyApp', ['ui.router'])
    .config(AppStates);

AppStates.$inject = ['$urlRouterProvider', '$stateProvider'];

function AppStates($urlRouterProvider, $stateProvider) {

    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'views/welcome.html',
            controller: 'WelcomeCtrl',
            controllerAs: 'ctrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'ctrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'ctrl'
        });
    $urlRouterProvider.otherwise("/welcome");
}


angular
    .module('MyApp')
    .controller('WelcomeCtrl', WelcomeCtrl);
WelcomeCtrl.$inject = ['$state', '$interval', 'UserDataSvc'];
function WelcomeCtrl($state, $interval, UserDataSvc) {
    var vm = this;
    vm.goLogin = function () {
        $state.go('login');
    };
    vm.goRegister = function () {
        $state.go('register');
    };

    var bar = document.getElementById('progress');
    bar.style.transition = 'all 0.1s';
    $interval(function () {
        var c = authcvs.acceptCounter * 100;
        bar.style.width = c + '%';
        bar.style.backgroundColor = 'rgba(' + (200 - c) + ',50,' + c + ',1)';
        if (authcvs.processed) {
            authcvs.endFeed();
            vm.goLogin();
        }
    }, 100);

    document.body.onkeyup = function(e){

        // key:1 ivan (cheating buttons heh..)
        if(e.keyCode == 49) {
            UserDataSvc.setUser(1);
            console.log('ivan');
            vm.goLogin();
        }
        else if(e.keyCode == 50) {
            UserDataSvc.setUser(2); console.log('ken');
            vm.goLogin();
        }
        else if(e.keyCode == 51) {
            UserDataSvc.setUser(3);
            console.log('nik');
            vm.goLogin();
        }

    };


    var skylink = new Skylink();

    var vid = document.getElementById('my-video');
    skylink.getUserMedia(function (error, success) {
        if (error) return;
        vid.autoplay = true;
        vid.muted = true;
        attachMediaStream(vid, success);
        authcvs.init(vid);
    });


}




angular
    .module('MyApp')
    .controller('LoginCtrl', LoginCtrl);
LoginCtrl.$inject = ['$state', 'UserDataSvc'];
function LoginCtrl($state, UserDataSvc) {
    var vm = this;
    console.log('loaded ctrl');
    vm.user = UserDataSvc.getSelectedUserInfo();
    vm.cfdata = UserDataSvc.getCfData(vm.user.client);

    var skylink = new Skylink();
    skylink.on('peerJoined', function(peerId, peerInfo, isSelf) {
        if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
        var vid = document.createElement('video');
        vid.autoplay = true;
        vid.muted = true; // Added to avoid feedback when testing locally
        vid.id = peerId;
    });

    skylink.on('incomingStream', function(peerId, stream, isSelf) {
        if(isSelf) return;
        var vid = document.getElementById(peerId);
        attachMediaStream(vid, stream);
    });

    skylink.on('peerLeft', function(peerId, peerInfo, isSelf) {
        var vid = document.getElementById(peerId);
        document.body.removeChild(vid);
    });

    skylink.on('mediaAccessSuccess', function(stream) {
        var vid = document.getElementById('video');
        attachMediaStream(vid, stream);
    });

    skylink.init({
        apiKey: UserDataSvc.getApiKey(),
        defaultRoom: UserDataSvc.getSelectedUserInfo().roomName
    }, function() {
        skylink.joinRoom({
            audio: false,
            video: true
        });
    });

    setTimeout(function () {
        dashboard('#dashboard',freqData);

    },2000);

}

angular
    .module('MyApp')
    .controller('RegisterCtrl', RegisterCtrl);
RegisterCtrl.$inject = ['$state'];
function RegisterCtrl($state) {
    var vm = this;

}


angular
    .module('MyApp')
    .factory('UserDataSvc', UserDataSvc);
UserDataSvc.$inject = [];
function UserDataSvc() {
    var vm = this;

    vm.apiKey = 'a2f10141-e14e-4d73-b911-06b434cfc45e';
    vm.selectedUser = 1;
    vm.users = [
        {
            client: 1,
            name: 'Ivan',
            roomName: '1'
        },
        {
            client: 2,
            name: 'Kenneth',
            roomName: '1'
        },
        {
            client: 3,
            name: 'Nikhil',
            roomName: '2'
        }
    ];

    vm.cfdat = [
        {
            "mall": 2,
            "date": "2016-01-14T16:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.64,
                    "n_unit": 1,
                    "desc": "AGUA SOLAN CABRAS"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T14:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.9,
                    "n_unit": 1,
                    "desc": "PAQUETE 500 HOJAS A4"
                },
                {
                    "net_am": 4.99,
                    "n_unit": 1,
                    "desc": "LEGGING NINA 3/14"
                },
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "JERSEY UNISEX 3/14"
                },
                {
                    "net_am": 4.6,
                    "n_unit": 3,
                    "desc": "HUESITOS LECHE 12"
                },
                {
                    "net_am": 2.65,
                    "n_unit": 1,
                    "desc": "MINI FUET CAMPOFRIO"
                },
                {
                    "net_am": 2.78,
                    "n_unit": 2,
                    "desc": "REGAÑA ACEITE OLIV"
                },
                {
                    "net_am": 15.95,
                    "n_unit": 1,
                    "desc": "MEGA MAKI"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T12:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.6,
                    "n_unit": 1,
                    "desc": "BOLSA RAFIA CARREFOU"
                },
                {
                    "net_am": 59.25,
                    "n_unit": 15,
                    "desc": "LIBRO D INFANTIL"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T23:07:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "JAMONERO COLUMNA"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T12:24:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 12.75,
                    "n_unit": 1,
                    "desc": "ANTIARRUGAS HYDREA"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T22:06:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.65,
                    "n_unit": 1,
                    "desc": "CHULETA LOMO EXTRATI"
                },
                {
                    "net_am": 5.4,
                    "n_unit": 2,
                    "desc": "DESODORANTE HENO"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "7 AJAX ESTROPAJO JAB"
                },
                {
                    "net_am": 0,
                    "n_unit": 1,
                    "desc": "LOCIÓN CORPORAL"
                },
                {
                    "net_am": 7.4,
                    "n_unit": 2,
                    "desc": "LOCIÓN INTENSIVA"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T15:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3,
                    "n_unit": 1,
                    "desc": "TOSTA VARIADA"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "BAGUETTE TORTILLA"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:07:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "CARAMELOS S/AZUCAR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:07:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.83,
                    "n_unit": 1,
                    "desc": "QUESO TIERNO MEZCL"
                },
                {
                    "net_am": 1.65,
                    "n_unit": 1,
                    "desc": "GUISANTES MUY FINO"
                },
                {
                    "net_am": 1.77,
                    "n_unit": 1,
                    "desc": "BIFIDUS CON FRUTAS"
                },
                {
                    "net_am": 1.16,
                    "n_unit": 1,
                    "desc": "MAIZ DULCE PACK3X140"
                },
                {
                    "net_am": 2.5,
                    "n_unit": 1,
                    "desc": "SANUS FRESA L. CASEI"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "FANTA LIMÓN S/BURB"
                },
                {
                    "net_am": 1.85,
                    "n_unit": 1,
                    "desc": "CEREALES ESTRELLITAS"
                },
                {
                    "net_am": 2.15,
                    "n_unit": 1,
                    "desc": "SALVASLIP EVAX"
                },
                {
                    "net_am": 1.09,
                    "n_unit": 1,
                    "desc": "YOGUR NATURAL DANO"
                },
                {
                    "net_am": 1.15,
                    "n_unit": 1,
                    "desc": "ARROZ LARGO SOS 1 KI"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "YORK SANDWICH ELPO"
                },
                {
                    "net_am": 0.75,
                    "n_unit": 1,
                    "desc": "BARQUILLO NATA COVY"
                },
                {
                    "net_am": 1.39,
                    "n_unit": 1,
                    "desc": "TRINA LIMON 1,5LITRO"
                },
                {
                    "net_am": 1.85,
                    "n_unit": 1,
                    "desc": "CHORIZO DULCE CARR"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "PIMIENTO PIQUILLO"
                },
                {
                    "net_am": 6,
                    "n_unit": 24,
                    "desc": "CERVEZA HOLANDESA"
                },
                {
                    "net_am": 1.34,
                    "n_unit": 1,
                    "desc": "PECHUGA PAVO LONCH"
                },
                {
                    "net_am": 1.52,
                    "n_unit": 6,
                    "desc": "AGUA CARREFOUR 2 L"
                },
                {
                    "net_am": 1.69,
                    "n_unit": 1,
                    "desc": "FIAMBRE JAMON PAVO"
                },
                {
                    "net_am": 0.66,
                    "n_unit": 1,
                    "desc": "BIFIDUS COCO 0%"
                },
                {
                    "net_am": 2.74,
                    "n_unit": 1,
                    "desc": "DUPLO COLGATE TRIP"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T21:03:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.63,
                    "n_unit": 1,
                    "desc": "MANDARINA MARCA GR"
                },
                {
                    "net_am": 6.62,
                    "n_unit": 1,
                    "desc": "POLLO PECHUGA ENTERA"
                },
                {
                    "net_am": 2.75,
                    "n_unit": 1,
                    "desc": "PAPEL HIGIENICO SCOT"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "TORCIGLIONI SEMOLA"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "ACEITE OLIVA CARBO"
                },
                {
                    "net_am": 2.24,
                    "n_unit": 3,
                    "desc": "ARROZ CALDOSO SOS"
                },
                {
                    "net_am": 1.3,
                    "n_unit": 1,
                    "desc": "CHEETOS PANDILLA"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "YOGUR BIO C/FRUTAS"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "ACTIVIA 0% MELOCOT"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "ACTIVIA C/MANGO X4"
                },
                {
                    "net_am": 1.11,
                    "n_unit": 1,
                    "desc": "FLOUR TORTILLAS CARR"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T21:03:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "BAGUETTE TORTILLA"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T22:03:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.49,
                    "n_unit": 1,
                    "desc": "MANZANA FUJI"
                },
                {
                    "net_am": 2,
                    "n_unit": 1,
                    "desc": "PECHUGAS PAVO LONCHA"
                },
                {
                    "net_am": 3.63,
                    "n_unit": 1,
                    "desc": "CHOCOLATINA T2 KINDE"
                },
                {
                    "net_am": 2.3,
                    "n_unit": 1,
                    "desc": "GALLETA DIGESTIVE"
                },
                {
                    "net_am": 3.8,
                    "n_unit": 1,
                    "desc": "COLA CAO FIBRA 0%"
                },
                {
                    "net_am": 1.29,
                    "n_unit": 1,
                    "desc": "CORAZON LECHUGA"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 2.15,
                    "n_unit": 1,
                    "desc": "CHOCOLATE DULCE LECH"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T21:03:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.46,
                    "n_unit": 1,
                    "desc": "PHILADELPHIA LIGHT"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "PECHUGA PAVO LONCH"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "PECHUGA PAVO CUIDAT+"
                },
                {
                    "net_am": 1.62,
                    "n_unit": 1,
                    "desc": "ESPUMA GIORGI"
                },
                {
                    "net_am": 3,
                    "n_unit": 1,
                    "desc": "FILETE PECHUGA POLLO"
                },
                {
                    "net_am": 0.6,
                    "n_unit": 1,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 0.85,
                    "n_unit": 1,
                    "desc": "LIMON CARREFOUR"
                },
                {
                    "net_am": 5.15,
                    "n_unit": 1,
                    "desc": "MAKI CALIFORNIA"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:01:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.9,
                    "n_unit": 6,
                    "desc": "GOURMET 85GR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:22:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 4.7,
                    "n_unit": 1,
                    "desc": "RIOJA VIÑA CUMBRER"
                },
                {
                    "net_am": 5.13,
                    "n_unit": 3,
                    "desc": "SIDRA MENENDEZ 70"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T19:22:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0,
                    "n_unit": 0,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 19,
                    "n_unit": 1,
                    "desc": "REC DENT PH HX2014"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:21:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 117,
                    "n_unit": 3,
                    "desc": "TABURETE BAR NEGRO"
                },
                {
                    "net_am": 59,
                    "n_unit": 1,
                    "desc": "SILLON GIRATORIO"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T14:37:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.51,
                    "n_unit": 1,
                    "desc": "BROCOLI CARREFOUR"
                },
                {
                    "net_am": 1.1,
                    "n_unit": 1,
                    "desc": "BARRAS PAN 3 UNIDA"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T13:37:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "PASTAS DE AVELLANA"
                },
                {
                    "net_am": 1.1,
                    "n_unit": 1,
                    "desc": "BARRAS PAN 3 UNIDA"
                },
                {
                    "net_am": 3,
                    "n_unit": 3,
                    "desc": "JAMON SERRANO"
                },
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "CHORIZO EXTRA TACOS"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T21:21:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "PANETONNE SWEET"
                },
                {
                    "net_am": 2.7,
                    "n_unit": 1,
                    "desc": "JAMON COCIDO EXTRA"
                },
                {
                    "net_am": 1.66,
                    "n_unit": 1,
                    "desc": "YOGUR BIFIDUS VRAI"
                },
                {
                    "net_am": 1.66,
                    "n_unit": 1,
                    "desc": "BIFIDUS LIMON ECO"
                },
                {
                    "net_am": 3.92,
                    "n_unit": 2,
                    "desc": "QUESO GOUDA LONCHA"
                },
                {
                    "net_am": 3.15,
                    "n_unit": 1,
                    "desc": "PIZZA MARGARITA"
                },
                {
                    "net_am": 0.91,
                    "n_unit": 1,
                    "desc": "PURE PATATA BOL MAGG"
                },
                {
                    "net_am": 1.16,
                    "n_unit": 1,
                    "desc": "AGUA LEVITE LIMON"
                },
                {
                    "net_am": 1.4,
                    "n_unit": 1,
                    "desc": "CREMA CHAMPIÑONES X3"
                },
                {
                    "net_am": 3.2,
                    "n_unit": 1,
                    "desc": "BIZCOCHO ZANAHORIA"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T14:37:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "REVISTAS 4% IVA"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T13:37:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.34,
                    "n_unit": 1,
                    "desc": "ENSALADA RUSA"
                },
                {
                    "net_am": 7.18,
                    "n_unit": 1,
                    "desc": "PLÁTANO 1ª BOLSA"
                },
                {
                    "net_am": 7.39,
                    "n_unit": 1,
                    "desc": "PAPEL HIGIENICOx24"
                },
                {
                    "net_am": 5.99,
                    "n_unit": 1,
                    "desc": "LAVAVAJILLA CARREF"
                },
                {
                    "net_am": 2.85,
                    "n_unit": 1,
                    "desc": "PAPEL COCINA FAMIL"
                },
                {
                    "net_am": 1.51,
                    "n_unit": 1,
                    "desc": "ABRILLANTADOR LAVA"
                },
                {
                    "net_am": 0.98,
                    "n_unit": 1,
                    "desc": "SAL LAVAVAJILLAS 3KG"
                },
                {
                    "net_am": 4.1,
                    "n_unit": 1,
                    "desc": "DETERGENTE POLVO 30"
                },
                {
                    "net_am": 5.98,
                    "n_unit": 2,
                    "desc": "GAZPACHO 1LITRO"
                },
                {
                    "net_am": 3,
                    "n_unit": 1,
                    "desc": "PINCHOS DE CERDO"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T23:21:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.99,
                    "n_unit": 1,
                    "desc": "VINO PEÑASCAL75 CL"
                },
                {
                    "net_am": 8,
                    "n_unit": 1,
                    "desc": "TENDEDERO C/ALAS"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T23:21:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.83,
                    "n_unit": 1,
                    "desc": "MELÓN CANTALOUP"
                },
                {
                    "net_am": 4.56,
                    "n_unit": 1,
                    "desc": "GALLITO"
                },
                {
                    "net_am": 3.55,
                    "n_unit": 1,
                    "desc": "DORADA A LA ESPALD"
                },
                {
                    "net_am": 5.23,
                    "n_unit": 1,
                    "desc": "DORADA A LA ESPALD"
                },
                {
                    "net_am": 3,
                    "n_unit": 2,
                    "desc": "ENSALADA FRUTA 350"
                },
                {
                    "net_am": 2.35,
                    "n_unit": 1,
                    "desc": "AMBIENTADOR OUST"
                },
                {
                    "net_am": 4.5,
                    "n_unit": 1,
                    "desc": "KIT 4BAYETAS SPONTEX"
                },
                {
                    "net_am": 5.1,
                    "n_unit": 3,
                    "desc": "COLGADOR WC LIQUID"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "2FIBRA VERDE"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "2FIBRA BLANCA"
                },
                {
                    "net_am": 0.98,
                    "n_unit": 1,
                    "desc": "PURE PATATAS CARREFO"
                },
                {
                    "net_am": 3.6,
                    "n_unit": 1,
                    "desc": "QUITAMANCHAS ROPA"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "BAYETA MICROFIBRA"
                },
                {
                    "net_am": 19.5,
                    "n_unit": 1,
                    "desc": "PARKA CRO FORRADA"
                },
                {
                    "net_am": 8.7,
                    "n_unit": 3,
                    "desc": "PAPEL SCOTTEX 84"
                },
                {
                    "net_am": 2.35,
                    "n_unit": 1,
                    "desc": "DON LIMPIO PHNEUTR"
                },
                {
                    "net_am": 2.35,
                    "n_unit": 1,
                    "desc": "DON LIMPIO BAÑO1,5"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "90 SERVILLETA BLANCA"
                },
                {
                    "net_am": 0.91,
                    "n_unit": 1,
                    "desc": "PURE PATATA BOL MAGG"
                },
                {
                    "net_am": 0.91,
                    "n_unit": 1,
                    "desc": "PURE PATATA QUESO"
                },
                {
                    "net_am": 2.2,
                    "n_unit": 1,
                    "desc": "2ESPONJA SCOTCHBRITE"
                },
                {
                    "net_am": 1.55,
                    "n_unit": 1,
                    "desc": "DETERLEJIA ESTRELL"
                },
                {
                    "net_am": 1.54,
                    "n_unit": 1,
                    "desc": "PAÑUELOS COLHOGAR"
                },
                {
                    "net_am": 1.4,
                    "n_unit": 1,
                    "desc": "GEL WC SANICENTRO"
                },
                {
                    "net_am": 1.87,
                    "n_unit": 1,
                    "desc": "NATA SPRAY PULEVA"
                },
                {
                    "net_am": 1.15,
                    "n_unit": 1,
                    "desc": "HOT DOGS BIMBO 330"
                },
                {
                    "net_am": 1.81,
                    "n_unit": 1,
                    "desc": "MULTIUSO ZAS KH7"
                },
                {
                    "net_am": 7,
                    "n_unit": 1,
                    "desc": "FRESÓN CAJA 2 KG"
                },
                {
                    "net_am": 1.35,
                    "n_unit": 1,
                    "desc": "CHAMPIÑÓN LAMINADO"
                },
                {
                    "net_am": 1.6,
                    "n_unit": 1,
                    "desc": "100 SERVILLETA DECOR"
                },
                {
                    "net_am": 0.6,
                    "n_unit": 1,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 0.75,
                    "n_unit": 1,
                    "desc": "GUANTES SATINADOS"
                },
                {
                    "net_am": 4.99,
                    "n_unit": 1,
                    "desc": "5 BAYETAS MICROFIBRA"
                },
                {
                    "net_am": 7.1,
                    "n_unit": 1,
                    "desc": "CHEESE CALI ROLL"
                },
                {
                    "net_am": 4.65,
                    "n_unit": 1,
                    "desc": "MAKI ATUN KELLYDEL"
                },
                {
                    "net_am": 9.9,
                    "n_unit": 1,
                    "desc": "SUSHI ATUN KELLYDE"
                },
                {
                    "net_am": 2.5,
                    "n_unit": 1,
                    "desc": "MORAS TARRINA 125"
                },
                {
                    "net_am": 1.07,
                    "n_unit": 1,
                    "desc": "LIMPIACRISTALES ORIG"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T15:36:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.57,
                    "n_unit": 1,
                    "desc": "GRANADA"
                },
                {
                    "net_am": 2.57,
                    "n_unit": 1,
                    "desc": "NARANJA MESA MARCA"
                },
                {
                    "net_am": 2.9,
                    "n_unit": 1,
                    "desc": "NARANJA MESA MARCA"
                },
                {
                    "net_am": 10.04,
                    "n_unit": 1,
                    "desc": "PLÁTANO 1ª BOLSA"
                },
                {
                    "net_am": 2.28,
                    "n_unit": 2,
                    "desc": "GALLETAS CHOCOLATE"
                },
                {
                    "net_am": 2.25,
                    "n_unit": 1,
                    "desc": "MINI BABYBEL X 6"
                },
                {
                    "net_am": 1.79,
                    "n_unit": 1,
                    "desc": "FRESÓN TARRINA 500"
                },
                {
                    "net_am": 1.21,
                    "n_unit": 1,
                    "desc": "ENSAIMADAS DULCESO"
                },
                {
                    "net_am": 4.38,
                    "n_unit": 3,
                    "desc": "POPITAS MICRO BORG"
                },
                {
                    "net_am": 6.78,
                    "n_unit": 1,
                    "desc": "QUESO CUÑA 400GR"
                },
                {
                    "net_am": 1.82,
                    "n_unit": 1,
                    "desc": "ESPETEC CASA TARRA"
                },
                {
                    "net_am": 3.98,
                    "n_unit": 3,
                    "desc": "JAMON COCIDO ARGAL"
                },
                {
                    "net_am": 1.43,
                    "n_unit": 1,
                    "desc": "PAN SANDWICH 8CEREAL"
                },
                {
                    "net_am": 0.94,
                    "n_unit": 1,
                    "desc": "PAN BIMBO 270GRS"
                },
                {
                    "net_am": 8.7,
                    "n_unit": 1,
                    "desc": "CANDADO COMBINACION"
                },
                {
                    "net_am": 0.1,
                    "n_unit": 2,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T19:20:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.83,
                    "n_unit": 1,
                    "desc": "DESODORANTE DOVE"
                },
                {
                    "net_am": 4.13,
                    "n_unit": 1,
                    "desc": "MANZANA FUJI"
                },
                {
                    "net_am": 4,
                    "n_unit": 1,
                    "desc": "EMPANADA CARNE"
                },
                {
                    "net_am": 3.26,
                    "n_unit": 1,
                    "desc": "TOMATE KUMATO"
                },
                {
                    "net_am": 3.05,
                    "n_unit": 1,
                    "desc": "TOMATE RACIMO"
                },
                {
                    "net_am": 4.4,
                    "n_unit": 1,
                    "desc": "SUMAIA SALGOT PIEZA"
                },
                {
                    "net_am": 4.9,
                    "n_unit": 1,
                    "desc": "LONGANIZA EXTRA"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "WC GEL LEJIA PERFUMA"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "WC GEL 700 ML"
                },
                {
                    "net_am": 8.34,
                    "n_unit": 6,
                    "desc": "LECHE CALCIO ENTER"
                },
                {
                    "net_am": 8.34,
                    "n_unit": 6,
                    "desc": "LECHE DESNT.CALCIO"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "YOGUR VITALINEA X4"
                },
                {
                    "net_am": 1.8,
                    "n_unit": 1,
                    "desc": "ACTIVIA NATURAL 0%"
                },
                {
                    "net_am": 1.79,
                    "n_unit": 1,
                    "desc": "ACTIVIA 0 % MANGO X4"
                },
                {
                    "net_am": 2.05,
                    "n_unit": 1,
                    "desc": "DESODORANTE TULIPAN"
                },
                {
                    "net_am": 1.75,
                    "n_unit": 1,
                    "desc": "FUET DE LA YAYA"
                },
                {
                    "net_am": 5.75,
                    "n_unit": 1,
                    "desc": "GULA NORTE FRESCA"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "CHAMPIÑÓN 300 GR"
                },
                {
                    "net_am": 0.2,
                    "n_unit": 4,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 1.1,
                    "n_unit": 1,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 4.15,
                    "n_unit": 1,
                    "desc": "MAKI SALMON KELLYD"
                },
                {
                    "net_am": 11.15,
                    "n_unit": 1,
                    "desc": "SASHIMI SALMON KEL"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T22:19:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "PIJAMA M/L GEORGE"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "CAMISETA ML NINO"
                },
                {
                    "net_am": 19.98,
                    "n_unit": 2,
                    "desc": "VESTIDO ML VILLELA"
                },
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "PIJAMA NINA"
                },
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "PIJAMA NINA"
                },
                {
                    "net_am": 19.98,
                    "n_unit": 2,
                    "desc": "PIJAMA NINA 3-6"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T14:36:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.66,
                    "n_unit": 1,
                    "desc": "PEPINO ALMERIA"
                },
                {
                    "net_am": 3.22,
                    "n_unit": 1,
                    "desc": "CEREZA"
                },
                {
                    "net_am": 3.53,
                    "n_unit": 1,
                    "desc": "CEREZA"
                },
                {
                    "net_am": 3.59,
                    "n_unit": 1,
                    "desc": "CEREZA"
                },
                {
                    "net_am": 3.47,
                    "n_unit": 1,
                    "desc": "MANDARINA"
                },
                {
                    "net_am": 5.25,
                    "n_unit": 1,
                    "desc": "NARANJA MESA"
                },
                {
                    "net_am": 1.8,
                    "n_unit": 1,
                    "desc": "PIÑA RODAJA"
                },
                {
                    "net_am": 7.72,
                    "n_unit": 1,
                    "desc": "PLÁTANO 1ª BOLSA"
                },
                {
                    "net_am": 2.27,
                    "n_unit": 1,
                    "desc": "ZANAHORIA MINI"
                },
                {
                    "net_am": 4.99,
                    "n_unit": 1,
                    "desc": "BANDA FRUTAS TEMPORA"
                },
                {
                    "net_am": 2.6,
                    "n_unit": 1,
                    "desc": "MINI CROISSANT MANTE"
                },
                {
                    "net_am": 3.46,
                    "n_unit": 1,
                    "desc": "KIMBITOS"
                },
                {
                    "net_am": 7.59,
                    "n_unit": 1,
                    "desc": "BOQUERON EN ACEITE"
                },
                {
                    "net_am": 3.8,
                    "n_unit": 1,
                    "desc": "MINI BABYBEL X 12"
                },
                {
                    "net_am": 1.35,
                    "n_unit": 1,
                    "desc": "CREMA EMENTAL PRESID"
                },
                {
                    "net_am": 13.2,
                    "n_unit": 2,
                    "desc": "BOMBONES MERCI 400"
                },
                {
                    "net_am": 12.53,
                    "n_unit": 1,
                    "desc": "ARIEL POLVO ACTILI"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "SERVILLETAS 30X30CM"
                },
                {
                    "net_am": 5.28,
                    "n_unit": 12,
                    "desc": "GO FONT VELLA 0,5"
                },
                {
                    "net_am": 2.99,
                    "n_unit": 1,
                    "desc": "ACTIVIA 0% NATURAL"
                },
                {
                    "net_am": 2.5,
                    "n_unit": 1,
                    "desc": "TOMATE CHERRY 500GR"
                },
                {
                    "net_am": 2,
                    "n_unit": 1,
                    "desc": "CORAZONES COGOLLOS"
                },
                {
                    "net_am": 1.6,
                    "n_unit": 1,
                    "desc": "QUESO FRESCO BURGO"
                },
                {
                    "net_am": 0.25,
                    "n_unit": 5,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 3.3,
                    "n_unit": 3,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 1.89,
                    "n_unit": 1,
                    "desc": "TOMATE CHERRY CARREF"
                },
                {
                    "net_am": 1.85,
                    "n_unit": 1,
                    "desc": "PIMIENTO TRICOLOR"
                },
                {
                    "net_am": 7.5,
                    "n_unit": 3,
                    "desc": "MORAS TARRINA 125"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T23:19:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.8,
                    "n_unit": 1,
                    "desc": "4 PILAS AA DIGITAL"
                },
                {
                    "net_am": 7.9,
                    "n_unit": 1,
                    "desc": "FLUORESCENTE 36W/84"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "BOMBILLA 120W R7S"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T15:35:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 6,
                    "n_unit": 2,
                    "desc": "TOSTA VARIADA"
                },
                {
                    "net_am": 1.5,
                    "n_unit": 1,
                    "desc": "COCA COLA VR 20"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T19:19:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.19,
                    "n_unit": 1,
                    "desc": "MANDARINA CON HOJA"
                },
                {
                    "net_am": 4.21,
                    "n_unit": 1,
                    "desc": "QUESO MAASDAM TIER"
                },
                {
                    "net_am": 2.85,
                    "n_unit": 1,
                    "desc": "PAPEL COCINA FAMIL"
                },
                {
                    "net_am": 16.95,
                    "n_unit": 1,
                    "desc": "BREKKIES EXCEL 7,5KG"
                },
                {
                    "net_am": 1.8,
                    "n_unit": 1,
                    "desc": "QUESITOS LA VACA Q"
                },
                {
                    "net_am": 0.53,
                    "n_unit": 1,
                    "desc": "CERVEZA AMSTEL LAT"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T13:35:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.95,
                    "n_unit": 1,
                    "desc": "QUESO CABRA FRESCO"
                },
                {
                    "net_am": 1.85,
                    "n_unit": 1,
                    "desc": "PAPEL COCINA 100X2"
                },
                {
                    "net_am": 1.02,
                    "n_unit": 1,
                    "desc": "LAVAVAJILLAS LIQUIDO"
                },
                {
                    "net_am": 4.41,
                    "n_unit": 3,
                    "desc": "BEBIDA ARROZ CARRE"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 3,
                    "desc": "BEBIDA AVENA CARRE"
                },
                {
                    "net_am": 6.12,
                    "n_unit": 12,
                    "desc": "AGUA BEZOYA 1,5 L"
                },
                {
                    "net_am": 1.95,
                    "n_unit": 2,
                    "desc": "GARBANZO ECO 425 GR"
                },
                {
                    "net_am": 1.95,
                    "n_unit": 1,
                    "desc": "ALUBIA BLANCA ECO"
                },
                {
                    "net_am": 4.3,
                    "n_unit": 2,
                    "desc": "LENTEJAS COCIDAS"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T12:35:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 2.07,
                    "n_unit": 1,
                    "desc": "MINI BABYBEL X 6"
                },
                {
                    "net_am": 13.8,
                    "n_unit": 1,
                    "desc": "BOTIN SENORA"
                },
                {
                    "net_am": 13.8,
                    "n_unit": 1,
                    "desc": "BOTIN SENORA"
                },
                {
                    "net_am": 2.21,
                    "n_unit": 2,
                    "desc": "PLANTA TEMPORADA"
                },
                {
                    "net_am": 5.98,
                    "n_unit": 1,
                    "desc": "PACK CEPILLO VITIS"
                },
                {
                    "net_am": 6.07,
                    "n_unit": 1,
                    "desc": "PACK CEPILLO MEDIO"
                },
                {
                    "net_am": 0.36,
                    "n_unit": 1,
                    "desc": "BAGUETTE CARREFOUR"
                },
                {
                    "net_am": 1.21,
                    "n_unit": 2,
                    "desc": "YOGUR PANACHE 2XFR"
                },
                {
                    "net_am": 0.41,
                    "n_unit": 1,
                    "desc": "PAN PISTOLA/BARRA"
                },
                {
                    "net_am": 0.14,
                    "n_unit": 3,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:19:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.79,
                    "n_unit": 1,
                    "desc": "COCA COLA LIGHT 50"
                },
                {
                    "net_am": 0.73,
                    "n_unit": 1,
                    "desc": "MAIZ FRITO BARBACO"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T21:19:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.94,
                    "n_unit": 1,
                    "desc": "JAMON CURADO DESHUES"
                },
                {
                    "net_am": 2.42,
                    "n_unit": 1,
                    "desc": "BACON MOLDEADO AHUMA"
                },
                {
                    "net_am": 3.31,
                    "n_unit": 1,
                    "desc": "PECHUGA DE PAVO"
                },
                {
                    "net_am": 1.51,
                    "n_unit": 1,
                    "desc": "MOZZARELLA ARLA"
                },
                {
                    "net_am": 3.88,
                    "n_unit": 2,
                    "desc": "NATA ESPECIAL COCI"
                },
                {
                    "net_am": 4.2,
                    "n_unit": 2,
                    "desc": "SURTIDO NATILLAS REI"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T19:08:00.000Z",
            "client": 1,
            "items": [
                {
                    "0": "N",
                    "1": "o",
                    "2": "n",
                    "3": "e"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T22:08:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 17.9,
                    "n_unit": 1,
                    "desc": "AGENDA DESCENDATS"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T13:26:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 4,
                    "n_unit": 1,
                    "desc": "ENSALADA CANTÁBRIC"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T21:08:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 5,
                    "n_unit": 1,
                    "desc": "REVISTAS 4% IVA"
                },
                {
                    "net_am": 0.55,
                    "n_unit": 1,
                    "desc": "BARRA RUSTICA"
                },
                {
                    "net_am": 0.92,
                    "n_unit": 1,
                    "desc": "FIDEO Nº2 GALLO 500G"
                },
                {
                    "net_am": 0.93,
                    "n_unit": 1,
                    "desc": "PASTA FIDEO 4 GALLO"
                },
                {
                    "net_am": 1.04,
                    "n_unit": 1,
                    "desc": "SPAGHETTI 3 GALLO"
                },
                {
                    "net_am": 5.98,
                    "n_unit": 1,
                    "desc": "CERVEZA MAHOU CLAS"
                },
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "COLECCIÓN CD"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T21:08:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.79,
                    "n_unit": 1,
                    "desc": "BARRA MEIGA"
                },
                {
                    "net_am": 3.3,
                    "n_unit": 1,
                    "desc": "FILETE PECHUGA POL"
                },
                {
                    "net_am": 1.2,
                    "n_unit": 1,
                    "desc": "ARROZ INTEGRAL VASIT"
                },
                {
                    "net_am": 1.21,
                    "n_unit": 1,
                    "desc": "MOUSSE CHOCOLATE"
                },
                {
                    "net_am": 0.91,
                    "n_unit": 1,
                    "desc": "SALSA SETAS CARREFOU"
                },
                {
                    "net_am": 0.05,
                    "n_unit": 1,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 2.5,
                    "n_unit": 1,
                    "desc": "BLANQUITOS CARREFOUR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:08:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 11.38,
                    "n_unit": 1,
                    "desc": "CERVEZA SAN MIGUEL"
                },
                {
                    "net_am": 10.15,
                    "n_unit": 1,
                    "desc": "CERVEZA MAHOU 5"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T14:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.15,
                    "n_unit": 1,
                    "desc": "ENSALADA CÉSAR"
                },
                {
                    "net_am": 0.68,
                    "n_unit": 1,
                    "desc": "RADICAL FRUTAS BOS"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T13:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 0.85,
                    "n_unit": 1,
                    "desc": "NÉCTAR MELOCOTÓN"
                },
                {
                    "net_am": 1.7,
                    "n_unit": 2,
                    "desc": "NÉCTAR NARANJA/PLA"
                },
                {
                    "net_am": 2.06,
                    "n_unit": 2,
                    "desc": "MAGDALENAS REDONDAS"
                },
                {
                    "net_am": 3.45,
                    "n_unit": 1,
                    "desc": "AZUCAR BOLSA 5 KG"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "YOGUR SABORES CARR"
                },
                {
                    "net_am": 0.1,
                    "n_unit": 2,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 2.02,
                    "n_unit": 2,
                    "desc": "PATATAS LISAS 350 GR"
                },
                {
                    "net_am": 5.35,
                    "n_unit": 1,
                    "desc": "REVUELTO SAN BLAS"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T14:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 6,
                    "n_unit": 2,
                    "desc": "ACCESORIOS COCINA"
                },
                {
                    "net_am": 14.4,
                    "n_unit": 1,
                    "desc": "MANTEL CORAZONES"
                },
                {
                    "net_am": 6.38,
                    "n_unit": 2,
                    "desc": "PACK 2 SERVILLETAS"
                },
                {
                    "net_am": 9.99,
                    "n_unit": 1,
                    "desc": "4 MOLDES EMPLATAR"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T19:07:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.94,
                    "n_unit": 1,
                    "desc": "BACALAO LONCHAS AHUM"
                },
                {
                    "net_am": 1.66,
                    "n_unit": 1,
                    "desc": "MANGO TELESCOPICO"
                },
                {
                    "net_am": 2.75,
                    "n_unit": 1,
                    "desc": "50 PLATOS 22 CM"
                },
                {
                    "net_am": 1.47,
                    "n_unit": 2,
                    "desc": "FREGONA MICROFIBRA"
                },
                {
                    "net_am": 2.21,
                    "n_unit": 1,
                    "desc": "3 BAYETAS MICROFIBRA"
                },
                {
                    "net_am": 2.44,
                    "n_unit": 1,
                    "desc": "ESPUMA AFEITAR"
                },
                {
                    "net_am": 0.92,
                    "n_unit": 1,
                    "desc": "SERVILLETAS 30X30CM"
                },
                {
                    "net_am": 1.36,
                    "n_unit": 1,
                    "desc": "LEJIA CONEJO FLORA"
                },
                {
                    "net_am": 1.66,
                    "n_unit": 1,
                    "desc": "2ESTROPAJOS+ESPONJA"
                },
                {
                    "net_am": 1.83,
                    "n_unit": 1,
                    "desc": "3 BAYETAS SUAVES"
                },
                {
                    "net_am": 3.66,
                    "n_unit": 3,
                    "desc": "JAMON COCIDO 175 GR"
                },
                {
                    "net_am": 0.9,
                    "n_unit": 1,
                    "desc": "VARILLAS PERFUMADA"
                },
                {
                    "net_am": 0.9,
                    "n_unit": 1,
                    "desc": "VARILLAS PERFUMADA"
                },
                {
                    "net_am": 1.79,
                    "n_unit": 1,
                    "desc": "PAN S/CORTEZA 450G"
                },
                {
                    "net_am": 0.09,
                    "n_unit": 2,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 0.69,
                    "n_unit": 1,
                    "desc": "GUANTES FLOCADOS"
                }
            ]
        },
        {
            "mall": 1,
            "date": "2016-01-14T13:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 1.28,
                    "n_unit": 2,
                    "desc": "CERVEZA HEINEKEN"
                },
                {
                    "net_am": 2.93,
                    "n_unit": 1,
                    "desc": "RABAS EMPANADAS"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T20:07:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 7.85,
                    "n_unit": 1,
                    "desc": "ESTOFADO TERNERA"
                },
                {
                    "net_am": 2.53,
                    "n_unit": 1,
                    "desc": "FILETE EMPERADOR"
                },
                {
                    "net_am": 2.7,
                    "n_unit": 1,
                    "desc": "FILETE EMPERADOR"
                },
                {
                    "net_am": 4.25,
                    "n_unit": 1,
                    "desc": "FILETE EMPERADOR"
                },
                {
                    "net_am": 3.75,
                    "n_unit": 1,
                    "desc": "JAMON COCIDO EL POZO"
                },
                {
                    "net_am": 5.95,
                    "n_unit": 1,
                    "desc": "JAMON CURADO LONCHAS"
                },
                {
                    "net_am": 5.07,
                    "n_unit": 3,
                    "desc": "YOGUR SVELTESE DEL"
                },
                {
                    "net_am": 9.95,
                    "n_unit": 1,
                    "desc": "CEPILLO CERAMICO"
                },
                {
                    "net_am": 6.5,
                    "n_unit": 1,
                    "desc": "CORRECTOR 2+1 SIDE"
                },
                {
                    "net_am": 3.9,
                    "n_unit": 1,
                    "desc": "PAQUETE 500 HOJAS A4"
                },
                {
                    "net_am": 1.44,
                    "n_unit": 1,
                    "desc": "BOCADITOS CACAO 500"
                },
                {
                    "net_am": 5.3,
                    "n_unit": 2,
                    "desc": "KELLOGG´S CHOCOS"
                },
                {
                    "net_am": 4.4,
                    "n_unit": 1,
                    "desc": "NOCILLA 2 SABORES"
                },
                {
                    "net_am": 2.9,
                    "n_unit": 3,
                    "desc": "SPAGHETTINI HUEVO"
                },
                {
                    "net_am": 9.78,
                    "n_unit": 3,
                    "desc": "ATÚN CLARO CALVO"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "CAFE SOLUBLE NESCA"
                },
                {
                    "net_am": 2.65,
                    "n_unit": 1,
                    "desc": "CEREALES CHOCOKRIS"
                },
                {
                    "net_am": 3.33,
                    "n_unit": 3,
                    "desc": "NATA LIQUIDA COCIN"
                },
                {
                    "net_am": 2.3,
                    "n_unit": 1,
                    "desc": "AVECREM POLLO B/SAL"
                },
                {
                    "net_am": 4.3,
                    "n_unit": 2,
                    "desc": "GUISANTES EXTRAFIN"
                },
                {
                    "net_am": 1.99,
                    "n_unit": 1,
                    "desc": "MANDARINA 1,5 KG"
                },
                {
                    "net_am": 3.6,
                    "n_unit": 6,
                    "desc": "LECHE SEMI. CARREF"
                },
                {
                    "net_am": 3.8,
                    "n_unit": 1,
                    "desc": "NARANJA ZUMO CARRE"
                },
                {
                    "net_am": 1.35,
                    "n_unit": 1,
                    "desc": "HUEVOS L 12 CARREF"
                },
                {
                    "net_am": 2.16,
                    "n_unit": 2,
                    "desc": "ESPINACAS AL NATUR"
                },
                {
                    "net_am": 1.1,
                    "n_unit": 1,
                    "desc": "PANECILLOS SURTIDOS"
                },
                {
                    "net_am": 1.14,
                    "n_unit": 1,
                    "desc": "POSTRE TURRON 2X125G"
                },
                {
                    "net_am": 1.14,
                    "n_unit": 2,
                    "desc": "POSTRE GALLETA 2X125"
                },
                {
                    "net_am": 2,
                    "n_unit": 1,
                    "desc": "FRAMBUESA TARRINA"
                },
                {
                    "net_am": 1.82,
                    "n_unit": 1,
                    "desc": "CHOCOLATE BLANCO"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T12:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 3.52,
                    "n_unit": 1,
                    "desc": "KAKI"
                },
                {
                    "net_am": 2.5,
                    "n_unit": 1,
                    "desc": "PLÁTANO CANARIAS"
                },
                {
                    "net_am": 3.89,
                    "n_unit": 1,
                    "desc": "PECHUGA PAVO NAT.ASA"
                },
                {
                    "net_am": 2.15,
                    "n_unit": 1,
                    "desc": "MORCON CHORIZO EXTRA"
                },
                {
                    "net_am": 3.74,
                    "n_unit": 1,
                    "desc": "COSTILLA TIRA CERDO"
                },
                {
                    "net_am": 3.34,
                    "n_unit": 1,
                    "desc": "AGUACATE PREMIUM"
                },
                {
                    "net_am": 3.57,
                    "n_unit": 1,
                    "desc": "FILETES DE CONTRAMUS"
                },
                {
                    "net_am": 3.84,
                    "n_unit": 1,
                    "desc": "FILETES DE CONTRAMUS"
                },
                {
                    "net_am": 3.95,
                    "n_unit": 1,
                    "desc": "FILETES DE CONTRAMUS"
                },
                {
                    "net_am": 6.56,
                    "n_unit": 1,
                    "desc": "LOMO CERDO"
                },
                {
                    "net_am": 4.82,
                    "n_unit": 1,
                    "desc": "CERDO IBÉRICO PRES"
                },
                {
                    "net_am": 33,
                    "n_unit": 1,
                    "desc": "PAÑAL DODOT AZUL T4"
                },
                {
                    "net_am": 3.39,
                    "n_unit": 1,
                    "desc": "CEREAL CHOCOLATE&NUE"
                },
                {
                    "net_am": 4.9,
                    "n_unit": 2,
                    "desc": "FUSILLI BUCATI 500GR"
                },
                {
                    "net_am": 1.81,
                    "n_unit": 1,
                    "desc": "PAN S/CORTEZA ENRI"
                },
                {
                    "net_am": 1.84,
                    "n_unit": 2,
                    "desc": "FIDEO Nº2 GALLO 500G"
                },
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "LECHE ENTERA PASCU"
                },
                {
                    "net_am": 5.1,
                    "n_unit": 6,
                    "desc": "LECHE ENTERA UPERI"
                },
                {
                    "net_am": 2.13,
                    "n_unit": 1,
                    "desc": "GALLETAS DINOSAURU"
                },
                {
                    "net_am": 1.8,
                    "n_unit": 1,
                    "desc": "QUESITOS LA VACA Q"
                },
                {
                    "net_am": 2.99,
                    "n_unit": 1,
                    "desc": "QUESO CABRALES 100GR"
                },
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "DANONINO FRESAS 6"
                },
                {
                    "net_am": 6.75,
                    "n_unit": 1,
                    "desc": "QUESO TIERNO VENTERO"
                },
                {
                    "net_am": 15.2,
                    "n_unit": 4,
                    "desc": "VINO TORO MURUVE J"
                },
                {
                    "net_am": 2.7,
                    "n_unit": 2,
                    "desc": "ENDIVIAS BANDEJA"
                },
                {
                    "net_am": 5.98,
                    "n_unit": 2,
                    "desc": "SETAS SHII-TAKE"
                },
                {
                    "net_am": 4.09,
                    "n_unit": 1,
                    "desc": "YOGUR NATURAL GRAN"
                },
                {
                    "net_am": 2,
                    "n_unit": 2,
                    "desc": "SETAS 200 GR BANDE"
                },
                {
                    "net_am": 9.1,
                    "n_unit": 2,
                    "desc": "CAFE SOLUBLE COLOMBI"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "SOBAOS  PASIEGOS"
                },
                {
                    "net_am": 0.2,
                    "n_unit": 4,
                    "desc": "BOLSA CARREFOUR"
                },
                {
                    "net_am": 2.99,
                    "n_unit": 1,
                    "desc": "HUEVOS CAMPEROS 12"
                }
            ]
        },
        {
            "mall": 2,
            "date": "2016-01-14T16:25:00.000Z",
            "client": 1,
            "items": [
                {
                    "net_am": 4,
                    "n_unit": 1,
                    "desc": "EMPANADA ATUN 19X2"
                },
                {
                    "net_am": 2.01,
                    "n_unit": 1,
                    "desc": "LIMON"
                },
                {
                    "net_am": 2.73,
                    "n_unit": 1,
                    "desc": "PLÁTANO BIO FLOWPA"
                },
                {
                    "net_am": 2,
                    "n_unit": 1,
                    "desc": "JAMON COCIDO 190GR"
                },
                {
                    "net_am": 12.16,
                    "n_unit": 1,
                    "desc": "SOLOMILLO DE AÑOJO"
                },
                {
                    "net_am": 1.66,
                    "n_unit": 2,
                    "desc": "TOMATE FRITO CARRE"
                },
                {
                    "net_am": 0.67,
                    "n_unit": 1,
                    "desc": "GUISANTES FINOS 250"
                },
                {
                    "net_am": 3.1,
                    "n_unit": 1,
                    "desc": "PIZZA BARBACOA 350 G"
                },
                {
                    "net_am": 0,
                    "n_unit": 1,
                    "desc": "PIZZA QUATRE FROMA"
                },
                {
                    "net_am": 3.1,
                    "n_unit": 1,
                    "desc": "PIZZA PROSCIUTTO"
                },
                {
                    "net_am": 4.3,
                    "n_unit": 2,
                    "desc": "PEDIGREE DENTASTIX"
                },
                {
                    "net_am": 5.79,
                    "n_unit": 1,
                    "desc": "ACEITE OLIVA CARBO"
                },
                {
                    "net_am": 4.1,
                    "n_unit": 1,
                    "desc": "CAFE MOLINO NATURAL"
                },
                {
                    "net_am": 4.23,
                    "n_unit": 3,
                    "desc": "BEBIDA SOJA C/CHOC"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "PECHUGA DE POLLO 90"
                },
                {
                    "net_am": 1,
                    "n_unit": 1,
                    "desc": "PECHUGA PAVO CUIDAT+"
                },
                {
                    "net_am": 4.95,
                    "n_unit": 1,
                    "desc": "ANACARDOS FRITOS"
                },
                {
                    "net_am": 2.4,
                    "n_unit": 1,
                    "desc": "ALCACHOFA NATURAL"
                },
                {
                    "net_am": 2.34,
                    "n_unit": 2,
                    "desc": "HUEVO COCIDO 1/2 DOC"
                },
                {
                    "net_am": 3.86,
                    "n_unit": 2,
                    "desc": "PANECILLOS INTEGRA"
                },
                {
                    "net_am": 0.97,
                    "n_unit": 1,
                    "desc": "JUDIAS VERDES CARR"
                },
                {
                    "net_am": 3.8,
                    "n_unit": 1,
                    "desc": "NARANJA ZUMO CARRE"
                },
                {
                    "net_am": 3,
                    "n_unit": 1,
                    "desc": "CARNE PICADA VACUN"
                },
                {
                    "net_am": 5.99,
                    "n_unit": 1,
                    "desc": "PAELLA MIXTA 1 KG"
                },
                {
                    "net_am": 1.98,
                    "n_unit": 1,
                    "desc": "MANDARINA MALLA 2"
                }
            ]
        }
    ];

    return {
        getApiKey: function () {
            return vm.apiKey;
        },
        getUserInfo: function(){
            if (i > vm.users.length) i = 0;
            return vm.users[i];
        },
        getSelectedUserInfo: function(){
            return vm.users[vm.selectedUser-1];
        },
        getCfData: function(i){
            // hardcode to only accept i=1 ivan
            if(i==1) return vm.cfdat;
            else return [];
        },
        setUser: function(i){
            vm.selectedUser = i;
        }
    };

}

function dashboard(id, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.low+d.freq.mid+d.freq.high;});

    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 500 - hGDim.l - hGDim.r,
            hGDim.h = 300 - hGDim.t - hGDim.b;

        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
            .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");

        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD){
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        }

        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }

    // calculate total frequency by segment for all state.
    var tF = ['low','mid','high'].map(function(d){
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))};
    });

    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}
var freqData=[
    {State:'AL',freq:{low:4786, mid:1319, high:249}}
    ,{State:'AZ',freq:{low:1101, mid:412, high:674}}
    ,{State:'CT',freq:{low:932, mid:2149, high:418}}
    ,{State:'DE',freq:{low:832, mid:1152, high:1862}}
    ,{State:'FL',freq:{low:4481, mid:3304, high:948}}
    ,{State:'GA',freq:{low:1619, mid:167, high:1063}}
    ,{State:'IA',freq:{low:1819, mid:247, high:1203}}
    ,{State:'IL',freq:{low:4498, mid:3852, high:942}}
    ,{State:'IN',freq:{low:797, mid:1849, high:1534}}
    ,{State:'KS',freq:{low:162, mid:379, high:471}}
];

