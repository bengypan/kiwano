"use strict";

var kiwanoApp = angular.module('KiwanoApp', ['ionic', 'firebase'])

.value('kiwanoFBUrl', 'https://kiwano.firebaseio.com')

.value('kiwanoAPIUrl', '/api')

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('tabs', {
			url: "/tab",
			abstract: true,
			templateUrl: "tabs.html", controller: 'MainCtrl'
		})
		.state('tabs.home', {
			url: "/home",
			views: {
				'home-tab': {
					templateUrl: "home.html", controller: 'HomeCtrl'
				}
			}
		})
		.state('tabs.qlist', {
			url: "/qlist",
			views: {
				'question-tab': {
					templateUrl: "question-list.html", controller: 'QuestionListCtrl'
				}
			}
		})
		.state('tabs.question', {
			url: "/question/:questionId",
			views: {
				'question-tab': {
					templateUrl: "question-details.html", controller: 'QuestionDetailsCtrl'
				}
			}
		})
		.state('tabs.ask', {
			url: "/ask",
			views: {
				'question-tab': {
					templateUrl: "ask.html", controller: 'AskCtrl'
				}
			}
		})
		.state('tabs.rlist', {
			url: "/rlist",
			views: {
				'request-tab': {
					templateUrl: "request-list.html", controller: 'RequestListCtrl'
				}
			}
		})
		.state('tabs.request', {
			url: "/request/:requestId",
			views: {
				'request-tab': {
					templateUrl: "request-details-edit.html", controller: 'RequestDetailsEditCtrl'
				}
			}
		})
		.state('tabs.requestview', {
			url: "/request/:requestId/view",
			views: {
				'request-tab': {
					templateUrl: "request-details-view.html", controller: 'RequestDetailsViewCtrl'
				}
			}
		})
		.state('tabs.about', {
			url: "/about",
			views: {
				'about-tab': {
					templateUrl: "about.html"
				}
			}
		})
		;
		$urlRouterProvider.otherwise("/tab/home");
})

.factory('KiwanoFB', ['$firebase', 'kiwanoFBUrl', 'kiwanoUserId', 
	function($firebase, kiwanoFBUrl, kiwanoUserId) {
		return {
			getUserQuestions : function(uid) {
				uid = uid || kiwanoUserId;
				return $firebase(new Firebase(kiwanoFBUrl + '/' + uid + '/questions'));
			},

			getUserQuestion : function(qid, uid) {
				uid = uid || kiwanoUserId;
				return $firebase(new Firebase(kiwanoFBUrl + '/' + uid + '/questions/' + qid));
			},

			getUserQuestionReplies : function(qid, uid) {
				uid = uid || kiwanoUserId;
				return $firebase(new Firebase(kiwanoFBUrl + '/' + uid + '/questions/' + qid + '/replies'));
			},

			getUserRequests : function(uid) {
				uid = uid || kiwanoUserId;
				return $firebase(new Firebase(kiwanoFBUrl + '/' + uid + '/requests'));
			},

			getUserRequest : function(rid, uid) {
				uid = uid || kiwanoUserId;
				return $firebase(new Firebase(kiwanoFBUrl + '/' + uid + '/requests/' + rid));
			},
		}
	}])

.factory('HMAPIService', ['$http', 'kiwanoAPIUrl', function($http, kiwanoAPIUrl) {
	return {
		getProfile : function(_sucHandler, _errHandler) {
			var url = kiwanoAPIUrl + '?name=prof';
			$http.get(url)
			.success(function(data, status, headers, config) {
				if (status === 200) {
					_sucHandler(data);
				} else {
					_errHandler("Failed to get data from server, status: " + status);
				}
			}).error(function(data, status, headers, config) {
				_errHandler("Failed to get data from server, status: " + status);
			});
		},

		getConnections : function(_limit, _sucHandler, _errHandler) {
			var url = kiwanoAPIUrl + '?name=conn';
			$http.get(url)
			.success(function(data, status, headers, config) {
				if (status === 200) {
					if (data.values.length > _limit) {
						data.values.splice(_limit);
					}
					_sucHandler(data.values);
				} else {
					_errHandler("Failed to get data from server, status: " + status);
				}
			}).error(function(data, status, headers, config) {
				_errHandler("Failed to get data from server, status: " + status);
			});
		}
	}
}])

/**
 * A super simple text service to remove stopwords
 */
.factory('TextService', 
	function() {

		return {
			removeStopWords : function(str) {
				str = str.toLowerCase();

				// first remove all the punctuations
				// str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
				// str = str.replace(/\s{2,}/g," ");

				return StopWords.filterIO(str);
			},

			matchTags : function(tokens, tags) {
				var score = 0;
				angular.forEach(tokens, function(v, k) {
					if (tags.indexOf(v) !== -1) {
						score++;
					}
				});
				return score;
			}
		}
	})

.factory('SettingsService', 
	function() {
		var set = function(_key, _val) { localStorage[_key] = _val; },
			get = function(_key) { return localStorage[_key]; };
	
		return {
			uid : function(_uid) {
				if (_uid !== undefined) {
					return set("UID", _uid);
				} else return get("UID");
			},
	
			uprof : function(_prof) {
				if (_prof !== undefined) {
					if ("string" === typeof _prof) {
						return set("UPROF", _prof);
					} else {
						return set("UPROF", JSON.stringify(_prof));
					}
				} else {
					return JSON.parse(get("UPROF"));
				}
			}
		}
	})

.factory('DBService', 
	function() {
		var maxSize = 1000000;
		var db = {};
	
		return {
			/**
			 * Open database
			 * @return true on success and false on failures or exceptions
			 */
			init : function(_sucHandler, _errHandler) {
				try {
					if (!window.openDatabase) {
						console.log('Databases are not supported in this browser.');
						if (_errHandler != undefined) {
							_errHandler();
						}
						return false;
					} else {
						db = openDatabase('KiwanoDB', '1.0', 'KiwanoDB', maxSize);
						if (_sucHandler != undefined) {
							_sucHandler();
						}
						return true;
					}
				} catch(e) {
					console.log("Exception: " + e + ".");
					if (_errHandler != undefined) {
						_errHandler();
					}
					return false;
				}
			},
	
			/**
			 * Execute SQL
			 * @param _sql the sql statement
			 * @param _values an array of value to be bound to the sql statement
			 * @param _sucHandler the handler on success
			 * @param _errHandler the hanlder on failures
			 * @return true on success and false on failures or exceptions
			 */
			exec : function(_sql, _values, _sucHandler, _errHandler) {
				var sucHandler = function(txn, res) {
					_sucHandler();
				}
	
				var errHandler = function(txn, error) {
					var errMsg = "Error: " + error.code + ", " + error.message;
					_errHandler(errMsg);
				}
	
				try {
					db.transaction(function(txn) { txn.executeSql(_sql, _values, sucHandler, errHandler); });	
					return true;
				} catch (e) {
					console.log("Exception: " + e + ".");
					return false;
				}
			},
	
			/**
			 * Run query agains database
			 * @param _sql the sql statement
			 * @param _values an array of the values to be bound to the sql
			 * @param _resHandler the result handler, taking an array as argument
			 * @param _errHandler the error handler
			 * @return true on success and false on failures or exceptions
			 */
			query : function(_sql, _values, _resHandler, _errHandler) {
				var results = [];
				var sucHandler = function(txn, res) {
					for (var i = 0; i < res.rows.length; i++) {
						results.push(res.rows.item(i));
					}
					_resHandler(results);
				};
	
				var errHandler = function(txn, error) {
					var errMsg = "Error: " + error.code + ", " + error.message;
					_errHandler(errMsg);
				}
	
				try {
					db.transaction(function(txn) {
						txn.executeSql(_sql, _values, sucHandler, errHandler);
						return true;
					});
				} catch (e) {
					console.log("Exception: " + e + ".");
					return false;
				}
			}
		}
	})

/**
 * The data access services to access the local connections table
 */
.factory('ConnectionsService', ['DBService', 'TextService',
	function(DBService, TextService) {
		var connections = {};
		var tname = "CONN";
		var cached = false;
		var populationStatus = {};
	
		return {
			/**
			 * Initialize the local db table for connections 
			 */
			init : function(_handler) {
				var sql = 'CREATE TABLE IF NOT EXISTS ' + tname + ' (uid TEXT NOT NULL PRIMARY KEY, first_name TEXT, last_name TEXT, headline TEXT, tags TEXT, pic_url TEXT);';
				return DBService.exec(sql, [], function() {
						console.log("Table " + tname + " initialized.");
						_handler();
					}, function(errMsg) {
						console.log("Table " + tname + " initiation failed. " + errMsg);
					});
			},
	
			/**
			 * Reset the local db table for categories
			 */
			reset : function(_handler) {
				var self = this;
				var sql = 'DROP TABLE IF EXISTS ' + tname;
				return DBService.exec(sql, [], function() {
						console.log("Table " + tname + " dropped.");
						self.init(_handler);
					}, function() {
						console.log("Table " + tname + " reset failed. " + errMsg);
					});
			},
	
			popDone : function() {
				return (populationStatus.size == populationStatus.scount + populationStatus.ecount)
			},
	
			/**
			 * Populate the downloaded category data into the local db table
			 */
			populate : function(_cdata) {
				populationStatus = {
					size : _cdata.length,
					scount : 0,
					ecount : 0
				};
	
				angular.forEach(_cdata, function(conn, k) {
					conn.tags = TextService.removeStopWords(conn.firstName + " " + conn.lastName + " " + conn.headline).join(",");
					DBService.exec(
						"REPLACE INTO " + tname + " (uid, first_name, last_name, headline, pic_url, tags) values (?,?,?,?,?,?);",
						[
							conn.id,
							conn.firstName ? conn.firstName : '',
							conn.lastName ? conn.lastName : '',
							conn.headline ? conn.headline : '',
							conn.pictureUrl ? conn.pictureUrl : '',
							conn.tags
						], 
						function() {
							populationStatus.scount++;
							console.log("Added entry to table " + tname + ".");
						}, 
						function(errMsg) {
							populationStatus.ecount++;
							console.log("Failed to add entry to table " + tname + ". " + errMsg);
						});
				});
				cached = false;
			},
	
			getAll : function(_sucHandler, _errHandler) {
				if (false == cached) {
					DBService.query(
						"SELECT * FROM " + tname, [],
						function(data) {
							connections = data;
							cached = true;
							_sucHandler(connections);
						},
						function(errMsg) {
							_errHandler("Failed to get data. " + errMsg );
						});
				} else {
					// return the previous loaded data to client
					_sucHandler(connections);
				}
			},
		}
	}])

.controller('MainCtrl', ['$scope', 'DBService', 'ConnectionsService',
	function($scope, DBService, ConnectionsService) {
		DBService.init(function() {
			ConnectionsService.init(function() {
			});
		});
	}])

.controller('HomeCtrl', ['$scope', 'HMAPIService', 'SettingsService', 'ConnectionsService', 'kiwanoUserId',
	function($scope, HMAPIService, SettingsService, ConnectionsService, kiwanoUserId) {
		$scope.prof = {
			pic_url : '/img/ghost_profile_img.png'
		};

		// first to check if we aleady have this user's info
		// no need to get the data from remote server if we
		// already have it
		if (SettingsService.uid() === kiwanoUserId) {
			$scope.prof = SettingsService.uprof();
		} else {
			SettingsService.uid(null);

			HMAPIService.getProfile(
				function(_data) {
					var userProfile = {
						uid : _data.id,
						first_name : _data.firstName,
						last_name : _data.lastName,
						headline : _data.headline,
						pic_url : _data.pictureUrl || '/img/ghost_profile_img.png'
					}

					$scope.prof = userProfile;

					// save the profile info locally
					SettingsService.uid(kiwanoUserId);
					SettingsService.uprof(userProfile);
				},
				function(errMsg) {
					console.log(errMsg);
				}
			);

			// saving the user's connections to local database
			// TODO: add checking for result of population
			ConnectionsService.reset(function() {
				HMAPIService.getConnections(
					999,
					function(_data) {
						ConnectionsService.populate(_data);
					},
					function(_errMsg) {
						console.log(_errMsg);
					}
				);
			});
		}

		var logout = function() {
			SettingsService.uid(null);
			ConnectionsService.reset(function() {});
			window.location = '/?login=landing';
		}
	}])

.controller('QuestionListCtrl', ['$scope', 'KiwanoFB', 
	function($scope, KiwanoFB){
		$scope.questions = KiwanoFB.getUserQuestions();

		$scope.questions.$on("child_added", function(snapshot) {
			$scope.qexist = true;
		});
	}])

.controller('QuestionDetailsCtrl', ['$scope', '$stateParams', 'KiwanoFB',
	function($scope, $stateParams, KiwanoFB) {
		$scope.question = KiwanoFB.getUserQuestion($stateParams.questionId);
	}])

.controller('AskCtrl', ['$scope', '$state', 'ConnectionsService', 'TextService', 'SettingsService', 'KiwanoFB',
	function($scope, $state, ConnectionsService, TextService, SettingsService, KiwanoFB) {
		var REC_LIMIT = 5;

		$scope.recs = [];
		$scope.selectedUsers = {};

		$scope.change = function(val) {
			var tokens = TextService.removeStopWords(val);
			ConnectionsService.getAll(
				function(_data) {
					$scope.recs.splice(0);
					var count = 0;
					angular.forEach(_data, function(v, k) {
						var matchScore = TextService.matchTags(tokens, v.tags);
						if (matchScore > 0) {
							if (count++ < REC_LIMIT) {
								$scope.recs.push({
									uid : v.uid,
									first_name : v.first_name,
									last_name : v.last_name,
									headline : v.headline,
									pic_url : v.pic_url || '/img/ghost_profile_img.png',
									score : matchScore
								});
							}
						}
					});
					$scope.recs.sort(function(a, b) {return b.score - a.score; });
				},
				function(errMsg) {
					console.log(errMsg);
				});
		},

		$scope.more = function() {
			ConnectionsService.getAll(
				function(_data) {
					$scope.recs.splice(0);
					angular.forEach(_data, function(v, k) {
						$scope.recs.push({
							uid : v.uid,
							first_name : v.first_name,
							last_name : v.last_name,
							headline : v.headline,
							pic_url : v.pic_url || '/img/ghost_profile_img.png'
						});
					});
				},
				function(errMsg) {
					console.log(errMsg);
				});
		},

		$scope.submit = function(val) {
			var d = new Date();
			var dateStr = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

			var questions = KiwanoFB.getUserQuestions();

			var prevName = null;
			questions.$on("child_added", function(snapshot) {
				if (snapshot.snapshot.name === prevName) {
			var userProfile = SettingsService.uprof();
			angular.forEach($scope.selectedUsers, function(v, k) {
				if (v) {
					var requestEntry = {
						question : val,
						status : 'P',
						date : dateStr,
								from : {
									uid : userProfile.uid,
									name : userProfile.first_name + " " + userProfile.last_name,
									qid : prevName}
					}
					KiwanoFB.getUserRequests(k).$add(requestEntry);
				}
			});

				} else {
					prevName = snapshot.snapshot.name;
				}
			});

			var questionEntry = {
				date : dateStr,
				question : val,
				to : $scope.selectedUsers
			};
			questions.$add(questionEntry);

			$state.go('tabs.qlist'); 
		},

		$scope.selCount = function() {
			var count = 0;
			angular.forEach($scope.selectedUsers, function(v, k) {
				if (v) count++;
			});
			return count;
		}
	}])

.controller('RequestListCtrl', ['$scope', 'KiwanoFB', 
	function($scope, KiwanoFB) {
		$scope.requests = KiwanoFB.getUserRequests();
	}])

.controller('RequestDetailsEditCtrl', ['$scope', '$state', '$stateParams', 'KiwanoFB', 'SettingsService',
	function($scope, $state, $stateParams, KiwanoFB, SettingsService) {
		$scope.request = KiwanoFB.getUserRequest($stateParams.requestId);

		$scope.save = function(scope) {
			$scope.request.reply = scope.reply;
			$scope.request.status = 'C';
			$scope.request.$save();
			$scope.replies = KiwanoFB.getUserQuestionReplies(
				$scope.request.from.qid,
				$scope.request.from.uid
			);
			var d = new Date();
			var dateStr = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

			var userProfile = SettingsService.uprof();
			$scope.replies.$add({
				date : dateStr,
				reply : scope.reply,
				uid : userProfile.uid,
				name : userProfile.first_name + " " + userProfile.last_name
			});
			$state.go('tabs.rlist'); 
		}

		$scope.ignore = function() {
			$scope.request.status = 'I';
			$scope.request.$save();
			$state.go('tabs.rlist'); 
		}
	}])

.controller('RequestDetailsViewCtrl', ['$scope', '$stateParams', 'KiwanoFB',
	function($scope, $stateParams, KiwanoFB) {
		$scope.request = KiwanoFB.getUserRequest($stateParams.requestId);
	}])
;

