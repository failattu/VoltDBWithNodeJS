var cluster = require('cluster');
var restify = require("restify");
var workers = require('os').cpus().length
var VoltClient = require('voltjs/lib/client')
, VoltConstants = require('voltjs/lib/voltconstants');
var VoltProcedure = require('voltjs/lib/query');
var VoltQuery = require('voltjs/lib/query');
var cli = require('cli');
var util = require('util');
var VoltConfiguration = require('voltjs/lib/configuration');

//initializing names
var names =["Isadora Vang","Baker Holman","McKenzie Soto","Ivan Vega","Cheyenne Ware","Tanek Bowman","Hop Bender","Hilary Thompson","Quinlan Ortega","David Salas","Liberty Sloan","Regan Mcdowell","Quon Frazier","Cheryl Oliver","Tucker Frederick","Beverly Franco","Alyssa Vargas","Sarah Conrad","Samuel Hardy","Carol Thomas","Fuller Reyes","Adele Lloyd","Tobias Wagner","Pearl Kerr",
"Veda Blair","Kuame Weeks","Porter Gross","Quemby Velazquez","Timothy Romero","Carolyn Daugherty","Shellie Doyle","Britanni Howe","Sebastian Delgado","Walker Cruz","Hanna Coleman","Robert Sosa","Felix Burke","Abraham Craig","Gavin Crawford","Petra Santos","Andrew Page","Zane Evans","Kennan Washington","Vivien Tillman","Alden Moses","Kelsie Merrill","Anika Deanname","Isadora Vang","Baker Holman",
"McKenzie Soto","Ivan Vega","Cheyenne Ware","Tanek Bowman","Hop Bender","Hilary Thompson","Quinlan Ortega","David Salas","Liberty Sloan","Regan Mcdowell","Quon Frazier","Cheryl Oliver","Tucker Frederick","Beverly Franco","Alyssa Vargas","Sarah Conrad","Samuel Hardy","Carol Thomas","Fuller Reyes","Adele Lloyd","Tobias Wagner","Pearl Kerr","Veda Blair","Kuame Weeks","Porter Gross",
"Quemby Velazquez","Timothy Romero","Carolyn Daugherty","Shellie Doyle","Britanni Howe","Sebastian Delgado","Walker Cruz","Hanna Coleman","Robert Sosa","Felix Burke","Abraham Craig","Gavin Crawford","Petra Santos","Andrew Page","Zane Evans","Kennan Washington","Vivien Tillman","Alden Moses","Kelsie Merrill","Anika Dean","Scarlet Joseph","Cameran Beasley","Ashely Mayo","Tate Knowles",
"Rinah Perez","Whoopi Malone","Wanda Moore","Fay Vaughan","Rachel Reed","Keelie Chambers","Regina Mccullough","Ali Boyle","Sheila Crawford","Ocean Byrd","Ronan Dickerson","Malcolm Hess","Micah Lopez","Iola Roberson","Selma Cole","Genevieve Tyson","Zia Campos","Lael Kennedy","Lane Curtis","Montana Spears","Christopher Winters","Tashya Olsen","Wayne Lindsay","Mona Franks",
"Hoyt Shields","Shad Conway","Adara Daniel","Macon Conway","Carson Todd","Hedda Wilkins","Teegan Duncan","Jared Newman","Katell Newman","Paki Matthews","Chloe Burnett","Tatyana Jones","Breanna Hebert","Ivana Mcknight","Libby Dixon","Kirsten Donovan","Sigourney Zimmerman","Nola Hickman","Marcia Mercado","Bruno Farley","Ivana Robles","Cameron Mclean","Hermione Thornton","Trevor Ingram",
"Allistair MayerScarlet Joseph","Cameran Beasley","Ashely Mayo","Tate Knowles","Rinah Perez","Whoopi Malone","Wanda Moore","Fay Vaughan","Rachel Reed","Keelie Chambers","Regina Mccullough","Ali Boyle","Sheila Crawford","Ocean Byrd","Ronan Dickerson","Malcolm Hess","Micah Lopez","Iola Roberson","Selma Cole","Genevieve Tyson","Zia Campos","Lael Kennedy","Lane Curtis","Montana Spears",
"Christopher Winters","Tashya Olsen","Wayne Lindsay","Mona Franks","Hoyt Shields","Shad Conway","Adara Daniel","Macon Conway","Carson Todd","Hedda Wilkins","Teegan Duncan","Jared Newman","Katell Newman","Paki Matthews","Chloe Burnett","Tatyana Jones","Breanna Hebert","Ivana Mcknight","Libby Dixon","Kirsten Donovan","Sigourney Zimmerman","Nola Hickman","Marcia Mercado","Bruno Farley",
"Ivana Robles","Cameron Mclean","Hermione Thornton","Trevor Ingram","Allistair Mayer","Edward Reeves","Vladimir Wallace","Kadeem Hays","Amery Vaughn","Harding Kerr","Julian Anderson","Penelope Shaw","Bethany Combs","Alfreda Trujillo","Reece Carroll","Derek Burnett","Alvin Schroeder","Evan Bruce","Hop Britt","Savannah Wilder","Justine Wise","Angela Strong","Tatyana Trevino","Quyn Anderson",
"Hiram Ferrell","Howard Dyer","Amethyst Hutchinson","Jane Brennan","Quemby Holloway","Buckminster Clarke","Brock Ward","Xavier Wright","Lee Gamble","Drew Reynolds","Harrison Bryant","Celeste Becker","Victoria Alston","Audrey Finch","Rahim Woods","Gage Munoz","Ahmed Kane","Gregory Roach","Channing Talley","Tashya Maddox","Dillon Fernandez","Zenaida Reynolds","Wynter Pierce","Angela Rivers",
"Noel Casey","Riley Bender","Samuel Oneill","Dolan Cummings","Mara Lindsey","Chava Patel","Adam Rivas","Lana Stephens","Yen Blankenship","Christian Hawkins","Whoopi Collins","Ulric Dunlap","Abraham Price","Faith Berg","Walker Scott","Byron Hampton","Carol Hendrix","Reed Weaver","Chelsea Mendoza","Roth Madden","Elijah Lawrence","Jason Thompson","Autumn Doyle","Lewis Odom","Zorita Bowen",
"Damian Savage","Eve Mclean","Dana Hess","Leslie Guerra","Vladimir Hayes","Thor Langley","Rafael Hobbs","Joelle Ratliff","Melinda Mcintyre","Rudyard Kennedy","Blake Hoffman","Teegan Parker","Joshua Dale","Judah Cannon","Sheila Hurst","Shelly Mendez","Meghan Frost","Lillian Holloway","Eve Baldwin","Eve Cummings","Alea Horn","Regina Le","Charity Walker","Amanda Solomon","Adrian Sykes",
"Kenyon Dominguez","Brett Crawford","Beatrice White","Patrick Byers","David Berg","Nicholas Le","Marah Avery"];

var port = 8080;
var IP = "127.0.0.1";
var firstrun = false;
if (process.argc >= 2) {
  port = parseInt(process.argv[2]); // Port can be also passed as an argument, this overrides config...
}

var cfg = new VoltConfiguration();
cfg.host = "192.168.30.178";
cfg.port = 21212;

var createUser = new VoltProcedure('CreateUser', ['int', 'string']);
var createEvent = new VoltProcedure('CreateEvent', ['int', 'int']);
var getInfo = new VoltProcedure('GetInfo', ['int', 'int']);
var configs = []
configs.push(cfg);
var client = new VoltClient(configs);

client.connect(function startup(results,event,results) {
  console.log('Node up');
  console.log(connectionStats());
  dbinit();
  //voltInit();
}, function loginError(results) {
  console.console.log();('Node up (on Error)');
  //voltInit();
});

function InsertInfo(id, name){
  var query = createUser.getQuery();
  query.setParameters([id, name]);
  client.callProcedure(query, function createUser(code, event, results) {
    //console.log(code);
    //console.log('Added one row');
  });
}
function CreateEvent(uid, eventId){
  var query = createEvent.getQuery();
  query.setParameters([uid, eventId]);
  client.callProcedure(query, function createUser(code, event, results) {
    //console.log(code);
    //console.log('Added one row');
  });
}
function GetInfo(uid, eventId){
  var query = getInfo.getQuery();
  query.setParameters([uid, eventId]);
  client.callProcedure(query, function createUser(code, event, results) {
    var val =results.table[0][0];
    console.log('User has '  + val[''] + " events");
  });
}
var server = restify.createServer({
	name: "Very Simple VoltDB Server",
	version: "0.0.1",
	formatters: {
		"application/hal+json": function (req, res, body) {
			return res.formatters["application/json"](req, res, body);
		}
	}
});

function dbinit()
{
  if(firstrun == true)
  {
  var arrayLength = names.length;
  for(var i = 0; i < arrayLength; i++){
    InsertInfo(i,names[i]);
    CreateEvent(i,0);
    CreateEvent(i,1);
    CreateEvent(i,2);
    CreateEvent(i,3);
    CreateEvent(i,4);
    console.log("Inserted user id " + i +" with name " + names[i]);
  }
}
	//activate this to activate horrible moments.
  //BenchmarkScript();
}
var RESOURCES = Object.freeze({
	INITIAL: "/"
});

server.get(RESOURCES.INITIAL, function (req, res) {
	var response = "...";
  runTest();
	res.contentType = "application/hal+json";
	res.send(response);
});

function getRand(max) {
  return Math.floor(Math.random() * max);
}
function connectionStats() {
  client.connectionStats();
}
function runTest(){
  var eventID =  getRand(4);
  var userID = getRand(299);
  GetInfo(userID,eventID);
}
function BenchmarkScript()
{
  var hz, period, startTime = new Date, runs = 0;
  do {
  runTest();
  runs++;
  totalTime = new Date - startTime;
} while (totalTime < 100000);
hz = (runs * 1000) / totalTime;
console.log(hz);
}
if (cluster.isMaster) {

    // Fork workers
    for (var i = 0; i < workers; i++) {
        cluster.fork();
        console.log(i + " worker started");
        var firstrun = true;
    }

    cluster.on('exit', function (worker, code, signal) {
    	console.log('Worker ' + worker.process.pid + ' died');
    	console.log('Spawining new worker...');
    	cluster.fork();
    });
}
else {
    server.listen(port);
}
